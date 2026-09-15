'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { getAdminToken } from '../lib/admin-api';
import { Sparkles, Loader2 } from 'lucide-react';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    const token = getAdminToken();
    if (!token && !isLoginPage) {
      setIsAuthenticated(false);
      router.push('/login');
    } else if (token && isLoginPage) {
      setIsAuthenticated(true);
      router.push('/');
    } else {
      setIsAuthenticated(!!token);
    }
    // Close mobile drawer on route change
    setIsMobileSidebarOpen(false);
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <main className="min-h-screen bg-stone-950">{children}</main>;
  }

  // Loading indicator during initial token check to prevent protected content flashing
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-stone-900 border border-gold/40 flex items-center justify-center text-gold mx-auto shadow-gold-glow animate-pulse">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="flex items-center gap-2 text-stone-400 text-xs justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-gold" />
            <span>جاري التحقق من أذونات الدخول...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isLoginPage) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-stone-100 text-stone-900 font-arabic overflow-x-hidden">
      {/* Sidebar (handles both desktop sticky and mobile drawer) */}
      <AdminSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <AdminHeader onToggleMobileMenu={() => setIsMobileSidebarOpen((prev) => !prev)} />
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto w-full max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

