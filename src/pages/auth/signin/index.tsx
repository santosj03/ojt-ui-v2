import UserAuthForm from './components/user-auth-form';

export default function SignInPage() {
  return (
    <div className="flex h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Login to your account
          </h1>
        </div>
        <UserAuthForm />
      </div>
    </div>
  );
}
