import { AuthSplitLayout } from "@/components/layout/AuthSplitLayout";
import type { Metadata } from "next";
import { SignInForm } from "@/components/features/auth/signInForm";

export const metadata: Metadata = {
  title: "Sign In | Arkadaya Logistic",
  description: "Login to your account for Arkadaya Logistic",
};

export default function SignInPage() {
  return (
    <AuthSplitLayout>
      <SignInForm />
    </AuthSplitLayout>
  );
}
