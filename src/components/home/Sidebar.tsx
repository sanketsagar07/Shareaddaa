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
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email || 'User');
        setUserPhoto(user.photoURL);
      } else {
        setUserName('Guest');
        setUserPhoto(null);
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
          <span>File Manager</span>
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
        <img
          src={userPhoto || logoImg.src}
          alt="User avatar"
          width={40}
          height={40}
          className="user-avatar"
          style={{ borderRadius: '50%', objectFit: 'cover' }}
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
