import RegisterDemo from '@/components/register/register-demo';
import AuthGuard from '@/components/auth/auth-guard';

export default function RegisterPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gray-50">
        <RegisterDemo />
      </div>
    </AuthGuard>
  );
}
