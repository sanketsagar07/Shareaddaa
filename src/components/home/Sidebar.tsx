'use client';

import React, { useEffect, useState } from 'react';
import { Home, Image as ImageIcon, Settings, Zap, ChevronsUpDown } from 'lucide-react';
import Image from 'next/image';
import logoImg from '@/lib/logo.png';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Sidebar.css';
import { auth } from '@/app/auth/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Sidebar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState('Loading...');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email || 'User');
      } else {
        setUserName('Guest');
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <Image
          src={logoImg}
          alt="ShareAddaa Logo"
          width={40}
          height={40}
          style={{ borderRadius: '8px', objectFit: 'cover' }}
        />
        <h2 className="logo-text" style={{ marginLeft: '8px' }}>ShareAddaa</h2>
      </div>

      <nav className="nav-menu">
        <Link href="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link href="/albums" className={`nav-item ${pathname === '/albums' ? 'active' : ''}`}>
          <ImageIcon size={20} />
          <span>Album & Media</span>
        </Link>
        <Link href="/upgrade" className={`nav-item ${pathname === '/upgrade' ? 'active' : ''}`}>
          <Zap size={20} />
          <span>Upgrade</span>
        </Link>
        <Link href="/settings" className={`nav-item ${pathname === '/settings' ? 'active' : ''}`}>
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </nav>

      <div className="user-profile">
        <Image
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
          alt="User avatar"
          width={40}
          height={40}
          className="user-avatar"
          unoptimized
        />
        <div className="user-info">
          <p className="user-name">{userName}</p>
          <p className="user-status">
            <span className="status-dot"></span> Free
          </p>
        </div>
        <ChevronsUpDown size={16} className="user-dropdown-icon" />
      </div>
    </aside>
  );
}
