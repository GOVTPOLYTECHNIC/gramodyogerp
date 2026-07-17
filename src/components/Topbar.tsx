'use client';
import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

interface TopbarProps {
  onMenuClick: () => void;
  title?: string;
}

export default function Topbar({ onMenuClick, title }: TopbarProps) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center px-4 gap-3 sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-secondary transition-colors lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>
      <div className="flex items-center gap-2 lg:hidden">
        <AppLogo size={28} />
        <span className="font-bold text-sm text-primary">GramodyogERP</span>
      </div>
      {title && (
        <h1 className="text-base font-semibold text-foreground hidden lg:block">
          {title}
        </h1>
      )}
      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search students, receipts..."
            className="input-field pl-9 w-56 h-9 text-xs"
          />
        </div>
        <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
          <Bell size={18} className="text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
          A
        </div>
      </div>
    </header>
  );
}