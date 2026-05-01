import React from "react";
import { AuthSplitLayout } from "@/components/layout/AuthSplitLayout";
import { SignUpForm } from "@/components/features/auth/SignUpForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Arkadaya Logistic",
  description: "Create your account for Arkadaya Logistic",
};

export default function SignUpPage() {
  return (
    <AuthSplitLayout signUp>
      <SignUpForm />
    </AuthSplitLayout>
  );
}
