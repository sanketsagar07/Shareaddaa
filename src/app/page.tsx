'use client';

import Sidebar from "@/components/home/Sidebar";
import UploadArea from "@/components/home/UploadArea";
import ReceiveArea from "@/components/home/ReceiveArea";
import { useState } from "react";
import styles from "./Home.module.css";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send');

  return (
    <div className={styles.homeLayout}>
      <Sidebar />
      <main className={styles.homeMain}>
        {/* Responsive Segmented Control for Mobile/Tablet */}
        <div className={styles.mobileToggle}>
          <button 
            className={`${styles.toggleBtn} ${activeTab === 'send' ? styles.active : ''}`}
            onClick={() => setActiveTab('send')}
          >
            SEND
          </button>
          <button 
            className={`${styles.toggleBtn} ${activeTab === 'receive' ? styles.active : ''}`}
            onClick={() => setActiveTab('receive')}
          >
            RECEIVE
          </button>
        </div>

        {/* Desktop Left / Mobile Active Tab */}
        <div className={`${styles.uploadContainer} ${activeTab === 'send' ? styles.active : ''}`}>
          <UploadArea />
        </div>

        {/* Desktop Right / Mobile Active Tab */}
        <div className={`${styles.receiveContainer} ${activeTab === 'receive' ? styles.active : ''}`}>
          <ReceiveArea />
        </div>
      </main>
    </div>
  );
}
