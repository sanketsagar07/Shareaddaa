'use client';

import React, { useState } from 'react';
import { Download, QrCode, FileIcon } from 'lucide-react';
import { doc, getDoc, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, getBlob } from 'firebase/storage';
import { db, storage, auth } from '@/app/auth/firebase';
import './ReceiveArea.css';

export default function ReceiveArea() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [receivedFiles, setReceivedFiles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const downloadFile = async (downloadURL: string, fileName: string, filePath?: string) => {
    try {
      let blob: Blob;
      if (filePath) {
        const fileRef = ref(storage, filePath);
        blob = await getBlob(fileRef);
      } else if (downloadURL) {
        const response = await fetch(downloadURL);
        blob = await response.blob();
      } else {
        return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Delay revoking slightly to ensure download starts
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
      
    } catch (err: any) {
      console.error("Firebase Storage Download Error:", err);
      
      let errorMsg = "Unknown Error";
      if (err && err.message) {
        errorMsg = err.message;
      } else if (typeof err === "string") {
        errorMsg = err;
      }

      alert("Download failed!\nCode: " + (err?.code || 'None') + "\nDetails: " + errorMsg + "\n\nIf this says 'CORS', you MUST run the gsutil command in Google Cloud Shell.");
    }
  };

  const handleReceive = async (code: string) => {
    if (!code) return;
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, 'shares', code.toUpperCase());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        let allFiles: any[] = [];
        
        if (data.downloadURL) {
          allFiles.push(data);
        }

        const filesSnap = await getDocs(collection(db, `shares/${code.toUpperCase()}/files`));
        filesSnap.forEach((d) => {
          allFiles.push(d.data());
        });

        if (allFiles.length > 0) {
          setReceivedFiles(allFiles);
          
          // Save received files to user account if logged in
          if (auth.currentUser) {
            const uid = auth.currentUser.uid;
            for (const file of allFiles) {
              try {
                await addDoc(collection(db, `users/${uid}/receivedDocuments`), {
                  fileName: file.fileName || 'Unknown File',
                  filePath: file.filePath || null,
                  downloadURL: file.downloadURL || null,
                  receivedAt: serverTimestamp(),
                  shareCode: code.toUpperCase()
                });
              } catch (e) {
                console.error("Failed to save received document to user account:", e);
              }
            }
          }
        } else {
          setError("No files found for this code.");
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
        <div className="received-files-section" style={{ marginTop: '2rem' }}>
          <div className="received-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Received Files</h3>
            <button 
              onClick={() => receivedFiles.forEach(f => downloadFile(f.downloadURL, f.fileName))}
              className="download-all-btn"
              style={{
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                color: '#8b5cf6',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={14} /> Download All
            </button>
          </div>
          <div className="received-files-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {receivedFiles.map((file, idx) => (
              <div key={idx} className="received-file-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--card-bg, #1a1a1f)', borderRadius: '8px', border: '1px solid var(--border-color, #2d2d34)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                  <FileIcon size={24} color="#a78bfa" style={{ flexShrink: 0 }} />
                  <div className="file-info" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <span className="file-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.9rem', color: 'var(--text-color, #f3f3f4)', fontWeight: 500 }}>{file.fileName}</span>
                    <span className="file-status" style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                      {file.size ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : 'Ready'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => downloadFile(file.downloadURL, file.fileName)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8b5cf6',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px'
                  }}
                  title="Download File"
                >
                  <Download size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
