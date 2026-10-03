import Sidebar from "@/components/home/Sidebar";
import UploadArea from "@/components/home/UploadArea";

export default function Home() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#131316', color: '#ffffff' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem' }}>
        <UploadArea />
      </main>
    </div>
  );
}
