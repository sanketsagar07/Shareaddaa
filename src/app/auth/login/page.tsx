'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logoImg from '@/lib/logo.png';
import { Mail, Lock, Eye, EyeOff, LockKeyhole, ArrowRight, ShieldCheck } from 'lucide-react';
import styles from '../Auth.module.css';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/auth/firebase";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      setError('Invalid email or password. Please try again.');
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
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Enter your credentials to access your account</p>

        {error && (
          <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '16px', border: '1px solid #fca5a5' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Email Address</label>
            </div>
            <div className={styles.inputWrapper}>
              <Mail size={16} className={styles.inputIcon} />
              <input
                type="email"
                placeholder="name@example.com"
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
              <Link href="/auth/forgot-password" className={styles.forgotPassword}>
                Forgot password?
              </Link>
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
          </div>

          <div className={styles.checkboxRow}>
            <input type="checkbox" id="remember" className={styles.checkbox} />
            <label htmlFor="remember" className={styles.checkboxLabel}>
              Remember me
            </label>
          </div>

          <button type="submit" className={styles.submitButton}>
            Sign In <ArrowRight size={18} />
          </button>
        </form>

        <p className={styles.footerText}>
          Don&apos;t have an account?
          <Link href="/auth/signup" className={styles.footerLink}>
            Sign up
          </Link>
        </p>
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






