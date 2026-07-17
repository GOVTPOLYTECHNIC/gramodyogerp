import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'primary';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantMap: Record<BadgeVariant, string> = {
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  info: 'badge-info',
  muted: 'badge-muted',
  primary: 'bg-blue-100 text-blue-800 badge',
};

export default function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span className={`${variantMap[variant]} ${className}`}>{children}</span>
  );
}