'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CloudUpload, PlusCircle, FolderPlus, Shield, Zap, Database, X, Pause, Play, File as FileIcon, Link2, Copy, QrCode, Wifi, Download, Printer, Mail } from 'lucide-react';
import './UploadArea.css';
import { ref, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { storage, db, auth } from "@/app/auth/firebase";
import { QRCodeSVG } from "qrcode.react";

export default function UploadArea() {
  const [files, setFiles] = useState<File[]>([]);
  const [showShareUI, setShowShareUI] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [shareCode, setShareCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);


  useEffect(() => {
    if (!showShareUI) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showShareUI]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files as FileList)]);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const triggerFolderInput = () => {
    if (folderInputRef.current) folderInputRef.current.click();
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const handleFileUpload = async (file: File, code: string) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        alert("Please login first");
        return;
      }

      const filePath = `users/${user.uid}/${code}/${file.name}`;

      const fileRef = ref(storage, filePath);

      await uploadBytes(fileRef, file);

      const downloadURL = await getDownloadURL(fileRef);

      await setDoc(doc(db, "shares", code), {
        code,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
      }, { merge: true });

      const fileId = Math.random().toString(36).substring(2, 8).toUpperCase();
      await setDoc(doc(db, `shares/${code}/files`, fileId), {
        fileName: file.name,
        filePath,
        downloadURL,
        size: file.size,
      });

      console.log("File uploaded successfully");
      console.log("Share Code:", code);
      console.log("Share Link:", `/share/${code}`);

      return {
        code,
        filePath,
        fileId,
      };

    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Calculate total size in bytes
  const totalSizeBytes = files.reduce((acc, file) => acc + file.size, 0);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div className="upload-hub-container">
      <div className="hub-header">
        <div className="hub-tag">PIPELINE 04 // LIVE MESH</div>
        <div className="hub-status"><span className="status-dot"></span> Direct P2P E2EE Active</div>
      </div>

      <h1 className="hub-title">Send & Transfer Hub</h1>
      <p className="hub-subtitle">
        End-to-end encrypted direct beam and cloud-relay file staging with sub-millisecond cryptographic handshake.
      </p>

      {/* Dropzone */}
      {!showShareUI ? (
        <div className="dropzone" onDrop={handleDrop} onDragOver={handleDragOver} onClick={triggerFileInput}>
          <div className="dropzone-icon">
            <CloudUpload size={32} />
          </div>
          <h2 className="dropzone-title">Drop payloads here to initiate beam</h2>
          <p className="dropzone-subtitle">or <span className="highlight">browse local filesystem</span> (up to 1 GB per encrypted bundle)</p>

          {error && (
            <div style={{ color: '#ef4444', marginTop: '12px', fontSize: '0.9rem', fontWeight: 600 }}>
              {error}
            </div>
          )}
          <div style={{ marginTop: '20px', marginBottom: '10px' }}>
            <button
              style={{
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.4)',
                transition: 'all 0.2s ease'
              }}
              className="action-button"
              onClick={async (e) => {
                e.stopPropagation();
                if (files.length === 0) {
                  setError("Please select at least one file .");
                  return;
                }
                setError(null);

                const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                setShareCode(newCode);
                setShowShareUI(true);
                const uploadedFiles: { code: string; filePath: string; fileId: string }[] = [];

                for (const file of files) {
                  const result = await handleFileUpload(file, newCode);
                  if (result) {
                    uploadedFiles.push(result);
                  }
                }

                setTimeout(async () => {
                  try {
                    for (const item of uploadedFiles) {
                      const fileRef = ref(storage, item.filePath);
                      try {
                        await deleteObject(fileRef);
                      } catch (e) {
                        // ignore
                      }
                      await deleteDoc(doc(db, `shares/${newCode}/files`, item.fileId));
                    }
                    await deleteDoc(doc(db, "shares", newCode));
                    alert("Share time out. Files have been deleted.");
                    window.location.reload();
                  } catch (error) {
                    console.error("Timeout deletion failed:", error);
                  }
                }, 5 * 60 * 1000);

              }}
            >
              <CloudUpload size={20} />
              Send Files
            </button>
          </div>

          <div className="dropzone-badges" style={{ marginTop: '20px' }}>
            <div className="badge"><Shield size={14} /> AES-GCM-256</div>
            <div className="badge"><Zap size={14} /> Direct Socket P2P</div>
            <div className="badge"><Database size={14} /> Zero-Storage Relay</div>
          </div>
        </div>
      ) : (
        <div className="share-ui-container">
          <div className="share-ui-header">
            <div>
              <h2 className="share-ui-title">Share Link</h2>
            </div>
            <div className="share-ui-active-badge">
              <span className="status-dot"></span>
              Active for {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
            </div>
          </div>

          <div className="share-ui-section">
            <div className="share-ui-section-title">DIRECT ACCESS LINK</div>
            <div className="share-link-box">
              <div className="share-link-url">
                <Link2 size={16} color="#71717a" /> {typeof window !== 'undefined' ? `${window.location.origin}/share/${shareCode}` : `https://beamshare.io/share/${shareCode}`}
              </div>
              <button className="copy-btn" onClick={() => navigator.clipboard.writeText(typeof window !== 'undefined' ? `${window.location.origin}/share/${shareCode}` : `https://beamshare.io/share/${shareCode}`)}>
                <Copy size={14} /> COPY
              </button>
            </div>
          </div>

          <div className="share-ui-section">
            <div className="qr-container">
              <div className="qr-box">
                <QRCodeSVG
                  value={typeof window !== 'undefined' ? `${window.location.origin}/share/${shareCode}` : `https://beamshare.io/share/${shareCode}`}
                  size={180}
                  level="Q"
                />
                <div className="qr-logo-center">
                  <CloudUpload size={24} color="#8b5cf6" />
                </div>
              </div>
            </div>
          </div>

          <div className="share-ui-section">
            <div className="share-ui-section-title centered">MANUAL TERMINAL KEY</div>
            <div className="terminal-key-box">
              <div className="terminal-key-text" style={{ letterSpacing: '4px' }}>
                {shareCode}
              </div>
              <button className="key-copy-btn" onClick={() => navigator.clipboard.writeText(shareCode)}>
                <Copy size={16} />
              </button>
            </div>
          </div>


        </div>
      )}

      <input
        type="file"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <input
        type="file"
        // @ts-ignore
        webkitdirectory="true"
        multiple
        ref={folderInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div className="actions-row">
        {!showShareUI && (
          <div className="buttons-group">
            <button className="action-button" onClick={triggerFileInput}>
              <PlusCircle size={18} />
              ADD MORE FILES
            </button>
            <button className="action-button" onClick={triggerFolderInput}>
              <FolderPlus size={18} />
              UPLOAD DIRECTORY
            </button>
          </div>
        )}

        <div className="stats-text">
          {files.length > 0
            ? `${files.length} payload${files.length !== 1 ? 's' : ''} queued (${formatBytes(totalSizeBytes)})`
            : '0 payloads queued (0 MB)'}
        </div>
      </div>

      {files.length > 0 && (
        <div className="staged-payloads">
          <div className="staged-header">
            <span>STAGED PAYLOADS <span className="blue-dot"></span></span>
            <span className="throughput">Throughput: <span className="green-text">0 MB/s</span></span>
          </div>

          <div className="payloads-list">
            {files.map((file, index) => (
              <div key={index} className="payload-card">
                <div className="payload-icon">
                  <FileIcon size={24} color="#a78bfa" />
                </div>

                <div className="payload-info">
                  <div className="payload-title-row">
                    <span className="payload-name">{file.name}</span>
                    <span className="payload-tag">READY TO SHARE</span>
                  </div>
                  <div className="payload-meta">
                    {formatBytes(file.size)} • 0 MB/s • ETA --s left
                  </div>
                  <div className="progress-container">
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>

                {!showShareUI && (
                  <div className="payload-controls">
                    <button className="control-btn" onClick={() => removeFile(index)} title="Remove">
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
