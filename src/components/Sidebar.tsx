'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { LayoutDashboard, Users, IndianRupee, CalendarCheck, CreditCard, LogOut, ChevronLeft, ChevronRight, GraduationCap, FileText, Settings, BarChart2, Scale, TrendingUp, AlertTriangle, Wallet, CalendarDays, KeyRound, BadgeIndianRupee,  } from 'lucide-react';
import { getRole, clearRole, UserRole, roleRoutes } from '@/lib/roleAccess';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  group: string;
}

const navItems: NavItem[] = [
  {
    id: 'nav-dashboard',
    label: 'Dashboard',
    href: '/',
    icon: <LayoutDashboard size={18} />,
    group: 'Main',
  },
  {
    id: 'nav-students',
    label: 'Student Management',
    href: '/student-management',
    icon: <Users size={18} />,
    group: 'Academics',
  },
  {
    id: 'nav-fees',
    label: 'Fee Management',
    href: '/fee-management',
    icon: <IndianRupee size={18} />,
    group: 'Academics',
  },
  {
    id: 'nav-attendance',
    label: 'Staff Attendance',
    href: '/staff-attendance',
    icon: <CalendarCheck size={18} />,
    group: 'Academics',
  },
  {
    id: 'nav-idcard',
    label: 'ID Cards',
    href: '/id-cards',
    icon: <CreditCard size={18} />,
    group: 'Documents',
  },
  {
    id: 'nav-gatepass',
    label: 'Gate Pass',
    href: '/gate-pass',
    icon: <FileText size={18} />,
    group: 'Documents',
  },
  {
    id: 'nav-college-dashboards',
    label: 'College Dashboards',
    href: '/college-dashboards',
    icon: <BarChart2 size={18} />,
    group: 'Reports',
  },
  {
    id: 'nav-financial-reconciliation',
    label: 'Financial Reconciliation',
    href: '/financial-reconciliation',
    icon: <Scale size={18} />,
    group: 'Reports',
  },
  {
    id: 'nav-enrollment-trends',
    label: 'Enrollment Trends',
    href: '/enrollment-trends',
    icon: <TrendingUp size={18} />,
    group: 'Reports',
  },
  {
    id: 'nav-defaulter-list',
    label: 'Defaulter List',
    href: '/defaulter-list',
    icon: <AlertTriangle size={18} />,
    group: 'Reports',
  },
  {
    id: 'nav-reports',
    label: 'Reports',
    href: '/reports',
    icon: <GraduationCap size={18} />,
    group: 'Reports',
  },
  {
    id: 'nav-staff-payroll',
    label: 'Staff Payroll',
    href: '/staff-payroll',
    icon: <Wallet size={18} />,
    group: 'Staff',
  },
  {
    id: 'nav-staff-salary',
    label: 'Staff Salary Management',
    href: '/staff-salary',
    icon: <BadgeIndianRupee size={18} />,
    group: 'Staff',
  },
  {
    id: 'nav-leave-management',
    label: 'Leave Management',
    href: '/leave-management',
    icon: <CalendarDays size={18} />,
    group: 'Staff',
  },
  {
    id: 'nav-settings',
    label: 'Settings',
    href: '/settings',
    icon: <Settings size={18} />,
    group: 'System',
  },
  {
    id: 'nav-change-password',
    label: 'Change Password',
    href: '/change-password',
    icon: <KeyRound size={18} />,
    group: 'System',
  },
];

const groups = ['Main', 'Academics', 'Documents', 'Reports', 'Staff', 'System'];

const roleLabels: Record<UserRole, { name: string; email: string; initial: string }> = {
  admin: { name: 'Admin User', email: 'admin@gramodyog.in', initial: 'A' },
  staff: { name: 'Staff User', email: 'staff.rajiv@gramodyog.in', initial: 'S' },
  student: { name: 'Student', email: 'RGP-2026-041', initial: 'ST' },
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    setRole(getRole());
  }, []);

  // Filter nav items based on role
  const allowedRoutes = role ? roleRoutes[role] : null;
  const visibleItems = allowedRoutes
    ? navItems.filter((item) => allowedRoutes.includes(item.href))
    : navItems;

  const userInfo = role ? roleLabels[role] : roleLabels['admin'];

  const handleLogout = () => {
    clearRole();
    window.location.href = '/login-screen';
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-card border-r border-border flex flex-col z-40 sidebar-transition ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center border-b border-border h-16 px-3 ${
          collapsed ? 'justify-center' : 'gap-2'
        }`}
      >
        <AppLogo size={32} />
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-primary leading-tight truncate">
              GramodyogERP
            </span>
            <span className="text-xs text-muted-foreground leading-tight truncate">
              GSS Institutions
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {groups.map((group) => {
          const items = visibleItems.filter((n) => n.group === group);
          if (items.length === 0) return null;
          return (
            <div key={`group-${group}`} className="mb-3">
              {!collapsed && (
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-1">
                  {group}
                </p>
              )}
              {items.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`nav-item ${
                      isActive ? 'nav-item-active' : 'nav-item-inactive'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <span className={isActive ? 'text-primary' : ''}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge && item.badge > 0 ? (
                      <span className="ml-auto bg-danger text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {item.badge}
                      </span>
                    ) : null}
                    {collapsed && item.badge && item.badge > 0 ? (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
                    ) : null}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border p-2 space-y-1">
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 mb-1">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
              {userInfo.initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {userInfo.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userInfo.email}
              </p>
            </div>
          </div>
        )}

        {/* Toggle collapse */}
        <button
          onClick={onToggle}
          className={`nav-item nav-item-inactive w-full ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="flex-1 truncate">Collapse</span>}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`nav-item nav-item-inactive w-full text-danger hover:bg-danger/10 ${collapsed ? 'justify-center' : ''}`}
          title="Logout"
        >
          <LogOut size={18} />
          {!collapsed && <span className="flex-1 truncate">Logout</span>}
        </button>
      </div>
    </aside>
  );
}