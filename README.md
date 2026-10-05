# ShareAddaa

### Simple, Fast & Secure File Sharing

ShareAddaa is a modern file-sharing platform that allows users to securely send and receive files using temporary share links and share codes.

Built with **Next.js, TypeScript, Firebase, and Tailwind CSS**, ShareAddaa focuses on fast file transfer, temporary sharing, user accounts, and a clean responsive experience.

---

## ✨ Features

### 📤 Send Files
- Upload and share multiple files
- Generate a unique share code
- Generate a QR code for quick sharing
- Generate a direct share link
- Temporary file sharing

### 📥 Receive Files
- Receive files using a share code
- Scan QR codes to receive files
- Open shared links without requiring an account
- Download individual files
- Download multiple files

### ⏱️ Temporary Sharing
- Share links automatically expire
- Expired shares are removed from Firebase
- Automatic cleanup of expired files
- Helps reduce unnecessary storage usage

### 👤 User Accounts
- Firebase Authentication
- User profile management
- Profile photo support
- Saved received documents
- Download and delete saved documents

### 🎨 Modern UI
- Dark Mode
- Light Mode
- Responsive design
- Mobile-friendly interface
- Modern SaaS-style UI
- Responsive bottom navigation

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Frontend framework |
| TypeScript | Type-safe development |
| Firebase Authentication | User authentication |
| Firebase Firestore | Database |
| Firebase Storage | File storage |
| Firebase Cloud Functions | Automatic file cleanup |
| CSS / Tailwind CSS | UI & responsive design |
| Vercel | Deployment |

---

## 🏗️ Architecture

```text
                    ShareAddaa
                        │
        ┌───────────────┴───────────────┐
        │                               │
      Sender                          Receiver
        │                               │
    Select Files                   Share Code / QR
        │                               │
        ▼                               ▼
   Firebase Storage              Receive Page
        │                               │
        └───────────────┬───────────────┘
                        │
                   Firestore
                        │
                        ▼
                 Share Metadata
                        │
                        ▼
              Cloud Functions
                        │
                        ▼
                Expired File Cleanup
