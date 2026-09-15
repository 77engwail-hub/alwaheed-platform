'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderPayPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  useEffect(() => {
    if (params?.id) {
      router.replace(`/checkout?orderId=${params.id}`);
    }
  }, [params?.id, router]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3 p-8">
      <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      <p className="text-xs text-stone-400">جاري التوجيه إلى بوابة دفع وسداد الطلب...</p>
    </div>
  );
}
