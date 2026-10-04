import Sidebar from "@/components/home/Sidebar";

export default function AlbumsPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#131316', color: '#ffffff' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem' }}>
        <h1>File Manager</h1>
        <p style={{ marginTop: '1rem', color: '#a1a1aa' }}>Your files and folders will appear here.</p>
      </main>
    </div>
  );
}
