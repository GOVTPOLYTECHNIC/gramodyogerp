'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { getRole, canAccess, getDefaultRoute } from '@/lib/roleAccess';
import { usePathname } from 'next/navigation';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const role = getRole();
    if (!role) {
      // No role set — redirect to login
      window.location.href = '/login-screen';
      return;
    }
    if (!canAccess(role, pathname)) {
      // Role doesn't have access to this route — redirect to their default
      window.location.href = getDefaultRoute(role);
      return;
    }
    setChecked(true);
  }, [pathname]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop always visible, mobile overlay */}
      <div
        className={`fixed lg:relative z-40 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />
      </div>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col min-w-0 sidebar-transition ${
          collapsed ? 'lg:ml-16' : 'lg:ml-60'
        }`}
      >
        <Topbar
          onMenuClick={() => setMobileOpen((o) => !o)}
          title={title}
        />
        <main className="flex-1 p-4 lg:p-6 xl:p-8 max-w-screen-2xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}