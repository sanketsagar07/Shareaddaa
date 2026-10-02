'use client';

import React from 'react';
import { Home, Image as ImageIcon, Settings, Zap } from 'lucide-react';
import Image from 'next/image';
import logoImg from '@/lib/logo.png';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Sidebar.css';

export default function Sidebar() {
  const pathname = usePathname();

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
    </aside>
  );
}
