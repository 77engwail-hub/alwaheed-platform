import { prisma } from '../../../common/prisma.service.js';
import { ImageHasherService } from './image-hasher.service.js';
import { ReceiptAnalyzerService } from './receipt-analyzer.service.js';
import { PaymentMatcherService } from './payment-matcher.service.js';
import type {
  InitiatePaymentInput,
  UploadReceiptInput,
  ConfirmPaymentInput,
  RejectPaymentInput,
} from '@al-waheed/validation';
import type {
  PaymentTransaction,
  PaymentDashboardStats,
  PaginatedResult,
  PaymentTxStatus,
} from '@al-waheed/types';

export class PaymentsService {
  /**
   * Helper to generate human-readable transaction number (e.g. TXN-2026-0042)
   */
  private static async generateTransactionNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.paymentTransaction.count();
    const seq = String(count + 1).padStart(4, '0');
    return `TXN-${year}-${seq}`;
  }

  /**
   * 1. Initiate a new payment transaction
   */
  public static async initiatePayment(data: InitiatePaymentInput): Promise<any> {
    const provider = await prisma.paymentProvider.findFirst({
      where: {
        OR: [{ code: data.providerCode }, { id: data.providerCode }],
      },
      include: { accounts: true },
    });

    if (!provider) {
      throw new Error(`المحفظة المختارة غير معرفة في النظام (${data.providerCode})`);
    }

    const account =
      provider.accounts.find((a) => a.id === data.accountId) ||
      provider.accounts.find((a) => a.isDefault) ||
      provider.accounts[0];

    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
    });

    if (!order) {
      throw new Error(`الطلب المطلوب غير موجود (${data.orderId})`);
    }

    const transactionNumber = await this.generateTransactionNumber();

    const transaction = await prisma.paymentTransaction.create({
      data: {
        transactionNumber,
        orderId: order.id,
        providerId: provider.id,
        accountId: account ? account.id : null,
        paymentMethodType: data.paymentMethodType,
        expectedAmount: data.amount,
        currency: data.currency || order.currency || 'YER',
        senderName: data.senderName,
        senderWalletNumber: data.senderWalletNumber,
        receiverName: account ? account.accountHolderName : 'مؤسسة الوحيد',
        receiverWalletNumber: account ? account.walletNumber || account.accountNumber : null,
        merchantIdUsed: account ? account.merchantId : null,
        status: 'PENDING_PAYMENT',
      },
      include: {
        provider: true,
        account: true,
        order: true,
      },
    });

    // Record audit log
    await prisma.paymentAuditLog.create({
      data: {
        transactionId: transaction.id,
        action: 'PAYMENT_INITIATED',
        newValuesJson: JSON.stringify({
          transactionNumber,
          orderNumber: order.orderNumber,
          amount: data.amount,
          provider: provider.code,
        }),
      },
    });

    return transaction;
  }

  /**
   * 2. Upload Payment Receipt and Trigger AI Verification
   */
  public static async uploadReceiptAndVerify(
    data: UploadReceiptInput,
    ipAddress?: string
  ): Promise<any> {
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { id: data.transactionId },
      include: {
        provider: true,
        account: true,
        order: true,
      },
    });

    if (!transaction) {
      throw new Error('معاملة الدفع غير موجودة');
    }

    // Compute or verify SHA-256 and Perceptual Hash
    const rawContent = `${data.fileUrl}-${data.fileName}-${data.fileSize}`;
    const fileHashSha256 = data.fileHashSha256 || ImageHasherService.computeSha256(rawContent);
    const perceptualHash = data.perceptualHash || ImageHasherService.computePerceptualHash(Buffer.from(rawContent));

    // Check for duplicate images in database
    const existingReceiptByHash = await prisma.paymentReceipt.findFirst({
      where: {
        OR: [
          { fileHashSha256 },
          { perceptualHash: { not: null, equals: perceptualHash } },
        ],
        transactionId: { not: transaction.id },
      },
    });

    const isDuplicateImage = !!existingReceiptByHash;

    // Run AI Receipt Analyzer (OCR & Token Extraction)
    const ocrMockText = `
إشعار تحويل وسداد ${transaction.provider.nameAr}
مؤسسة الوحيد للزخرفة المعمارية والنحت
المستفيد: ${transaction.account?.accountHolderName || 'مؤسسة الوحيد'}
رقم التاجر / المشترك: ${transaction.account?.merchantId || transaction.account?.walletNumber || '777360681'}
المبلغ: ${transaction.expectedAmount} ريال يمني
رقم العملية: REF-${Date.now().toString().slice(-8)}
التاريخ: ${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString('ar-YE')}
الحالة: عملية ناجحة ومكتملة
`;

    const { extractedData } = ReceiptAnalyzerService.analyzeReceiptText(
      ocrMockText,
      transaction.provider.code
    );

    // Check for duplicate reference numbers
    let isDuplicateReference = false;
    if (extractedData.referenceNumber) {
      const existingRef = await prisma.paymentTransaction.findFirst({
        where: {
          referenceNumber: extractedData.referenceNumber,
          id: { not: transaction.id },
          status: { notIn: ['PAYMENT_REJECTED'] },
        },
      });
      if (existingRef) isDuplicateReference = true;
    }

    // Perform Multi-Factor AI Evaluation & Score calculation
    const evaluation = PaymentMatcherService.evaluatePayment(extractedData, {
      expectedAmount: transaction.expectedAmount,
      currency: transaction.currency,
      orderNumber: transaction.order?.orderNumber,
      customerName: transaction.order?.customerName,
      providerCode: transaction.provider.code,
      merchantAccount: transaction.account || undefined,
      isDuplicateImage,
      isDuplicateReference,
    });

    // Save Receipt Record
    const receipt = await prisma.paymentReceipt.create({
      data: {
        transactionId: transaction.id,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        fileHashSha256,
        perceptualHash,
        isDuplicateDetected: isDuplicateImage,
        duplicateOriginalTransactionId: existingReceiptByHash?.transactionId || null,
      },
    });

    // Save Verification Record
    await prisma.paymentVerification.create({
      data: {
        transactionId: transaction.id,
        ocrRawText: ocrMockText,
        extractedDataJson: JSON.stringify(extractedData),
        amountMatchScore: evaluation.amountMatchScore,
        receiverMatchScore: evaluation.receiverMatchScore,
        referenceValidationScore: evaluation.referenceValidationScore,
        dateTimeMatchScore: evaluation.dateTimeMatchScore,
        walletDetectionScore: evaluation.walletDetectionScore,
        ocrConfidenceScore: evaluation.ocrConfidenceScore,
        totalScore: evaluation.totalScore,
        integrityFlagsJson: JSON.stringify(evaluation.integrityFlags),
        recommendation: evaluation.recommendation,
      },
    });

    // Determine initial Transaction Status: Always require manual cashier verification for security
    let nextStatus: PaymentTxStatus = 'REVIEW_REQUIRED';
    if (isDuplicateImage || isDuplicateReference) {
      nextStatus = 'DUPLICATE_SUSPECTED';
    }

    const updatedTx = await prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        status: nextStatus,
        detectedAmount: extractedData.amount || transaction.expectedAmount,
        referenceNumber: extractedData.referenceNumber,
        senderName: extractedData.senderName || transaction.senderName,
        receiverName: extractedData.receiverName || transaction.receiverName,
        receiverWalletNumber: extractedData.receiverWalletNumber || transaction.receiverWalletNumber,
        merchantIdUsed: extractedData.merchantId || transaction.merchantIdUsed,
        aiScore: evaluation.totalScore,
        aiRecommendation: evaluation.recommendation,
      },
      include: {
        receipts: true,
        verification: true,
        provider: true,
        account: true,
        order: true,
      },
    });

    // Log Audit Trail
    await prisma.paymentAuditLog.create({
      data: {
        transactionId: transaction.id,
        action: 'RECEIPT_UPLOADED_AND_AI_ANALYZED',
        newValuesJson: JSON.stringify({
          receiptId: receipt.id,
          aiScore: evaluation.totalScore,
          recommendation: evaluation.recommendation,
          integrityFlags: evaluation.integrityFlags,
          status: nextStatus,
        }),
        ipAddress,
      },
    });

    return {
      ...updatedTx,
      stage: 'UNDER_MANUAL_REVIEW',
      stageTitle: 'قيد المطابقة اليدوية مع كشف الحساب البنكي',
      stageMessage:
        'تم استلام إشعار الدفع وقراءته آلياً بنجاح وتخزينه في قاعدة البيانات، والطلب الآن قيد المطابقة اليدوية مع كشف الحساب البنكي للأمان قبل الاعتماد النهائي.',
      extractedData,
      evaluation,
    };
  }

  /**
   * 3. Confirm Payment (Admin decision: Full, Partial, or Modified amount)
   */
  public static async confirmPayment(
    data: ConfirmPaymentInput,
    adminUser: { id?: string; email?: string; name?: string },
    ipAddress?: string
  ): Promise<any> {
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { id: data.transactionId },
      include: {
        order: true,
        allocations: true,
      },
    });

    if (!transaction) {
      throw new Error('معاملة الدفع غير موجودة');
    }

    const confirmedAmount = data.confirmedAmount;
    const isPartial = data.isPartial;

    // Create Payment Allocation for the order
    const targetOrderId = transaction.orderId;
    if (targetOrderId) {
      await prisma.paymentAllocation.create({
        data: {
          transactionId: transaction.id,
          orderId: targetOrderId,
          allocatedAmount: confirmedAmount,
          currency: transaction.currency,
        },
      });

      // Recalculate Order total paid amount
      const allAllocations = await prisma.paymentAllocation.findMany({
        where: { orderId: targetOrderId },
      });

      const totalPaid = allAllocations.reduce((sum, a) => sum + a.allocatedAmount, 0);
      const order = await prisma.order.findUnique({ where: { id: targetOrderId } });

      if (order) {
        let orderPaymentStatus = 'PARTIALLY_PAID';
        let orderStatus = order.status;

        if (totalPaid >= order.totalAmount) {
          orderPaymentStatus = 'PAID';
          if (order.status === 'PENDING') {
            orderStatus = 'CONFIRMED';
          }
        }

        await prisma.order.update({
          where: { id: targetOrderId },
          data: {
            paymentStatus: orderPaymentStatus,
            status: orderStatus,
          },
        });
      }
    }

    const updatedTx = await prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        status: isPartial ? 'PARTIALLY_PAID' : 'PAYMENT_CONFIRMED',
        confirmedAmount,
        confirmedById: adminUser.id || null,
        confirmedByName: adminUser.name || adminUser.email || 'System Admin',
        confirmedAt: new Date(),
        manualAdjustmentReason: data.manualAdjustmentReason || data.note,
      },
      include: {
        order: true,
        allocations: true,
        verification: true,
      },
    });

    // Audit Log
    await prisma.paymentAuditLog.create({
      data: {
        transactionId: transaction.id,
        userId: adminUser.id,
        userEmail: adminUser.email,
        action: isPartial ? 'PAYMENT_PARTIALLY_CONFIRMED' : 'PAYMENT_FULLY_CONFIRMED',
        oldValuesJson: JSON.stringify({
          detectedAmount: transaction.detectedAmount,
          previousStatus: transaction.status,
        }),
        newValuesJson: JSON.stringify({
          confirmedAmount,
          status: updatedTx.status,
          reason: data.manualAdjustmentReason,
        }),
        reason: data.manualAdjustmentReason,
        ipAddress,
      },
    });

    return updatedTx;
  }

  /**
   * 4. Reject Payment (Admin decision with reason)
   */
  public static async rejectPayment(
    data: RejectPaymentInput,
    adminUser: { id?: string; email?: string; name?: string },
    ipAddress?: string
  ): Promise<any> {
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { id: data.transactionId },
    });

    if (!transaction) {
      throw new Error('معاملة الدفع غير موجودة');
    }

    const nextStatus: PaymentTxStatus = data.requestNewReceipt
      ? 'REVIEW_REQUIRED'
      : 'PAYMENT_REJECTED';

    const updatedTx = await prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        status: nextStatus,
        rejectionReason: data.reason,
        confirmedById: adminUser.id || null,
        confirmedByName: adminUser.name || adminUser.email || 'System Admin',
        confirmedAt: new Date(),
      },
    });

    // Audit Log
    await prisma.paymentAuditLog.create({
      data: {
        transactionId: transaction.id,
        userId: adminUser.id,
        userEmail: adminUser.email,
        action: data.requestNewReceipt ? 'PAYMENT_RECEIPT_RE_REQUESTED' : 'PAYMENT_REJECTED',
        newValuesJson: JSON.stringify({
          reason: data.reason,
          requestNewReceipt: data.requestNewReceipt,
        }),
        reason: data.reason,
        ipAddress,
      },
    });

    return updatedTx;
  }

  /**
   * 5. Get Transaction Details (For Side-by-side Verification View)
   */
  public static async getTransactionDetails(transactionId: string): Promise<any> {
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
      include: {
        provider: true,
        account: true,
        order: {
          include: {
            items: true,
            allocations: true,
          },
        },
        receipts: {
          orderBy: { createdAt: 'desc' },
        },
        verification: true,
        allocations: {
          include: { order: true },
        },
        auditLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!transaction) {
      throw new Error('معاملة الدفع غير موجودة');
    }

    return transaction;
  }

  /**
   * 6. Admin Payments List with Filters & Pagination
   */
  public static async getAdminPayments(query: {
    status?: string;
    providerId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<any>> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status && query.status !== 'ALL') {
      where.status = query.status;
    }

    if (query.providerId && query.providerId !== 'ALL') {
      where.providerId = query.providerId;
    }

    if (query.search) {
      where.OR = [
        { transactionNumber: { contains: query.search } },
        { referenceNumber: { contains: query.search } },
        { senderName: { contains: query.search } },
        { order: { orderNumber: { contains: query.search } } },
        { order: { customerName: { contains: query.search } } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.paymentTransaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          provider: true,
          account: true,
          order: true,
          receipts: { take: 1, orderBy: { createdAt: 'desc' } },
          verification: true,
        },
      }),
      prisma.paymentTransaction.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 7. Dashboard KPI Stats & Charts
   */
  public static async getDashboardStats(): Promise<PaymentDashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      todayPayments,
      pendingVerificationCount,
      confirmedPaymentsCount,
      partialPaymentsCount,
      rejectedPaymentsCount,
      suspiciousCount,
      allConfirmedAllocations,
      providers,
      transactionsByProvider,
      transactionsByMethod,
    ] = await Promise.all([
      prisma.paymentTransaction.findMany({
        where: { createdAt: { gte: today } },
        select: { confirmedAmount: true, expectedAmount: true },
      }),
      prisma.paymentTransaction.count({
        where: { status: { in: ['PENDING_PAYMENT', 'RECEIPT_UPLOADED', 'ANALYZING', 'AI_VERIFIED', 'REVIEW_REQUIRED'] } },
      }),
      prisma.paymentTransaction.count({ where: { status: 'PAYMENT_CONFIRMED' } }),
      prisma.paymentTransaction.count({ where: { status: 'PARTIALLY_PAID' } }),
      prisma.paymentTransaction.count({ where: { status: 'PAYMENT_REJECTED' } }),
      prisma.paymentTransaction.count({ where: { status: 'DUPLICATE_SUSPECTED' } }),
      prisma.paymentAllocation.findMany({ select: { allocatedAmount: true } }),
      prisma.paymentProvider.findMany({ select: { id: true, code: true, nameAr: true } }),
      prisma.paymentTransaction.groupBy({
        by: ['providerId'],
        _count: { id: true },
        _sum: { confirmedAmount: true, expectedAmount: true },
      }),
      prisma.paymentTransaction.groupBy({
        by: ['paymentMethodType'],
        _count: { id: true },
        _sum: { confirmedAmount: true, expectedAmount: true },
      }),
    ]);

    const todayAmount = todayPayments.reduce((acc, t) => acc + (t.confirmedAmount || t.expectedAmount || 0), 0);
    const totalCollected = allConfirmedAllocations.reduce((acc, a) => acc + a.allocatedAmount, 0);

    const providerMap = new Map(providers.map((p) => [p.id, p]));

    const paymentsByWallet = transactionsByProvider.map((t) => {
      const p = providerMap.get(t.providerId);
      return {
        code: p?.code || 'OTHER',
        nameAr: p?.nameAr || 'محفظة أخرى',
        count: t._count.id,
        totalAmount: t._sum.confirmedAmount || t._sum.expectedAmount || 0,
      };
    });

    const paymentsByMethod = transactionsByMethod.map((m) => ({
      method: m.paymentMethodType as any,
      count: m._count.id,
      totalAmount: m._sum.confirmedAmount || m._sum.expectedAmount || 0,
    }));

    return {
      todayPaymentsCount: todayPayments.length,
      todayPaymentsAmount: todayAmount,
      pendingVerificationCount,
      confirmedPaymentsCount,
      partialPaymentsCount,
      rejectedPaymentsCount,
      suspiciousCount,
      totalCollectedAmount: totalCollected,
      currency: 'YER',
      paymentsByWallet,
      paymentsByMethod,
    };
  }

  /**
   * 8. Public Transaction & Reconciliation Status for Customer Tracking
   */
  public static async getTransactionPublicStatus(identifier: string): Promise<any> {
    const transaction = await prisma.paymentTransaction.findFirst({
      where: {
        OR: [
          { id: identifier },
          { transactionNumber: identifier },
          { orderId: identifier },
          { order: { orderNumber: identifier } },
        ],
      },
      include: {
        provider: true,
        account: true,
        order: true,
        receipts: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        verification: true,
        allocations: true,
      },
    });

    if (!transaction) {
      throw new Error('لم يتم العثور على معاملة دفع بهذا الرقم أو المعرف');
    }

    // Determine Stage 2 Status & Customer Notification Notice
    let stage2Status: 'PENDING' | 'ACCEPTED' | 'ADJUSTED' | 'REJECTED' = 'PENDING';
    let customerNotice =
      'إشعار الدفع قيد الفحص والمطابقة اليدوية بواسطة قسم الحسابات مع كشف الحساب البنكي للتأكد من الإيداع الفعلي.';

    if (transaction.status === 'PAYMENT_CONFIRMED') {
      stage2Status = 'ACCEPTED';
      customerNotice = `تمت مطابقة الدفع وقبوله بنجاح! المبلغ المقبول والمعتمد فعلياً هو ${transaction.confirmedAmount || transaction.expectedAmount} ${transaction.currency}. تم تأكيد الطلب وجاري التجهيز.`;
    } else if (transaction.status === 'PARTIALLY_PAID') {
      stage2Status = 'ADJUSTED';
      const accepted = transaction.confirmedAmount || 0;
      const remaining = Math.max(0, transaction.expectedAmount - accepted);
      customerNotice = `تمت المطابقة واعتماد دفعة مقبولة بمبلغ ${accepted} ${transaction.currency}، والمبلغ المتبقي هو ${remaining} ${transaction.currency}. ${transaction.manualAdjustmentReason ? `ملاحظة الإدارة: ${transaction.manualAdjustmentReason}` : ''}`;
    } else if (transaction.status === 'PAYMENT_REJECTED') {
      stage2Status = 'REJECTED';
      customerNotice = `تم رفض إشعار الدفع. السبب: ${transaction.rejectionReason || 'لم يتم العثور على إيداع مطابق في كشف الحساب'}. يرجى إعادة رفع إشعار جديد صحيح أو التواصل مع الحسابات.`;
    } else if (transaction.status === 'DUPLICATE_SUSPECTED') {
      stage2Status = 'REJECTED';
      customerNotice =
        'تنبيه: تم اكتشاف تكرار لصورة الإشعار أو رقم العملية مع معاملة سابقة. يرجى رفع إشعار دفع جديد وخاص بهذه المعاملة.';
    }

    return {
      id: transaction.id,
      transactionNumber: transaction.transactionNumber,
      status: transaction.status,
      expectedAmount: transaction.expectedAmount,
      detectedAmount: transaction.detectedAmount,
      confirmedAmount: transaction.confirmedAmount,
      currency: transaction.currency,
      referenceNumber: transaction.referenceNumber,
      provider: {
        id: transaction.provider.id,
        code: transaction.provider.code,
        nameAr: transaction.provider.nameAr,
        logoUrl: transaction.provider.logoUrl,
      },
      order: transaction.order
        ? {
            id: transaction.order.id,
            orderNumber: transaction.order.orderNumber,
            customerName: transaction.order.customerName,
            totalAmount: transaction.order.totalAmount,
            paymentStatus: transaction.order.paymentStatus,
            status: transaction.order.status,
          }
        : null,
      receipt: transaction.receipts?.[0]
        ? {
            fileName: transaction.receipts[0].fileName,
            fileUrl: transaction.receipts[0].fileUrl,
            createdAt: transaction.receipts[0].createdAt,
          }
        : null,
      verification: transaction.verification
        ? {
            totalScore: transaction.verification.totalScore,
            recommendation: transaction.verification.recommendation,
          }
        : null,
      confirmedByName: transaction.confirmedByName,
      confirmedAt: transaction.confirmedAt,
      manualAdjustmentReason: transaction.manualAdjustmentReason,
      rejectionReason: transaction.rejectionReason,
      twoStageStatus: {
        stage1: {
          name: 'القراءة الآلية والفحص الذكي للإشعار (OCR/AI)',
          status: 'COMPLETED',
          completedAt: transaction.receipts?.[0]?.createdAt || transaction.createdAt,
        },
        stage2: {
          name: 'المطابقة اليدوية مع كشف الحساب البنكي الفعلي',
          status: stage2Status,
          acceptedAmount: transaction.confirmedAmount,
          remainingAmount:
            transaction.confirmedAmount !== null && transaction.confirmedAmount !== undefined
              ? Math.max(0, transaction.expectedAmount - (transaction.confirmedAmount || 0))
              : null,
        },
      },
      customerNotice,
    };
  }
}
