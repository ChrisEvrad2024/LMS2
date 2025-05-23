'use client';
import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';

type RoleGuardProps = {
  children: ReactNode;
  allowedRoles: ('admin' | 'instructor' | 'student')[];
};

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user || !allowedRoles.includes(user.role)) {
    redirect('/dashboard');
    return null;
  }

  return <>{children}</>;
}
