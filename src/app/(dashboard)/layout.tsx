import Navbar from '@/components/navbar';
import AuthGuard from '@/components/auth/auth-guard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="py-6">{children}</div>
      </div>
    </AuthGuard>
  );
}
