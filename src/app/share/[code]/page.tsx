'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db, storage } from '@/app/auth/firebase';
import { ref, getBlob } from 'firebase/storage';
import { Download, FileIcon, ShieldCheck } from 'lucide-react';

export default function ShareReceivingPage() {
  const { code } = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareData, setShareData] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const fetchShare = async () => {
      if (!code || typeof code !== 'string') return;
      
      try {
        const shareCode = code.toUpperCase();
        const docRef = doc(db, 'shares', shareCode);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          if (data.expiresAt && Date.now() > data.expiresAt) {
            setExpired(true);
            setLoading(false);
            return;
          }
          
          setShareData(data);
          
          let allFiles: any[] = [];
          if (data.downloadURL) {
            allFiles.push(data);
          }
          
          const filesSnap = await getDocs(collection(db, `shares/${shareCode}/files`));
          filesSnap.forEach((d) => {
            allFiles.push(d.data());
          });
          
          setFiles(allFiles);
        } else {
          setError("Share link not found or has been deleted.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching the share.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchShare();
  }, [code]);

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
      alert("Download failed!\nDetails: " + errorMsg);
    }
  };

  const handleDownloadAll = () => {
    files.forEach(f => downloadFile(f.downloadURL, f.fileName, f.filePath));
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#131316', color: '#fff' }}>
        <p>Loading secure payload...</p>
      </div>
    );
  }

  if (expired) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#131316', color: '#fff', padding: '20px' }}>
        <div style={{ backgroundColor: '#1a1a1f', padding: '40px', borderRadius: '16px', border: '1px solid #2d2d34', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>Link Expired</h2>
          <p style={{ color: '#a1a1aa' }}>This share link has expired and is no longer available. All associated files have been permanently deleted from our servers.</p>
          <button 
            onClick={() => router.push('/')}
            style={{ marginTop: '24px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, width: '100%' }}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#131316', color: '#fff', padding: '20px' }}>
        <div style={{ backgroundColor: '#1a1a1f', padding: '40px', borderRadius: '16px', border: '1px solid #2d2d34', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>Error</h2>
          <p style={{ color: '#a1a1aa' }}>{error}</p>
          <button 
            onClick={() => router.push('/')}
            style={{ marginTop: '24px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, width: '100%' }}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#131316', color: '#fff', display: 'flex', justifyContent: 'center', padding: '40px 20px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '16px' }}>
            <ShieldCheck size={16} /> SECURE INBOX
          </div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 8px 0' }}>Incoming Payload</h1>
          <p style={{ color: '#a1a1aa', margin: 0 }}>Someone shared files with you securely.</p>
        </div>

        <div style={{ backgroundColor: '#1a1a1f', borderRadius: '16px', border: '1px solid #2d2d34', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem' }}>Shared Files</h3>
              <p style={{ color: '#a1a1aa', margin: 0, fontSize: '0.9rem' }}>{files.length} file{files.length !== 1 ? 's' : ''}</p>
            </div>
            
            {files.length > 1 && (
              <button 
                onClick={handleDownloadAll}
                style={{
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  color: '#8b5cf6',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Download size={16} /> Download All
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {files.map((file, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '16px', 
                backgroundColor: '#131316', 
                borderRadius: '12px', 
                border: '1px solid #2d2d34',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#1a1a1f', padding: '10px', borderRadius: '8px', flexShrink: 0 }}>
                    <FileIcon size={24} color="#a78bfa" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <span style={{ 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      fontSize: '1rem', 
                      fontWeight: 500,
                      marginBottom: '4px'
                    }}>
                      {file.fileName}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>
                      {file.size ? formatBytes(file.size) : 'Ready for download'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => downloadFile(file.downloadURL, file.fileName, file.filePath)}
                  style={{
                    backgroundColor: '#8b5cf6',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    flexShrink: 0
                  }}
                  title="Download File"
                >
                  <Download size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
