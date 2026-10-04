"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/home/Sidebar";
import { auth, storage } from "@/app/auth/firebase";
import { updateProfile, signOut, onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { Power, LogOut, LogIn, ShieldCheck, Edit2, BadgeCheck, Palette, Moon, Sun, Check } from "lucide-react";
import styles from "./Settings.module.css";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [theme, setTheme] = useState("dark");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setName(user.displayName || "");
        setOriginalName(user.displayName || "");
        setEmail(user.email || "");
        setPhotoURL(user.photoURL || "");
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSaveName = async () => {
    setMessage({ text: "", type: "" });
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first.");
      return;
    }

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }



    try {
      setSaving(true);

      await updateProfile(user, {
        displayName: name.trim(),
      });

      setOriginalName(name.trim());
      setMessage({ text: "update successfully", type: "success" });
    } catch (error) {
      console.error(error);
      alert("Failed to update name.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth/login");
    } catch (error) {
      console.error(error);
      alert("Failed to logout.");
    }
  };

  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const user = auth.currentUser;

    if (!user) {
      alert("Please login first.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    try {
      setUploadingPhoto(true);

      const photoRef = ref(
        storage,
        `users/${user.uid}/profile/profile-photo`
      );

      await uploadBytes(photoRef, file);

      const downloadURL = await getDownloadURL(photoRef);

      await updateProfile(user, {
        photoURL: downloadURL,
      });

      setPhotoURL(downloadURL);


    } catch (error) {
      console.error(error);
      alert("Failed to update profile photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first.");
      return;
    }

    try {
      setUploadingPhoto(true);
      await updateProfile(user, {
        photoURL: "",
      });

      setPhotoURL("");
    } catch (error) {
      console.error(error);
      alert("Failed to remove profile photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className={styles.settingsPage}>
      <Sidebar />

      <main className={styles.settingsMain}>
        <div className={styles.settingsContainer}>

          <div className={styles.settingsHeaderRow}>
            <div className={styles.headerLeft}>

              <div>
                <h1>Profile & Identity</h1>
              </div>
            </div>
            <div className={styles.verifiedBadge}>
              VERIFIED IDENTITY
            </div>
          </div>

          <section className={styles.avatarCard}>
            <div className={styles.avatarSectionWrapper} style={{ marginBottom: '24px' }}>
              <div className={styles.avatarImageContainer}>
                {photoURL ? (
                  <img src={photoURL} alt="Profile" className={styles.avatarSquareImage} />
                ) : (
                  <div className={styles.avatarSquarePlaceholder}>
                    {name ? name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
              <div className={styles.avatarInfo}>
                <h2>{name} <span></span></h2>
                <br />
                <div className={styles.avatarActions}>
                  <button className={styles.btnChange} onClick={() => fileInputRef.current?.click()} disabled={uploadingPhoto}>
                    {uploadingPhoto ? "Uploading..." : "Change Photo"}
                  </button>
                  <button className={styles.btnRemove} onClick={handleRemovePhoto} disabled={uploadingPhoto || !photoURL}>Remove</button>
                </div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              hidden
            />

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>FULL NAME</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setMessage({ text: "", type: "" });
                    }}
                    placeholder={originalName || "Enter your name"}
                  />
                  <Edit2 size={16} className={styles.inputIcon} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>EMAIL ADDRESS</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="email"
                    value={email}
                    disabled
                  />
                  <BadgeCheck size={18} className={styles.verifiedIcon} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className={styles.btnSave} onClick={handleSaveName} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </section>

          {message.text && (
            <p className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </p>
          )}

          <section className={styles.themeSection}>
            <div className={styles.themeHeader}>
              <div className={styles.headerIcon}>
                <Palette className={styles.paletteIcon} size={24} />
              </div>
              <div>
                <h3>Appearance & Theme</h3>
                <p>Customize the visual appearance of the ShareAddaa interface. Switch between Dark Enclave and Light Studio modes.</p>
              </div>
            </div>

            <div className={styles.themeCards}>
              <div
                className={`${styles.themeCard} ${theme === 'dark' ? styles.active : ''}`}
                onClick={() => {
                  setTheme('dark');
                  localStorage.setItem('theme', 'dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                }}
              >
                <div className={styles.themeCardHeader}>
                  <div className={styles.themeCardTitle}>
                    <Moon size={18} /> Dark Mode
                  </div>
                  {theme === 'dark' && <span className={styles.activeBadge}><Check size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '2px' }} /> Active</span>}
                </div>
                <div className={styles.previewBox}>
                  {/* Mock UI lines */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }}></div>
                    <div style={{ width: '40px', height: '8px', borderRadius: '4px', background: '#3f3f46' }}></div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '40%', height: '20px', borderRadius: '4px', background: '#27272a', borderTop: '2px solid #38bdf8' }}></div>
                    <div style={{ width: '60%', height: '20px', borderRadius: '4px', background: '#27272a', borderTop: '2px solid #c084fc' }}></div>
                  </div>
                </div>
                <p className={styles.themeDesc}>High-contrast obsidian theme optimized for low-light environments and long encrypted transfer sessions.</p>
              </div>

              <div
                className={`${styles.themeCard} ${theme === 'light' ? styles.active : ''}`}
                onClick={() => {
                  setTheme('light');
                  localStorage.setItem('theme', 'light');
                  document.documentElement.setAttribute('data-theme', 'light');
                }}
              >
                <div className={styles.themeCardHeader}>
                  <div className={styles.themeCardTitle}>
                    <Sun size={18} /> Light Mode
                  </div>
                  {theme === 'light' && <span className={styles.activeBadge}><Check size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '2px' }} /> Active</span>}
                </div>
                <div className={`${styles.previewBox} ${styles.lightPreviewBox}`}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }}></div>
                    <div style={{ width: '40px', height: '8px', borderRadius: '4px', background: '#d1d5db' }}></div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '40%', height: '20px', borderRadius: '4px', background: '#ffffff', borderTop: '2px solid #38bdf8' }}></div>
                    <div style={{ width: '60%', height: '20px', borderRadius: '4px', background: '#ffffff', borderTop: '2px solid #c084fc' }}></div>
                  </div>
                </div>
                <p className={styles.themeDesc}>Clean, high-clarity daylight theme designed for high-ambient lighting office environments.</p>
              </div>
            </div>
          </section>

          <section className={styles.logoutSection}>
            <div className={styles.logoutLeft}>
              <div className={styles.logoutIconWrapper}>
                <Power className={styles.powerIcon} size={24} />
              </div>
              <div className={styles.logoutText}>
                <h3>{isLoggedIn ? "Session & Account Termination" : "Account Access"}</h3>
                <p>{isLoggedIn ? "Sign out from your current account on this device." : "Log in to access your account and manage your files."}</p>
              </div>
            </div>
            {isLoggedIn ? (
              <button
                type="button"
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                className={styles.logoutButton}
                onClick={() => router.push("/auth/login")}
              >
                <LogIn size={16} />
                Login
              </button>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}