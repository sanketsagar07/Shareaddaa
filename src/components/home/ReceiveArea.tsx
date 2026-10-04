'use client';

import React, { useState } from 'react';
import { Download, QrCode, FileIcon } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/auth/firebase';
import './ReceiveArea.css';

export default function ReceiveArea() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [receivedFiles, setReceivedFiles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleReceive = async (code: string) => {
    if (!code) return;
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, 'shares', code.toUpperCase());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setReceivedFiles((prev) => [data, ...prev]);
        
        // Trigger download
        if (data.downloadURL) {
          const a = document.createElement('a');
          a.href = data.downloadURL;
          a.download = data.fileName || 'download';
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } else {
        setError("Invalid OTP or file not found.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while receiving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="receive-area-container">
      <div className="receive-header">
        <div className="hub-tag">RECEIVE STATION</div>
      </div>

      <h2 className="hub-title" style={{ fontSize: '1.5rem' }}>Receive Files</h2>
      <p className="hub-subtitle">
        Enter a 6-digit OTP or scan a QR code to receive files directly.
      </p>

      <div className="receive-actions">
        <button 
          className="scan-btn" 
          onClick={() => {
            setIsScanning(!isScanning);
            if (!isScanning) {
              alert("QR Scanning functionality would open here.");
            }
          }}
        >
          <QrCode size={20} />
          Scan QR Code
        </button>

        <div className="divider">OR</div>

        <div className="otp-container">
          <input 
            type="text" 
            placeholder="Enter 6-digit OTP" 
            value={otp}
            onChange={(e) => setOtp(e.target.value.toUpperCase())}
            maxLength={6}
            className="otp-input"
          />
          <button 
            className="receive-btn" 
            onClick={() => handleReceive(otp)}
            disabled={loading || otp.length < 6}
          >
            <Download size={18} />
            {loading ? 'Receiving...' : 'Receive'}
          </button>
        </div>
        {error && <div className="error-text">{error}</div>}
      </div>

      {receivedFiles.length > 0 && (
        <div className="received-files-section">
          <h3>Received Files</h3>
          <div className="received-files-list">
            {receivedFiles.map((file, idx) => (
              <div key={idx} className="received-file-card">
                <FileIcon size={20} color="#8b5cf6" />
                <div className="file-info">
                  <span className="file-name">{file.fileName}</span>
                  <span className="file-status">Downloaded</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
