'use client';

import { usePathname } from 'next/navigation';
import Nav_ from './Nav_';
import { useAuth } from '@/lib/firebase/AuthContext';

export default function NavWrapper() {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  
  // Don't show navigation on auth page
  if (pathname === '/auth') {
    return null;
  }
  
  return <Nav_ user={currentUser} />;
}
