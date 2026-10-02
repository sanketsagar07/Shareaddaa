import Sidebar from "@/components/home/Sidebar";

export default function SettingsPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#131316', color: '#ffffff' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem' }}>
        <h1>Settings</h1>
        <p style={{ marginTop: '1rem', color: '#a1a1aa' }}>Application settings will appear here.</p>
      </main>
    </div>
  );
}
