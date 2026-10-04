import Sidebar from "@/components/home/Sidebar";
import UploadArea from "@/components/home/UploadArea";
import ReceiveArea from "@/components/home/ReceiveArea";

export default function Home() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem', display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 2 }}>
          <UploadArea />
        </div>
        <div style={{ flex: 1, minWidth: '350px' }}>
          <ReceiveArea />
        </div>
      </main>
    </div>
  );
}
