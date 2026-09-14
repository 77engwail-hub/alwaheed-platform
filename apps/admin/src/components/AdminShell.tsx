'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { getAdminToken } from '../lib/admin-api';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    const token = getAdminToken();
    if (!token && !isLoginPage) {
      router.push('/login');
    } else if (token && isLoginPage) {
      router.push('/');
    }
    setIsChecking(false);
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <main className="min-h-screen bg-stone-950">{children}</main>;
  }

  return (
    <div className="min-h-screen flex bg-stone-100 text-stone-900 font-arabic">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
