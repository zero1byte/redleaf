import { LoginForm } from "@/components/login-form";
import AuthLayout from "../layout";

export default function Page() {
  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </AuthLayout>
  );
}
