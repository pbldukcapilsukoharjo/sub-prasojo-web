import Sidebar from '@/components/Dashboard/Sidebar';
import Navbar from '@/components/Dashboard/Navbar';
import MainScroll from '@/components/Dashboard/MainScroll';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar />
        <MainScroll>
          {children}
        </MainScroll>
      </div>
    </div>
  );
}
