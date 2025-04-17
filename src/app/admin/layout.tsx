import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

// Using the same layout as root since Header, Footer, Sidebar are now dynamic
export default function AdminLayout({ children }: AdminLayoutProps) {
  return <>{children}</>;
}