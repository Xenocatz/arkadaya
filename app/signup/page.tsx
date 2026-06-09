import React from "react";
import { AuthSplitLayout } from "@/components/layout/AuthSplitLayout";
import { SignUpForm } from "@/components/features/auth/SignUpForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Arkadaya Logistic",
  description: "Create your account for Arkadaya Logistic",
};

export default function SignUpPage() {
  return (
    <>
      <main className="flex min-h-screen items-center justify-center bg-[#f4f7fa] p-0 md:hidden">
        <div className="relative flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden border border-slate-100 bg-white transition-all duration-500">
          <div className="relative h-[280px] w-full shrink-0 overflow-hidden select-none">
            <div className="absolute inset-0 bg-transparent" />
            <div
              className="absolute left-[-110px] top-[-120px] z-[1] h-[380px] w-[380px] rounded-full"
              style={{ background: "linear-gradient(180deg, #0a4a8a 0%, #002f6c 100%)" }}
            />
            <div
              className="absolute right-[-100px] top-[-100px] z-[2] h-[370px] w-[370px] rounded-full"
              style={{ background: "linear-gradient(135deg, #2995f5 0%, #0066d6 50%, #005bc4 100%)" }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 z-[3] h-[60px] bg-white"
              style={{ borderTopLeftRadius: "50% 100%", borderTopRightRadius: "50% 100%" }}
            />

            <div className="animate-fade-in absolute left-8 top-[70px] z-[4]">
              <h1 className="leading-none tracking-tight text-white" style={{ fontSize: "52px", fontWeight: 800 }}>
                Welcome
              </h1>
              <h2
                className="tracking-wide text-white/95"
                style={{ fontSize: "22px", fontWeight: 700, marginTop: "6px" }}
              >
                Arkadaya Logistic
              </h2>
              <p className="font-medium tracking-wide text-white/90" style={{ fontSize: "12px", marginTop: "8px" }}>
                Daftarkan Akunmu Sekarang!
              </p>
            </div>
          </div>

          <div className="relative z-20 flex flex-1 flex-col pb-4">
            <div className="pb-6 text-center">
              <h2 className="text-[30px] font-bold tracking-tight text-[#0a315c]">Sign Up</h2>
              <p className="mt-3 text-sm text-slate-500">
                Sudah punya akun?{" "}
                <Link href="/signin" className="font-semibold text-[#005bc4] hover:text-[#003a8c]">
                  Masuk di sini
                </Link>
              </p>
            </div>

            <SignUpForm mobile />
          </div>

          <div className="flex w-full shrink-0 justify-center bg-white py-2">
            <div className="h-1 w-32 rounded-full bg-slate-200" />
          </div>
        </div>
      </main>

      <div className="hidden md:block">
        <AuthSplitLayout signUp>
          <SignUpForm />
        </AuthSplitLayout>
      </div>
    </>
  );
}
