'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from "@/components/home/Sidebar";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject, getBlob } from 'firebase/storage';
import { db, storage, auth } from '@/app/auth/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Download, Trash2, FileIcon } from 'lucide-react';
import './Albums.css';

interface ReceivedDoc {
  id: string;
  fileName: string;
  filePath: string | null;
  downloadURL: string | null;
  receivedAt: any;
  shareCode?: string;
}

export default function AlbumsPage() {
  const [documents, setDocuments] = useState<ReceivedDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [userUid, setUserUid] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeDocs: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
        const q = query(collection(db, `users/${user.uid}/receivedDocuments`), orderBy('receivedAt', 'desc'));
        unsubscribeDocs = onSnapshot(q, (snapshot) => {
          const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as ReceivedDoc[];
          setDocuments(docs);
          setLoading(false);
        });
      } else {
        setUserUid(null);
        setDocuments([]);
        setLoading(false);
        if (unsubscribeDocs) {
          unsubscribeDocs();
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDocs) {
        unsubscribeDocs();
      }
    };
  }, []);

  const downloadFile = async (docUrl: string | null, fileName: string, filePath: string | null) => {
    try {
      let blob: Blob;
      if (filePath) {
        const fileRef = ref(storage, filePath);
        blob = await getBlob(fileRef);
      } else if (docUrl) {
        const response = await fetch(docUrl);
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
      alert("Download failed. Details: " + (err.message || err));
    }
  };

  const handleDelete = async (docId: string, filePath: string | null) => {
    if (!userUid) return;

    try {
      // 1. Delete Firestore record
      await deleteDoc(doc(db, `users/${userUid}/receivedDocuments`, docId));

      // 2. Delete Storage file if it belongs to this user
      if (filePath && filePath.startsWith(`users/${userUid}/`)) {
        try {
          const fileRef = ref(storage, filePath);
          await deleteObject(fileRef);
        } catch (e) {
          console.error("Failed to delete storage file:", e);
        }
      }
    } catch (err) {
      console.error("Failed to delete document:", err);
      alert("Failed to delete document.");
    }
  };

  return (
    <div className="albums-container">
      <Sidebar />
      <main className="albums-main">
        <h1 className="albums-title">My Documents</h1>
        <p className="albums-subtitle">
          Your saved received documents are safely stored here.
        </p>

        {loading ? (
          <p className="albums-status">Loading documents...</p>
        ) : !userUid ? (
          <p className="albums-error">Please log in to view your documents.</p>
        ) : documents.length === 0 ? (
          <p className="albums-status">No received documents yet.</p>
        ) : (
          <div className="albums-grid">
            {documents.map((doc) => (
              <div key={doc.id} className="document-card">
                <div className="document-info-wrapper">
                  <FileIcon size={32} color="#8b5cf6" style={{ flexShrink: 0 }} />
                  <div className="document-details">
                    <span className="document-name">
                      {doc.fileName}
                    </span>
                    <span className="document-meta">
                      Received: {doc.receivedAt?.toDate ? doc.receivedAt.toDate().toLocaleString() : 'Just now'}
                      {doc.shareCode && ` • Code: ${doc.shareCode}`}
                    </span>
                  </div>
                </div>
                <div className="document-actions">
                  <button 
                    onClick={() => downloadFile(doc.downloadURL, doc.fileName, doc.filePath)}
                    className="btn-download"
                  >
                    <Download size={16} /> Download
                  </button>
                  <button 
                    onClick={() => handleDelete(doc.id, doc.filePath)}
                    className="btn-delete"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
