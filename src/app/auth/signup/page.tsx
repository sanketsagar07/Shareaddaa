'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logoImg from '@/lib/logo.png';
import { Mail, Lock, Eye, EyeOff, User, LockKeyhole, ArrowRight, ShieldCheck } from 'lucide-react';
import styles from '../Auth.module.css';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/auth/firebase';
import { useRouter } from 'next/navigation';
import { setDoc, doc } from 'firebase/firestore';


export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      console.log('Signup successful');
      router.push('/');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logoWrapper}>
          <div className={styles.logoIcon}>
            <Image src={logoImg} alt="ShareAddaa Logo" width={20} height={20} style={{ borderRadius: '4px', objectFit: 'cover' }} />
          </div>
          <span>ShareAddaa</span>
        </div>

      </div>

      <div className={styles.card}>
        <div className={styles.cardLogo}>
          <Image src={logoImg} alt="ShareAddaa Logo" width={28} height={28} style={{ borderRadius: '6px', objectFit: 'cover' }} />
        </div>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>Start sharing files quickly and securely</p>

        <form onSubmit={handleSignup}>
          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Full Name</label>
            </div>
            <div className={styles.inputWrapper}>
              <User size={16} className={styles.inputIcon} />
              <input
                type="text"
                placeholder="Elena Vance"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Email Address</label>

            </div>
            <div className={styles.inputWrapper}>
              <Mail size={16} className={styles.inputIcon} />
              <input
                type="email"
                placeholder="elena@example.com"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Password</label>

            </div>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '8px', fontFamily: 'var(--font-geist-mono), monospace' }}>
              ⓘ Must be at least 8 characters
            </p>
          </div>

          <div className={styles.checkboxRow}>
            <input type="checkbox" id="terms" className={styles.checkbox} required />
            <label htmlFor="terms" className={styles.checkboxLabel}>
              I agree to the <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link>
            </label>
          </div>

          <button type="submit" className={styles.submitButton}>
            Create Account <ArrowRight size={18} />
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account?
          <Link href="/auth/login" className={styles.footerLink}>
            Sign in
          </Link>
        </p>
      </div>

      <div className={styles.securityFooter}>
        <div className={styles.securityBadge}>
          <LockKeyhole size={12} /> ZERO KNOWLEDGE
        </div>
        <span>•</span>
        <div className={`${styles.securityBadge} ${styles.blue}`}>
          <ShieldCheck size={12} /> AES-256-GCM
        </div>
      </div>

      <div className={styles.bottomLinks}>
        <span>© 2026 ShareAddaa Protocol</span>
        <span>•</span>
        <Link href="#">Zero-Knowledge Relay</Link>
        <Link href="#">Terms</Link>
        <Link href="#">Privacy</Link>
        <Link href="#">Network Status</Link>
      </div>
    </div>
  );
}
