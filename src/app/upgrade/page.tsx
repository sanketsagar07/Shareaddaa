'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/home/Sidebar';
import {
  CheckCircle2,
  Shield,
  Monitor,
  Lock,
  Code,
  Globe,
  Zap,
  ArrowRight
} from 'lucide-react';
import styles from './Upgrade.module.css';

export default function UpgradePage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showError, setShowError] = useState(false);

  const proPrice = billingCycle === 'monthly' ? '$12' : '$10';
  const proSubtext = billingCycle === 'monthly'
    ? '/ MONTH BILLED MONTHLY'
    : '/ MONTH BILLED ANNUALLY';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div className={styles.upgradeContainer}>

          <div className={styles.headerPill}>
            <div className={styles.pillDot}></div>
            ENTERPRISE INFRASTRUCTURE
          </div>

          <h1 className={styles.title}>Simple File Sharing</h1>
          <p className={styles.subtitle}>
            Zero-knowledge ephemeral pipelines engineered for high-throughput enterprise security. Select the transmission tier tailored to your operational scale.
          </p>

          <div className={styles.toggleContainer}>
            <button
              className={`${styles.toggleBtn} ${billingCycle === 'monthly' ? styles.active : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              MONTHLY BILLING
            </button>
            <button
              className={`${styles.toggleBtn} ${billingCycle === 'yearly' ? styles.active : ''}`}
              onClick={() => setBillingCycle('yearly')}
            >
              ANNUAL BILLING <span className={styles.saveBadge}>SAVE 20%</span>
            </button>
          </div>

          <div className={styles.pricingCards}>
            {/* Community Tier */}
            <div className={`${styles.card} ${styles.cardCommunity}`}>
              <div className={styles.cardHeaderRow}>
                <h2 className={styles.cardTitle}>
                  <Monitor size={24} color="#a1a1aa" />
                  Community Tier
                </h2>
                <span className={`${styles.cardBadge} ${styles.badgeCommunity}`}>FOREVER FREE</span>
              </div>
              <p className={styles.cardSubtitle}>
                Essential zero-knowledge transfer primitives for independent developers and ad-hoc local node syncing.
              </p>

              <div className={styles.priceContainer}>
                <h3 className={styles.price}>$0</h3>
                <span className={styles.priceLabel}>/ FOREVER FREE</span>
              </div>

              <div className={styles.featuresDivider}>TRANSMISSION CAPABILITIES</div>

              <ul className={styles.featuresList}>
                <li className={styles.featureItem}>
                  <CheckCircle2 size={18} className={styles.featureIcon} />
                  <span>Up to <strong style={{ color: '#fff' }}>1 GB</strong> per single transmission payload</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckCircle2 size={18} className={styles.featureIcon} />
                  <span>Standard P2P relay speeds (<span className={styles.featureHighlight}>up to 10 MB/s</span>)</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckCircle2 size={18} className={styles.featureIcon} />
                  <span>Zero-Knowledge end-to-end encryption (AES-256)</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckCircle2 size={18} className={styles.featureIcon} />
                  <span>Basic active transfer dashboard & history (Last 10 jobs)</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckCircle2 size={18} className={styles.featureIcon} />
                  <span>Web-client browser-based tunneling</span>
                </li>
              </ul>

              <button className={`${styles.cardAction} ${styles.actionCommunity}`} disabled>
                <CheckCircle2 size={18} style={{ marginRight: '8px' }} />
                YOUR ACTIVE PLAN
              </button>
              <div className={styles.actionSubtitle}>Current node default assignment</div>
            </div>

            {/* Pro Enclave */}
            <div className={`${styles.card} ${styles.cardPro}`}>
              <div className={styles.cardHeaderRow}>
                <h2 className={styles.cardTitle}>
                  <Shield size={24} color="#a78bfa" />
                  Pro Enclave
                </h2>
                <span className={`${styles.cardBadge} ${styles.badgePro}`}>RECOMMENDED</span>
              </div>
              <p className={styles.cardSubtitle}>
                Unrestricted ultra-bandwidth pipeline featuring custom cryptographic enclaves, permanent storage, and custom vanity roots.
              </p>

              <div className={styles.priceContainer}>
                <h3 className={styles.price}>{proPrice}</h3>
                <span className={styles.priceLabel}>{proSubtext}</span>
              </div>

              <div className={styles.featuresDivider}>ALL COMMUNITY STARTER FEATURES, PLUS:</div>

              <ul className={styles.featuresList}>
                <li className={styles.featureItem}>
                  <CheckCircle2 size={18} className={styles.featureIcon} />
                  <span><strong className={styles.proHighlight}>Unlimited payload size</strong> — No file size bottlenecks</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckCircle2 size={18} className={styles.featureIcon} />
                  <span>Turbo Relay Acceleration (<span className={styles.featureHighlight}>Up to 10 Gbps</span> multi-pipe multiplexing)</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckCircle2 size={18} className={styles.featureIcon} />
                  <span>Permanent or custom link life (Up to 90 days or non-expiring)</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckCircle2 size={18} className={styles.featureIcon} />
                  <span>Password protected transfers & self-destructing links upon read</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckCircle2 size={18} className={styles.featureIcon} />
                  <span>Custom organization branding & vanity sharing subdomains</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckCircle2 size={18} className={styles.featureIcon} />
                  <span><strong className={styles.featureHighlight}>1 TB permanent Zero-Knowledge</strong> encrypted cloud vault</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckCircle2 size={18} className={styles.featureIcon} />
                  <span>Dedicated isolated hardware enclave nodes (EU, US-East)</span>
                </li>
                <li className={styles.featureItem}>
                  <CheckCircle2 size={18} className={styles.featureIcon} />
                  <span>Priority cryptographic pipeline triage & 24/7 SecOps desk</span>
                </li>
              </ul>

              <button 
                className={`${styles.cardAction} ${styles.actionPro}`}
                onClick={() => setShowError(true)}
              >
                Upgrade to Pro Enclave <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </button>
              {showError && (
                <div style={{ color: '#ef4444', marginTop: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                  Server is not working
                </div>
              )}
              <div className={styles.actionSubtitle} style={{ color: '#a78bfa' }}>
                14-day zero-risk money-back guarantee • Cancel anytime
              </div>
            </div>
          </div>

          {/* Trust Strip */}
          <div className={styles.trustStrip}>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}><Lock size={20} /></div>
              <div className={styles.trustText}>
                <h4>AES-256 Encryption</h4>
                <p>Zero-Knowledge Architecture</p>
              </div>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}><Code size={20} /></div>
              <div className={styles.trustText}>
                <h4 style={{ color: '#38bdf8' }}>Next.js Web App</h4>
                <p>Ephemeral Infrastructure Pipeline</p>
              </div>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}><Globe size={20} /></div>
              <div className={styles.trustText}>
                <h4 style={{ color: '#a78bfa' }}>Global Edge Network</h4>
                <p>Multi-Region Geo-DNS Nodes</p>
              </div>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}><Zap size={20} /></div>
              <div className={styles.trustText}>
                <h4>Unlimited Bandwidth</h4>
                <p>No P2P Throttling Algorithms</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className={styles.faqSection}>
            <div className={styles.faqHeader}>
              <span className={styles.faqPill}>FREQUENTLY ASKED QUESTIONS</span>
              <h2 className={styles.faqTitle}>Telemetry, Encryption & Invoicing Details</h2>
            </div>

            <div className={styles.faqGrid}>
              <div className={styles.faqCard}>
                <h4>What occurs when the 1 GB limit is exceeded on Community?</h4>
                <p>
                  Community uploads are capped at 1 GB per transfer payload. Pro Enclave users enjoy unlimited payloads using fragmented packet streams.
                </p>
              </div>

              <div className={styles.faqCard}>
                <h4>Does the platform possess keys to decrypt our files?</h4>
                <p>
                  Never. All encryption keys are derived client-side via WebCrypto. Our relay nodes process exclusively ciphertext chunks.
                </p>
              </div>

              <div className={styles.faqCard}>
                <h4>Can I modify my subscription cadence anytime?</h4>
                <p>
                  Yes, switch between monthly and annual billing with prorated adjustments, or revert to Community without downtime.
                </p>
              </div>

              <div className={styles.faqCard}>
                <h4>What payment processors and cryptocurrencies are supported?</h4>
                <p>
                  We support major credit cards via Stripe, as well as native zero-knowledge cryptocurrency settlement (USDC, BTC, Monero).
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
