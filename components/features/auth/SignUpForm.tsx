"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { addUserProfiles, signUpNewUser } from "@/service/auth.service";

interface SignUpFormProps {
  mobile?: boolean;
}

export function SignUpForm({ mobile = false }: SignUpFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const signUpResult = await signUpNewUser(
        data.email as string,
        data.password as string,
      );

      if (!signUpResult.success) {
        throw new Error(signUpResult.error);
      }

      const profileResult = await addUserProfiles(
        data.name as string,
        data.email as string,
        data.phone as string,
      );

      if (!profileResult.success) {
        throw new Error(profileResult.error ?? "Profile creation failed.");
      }

      setIsSuccess(true);
      form.reset();
      window.setTimeout(() => {
        router.push("/signin");
      }, 1200);
    } catch (error) {
      console.error("gagal signUp: ", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Pendaftaran gagal. Silakan coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mobile) {
    return (
      <div className="w-full px-7 pb-8">
        {isSuccess ? (
          <div className="animate-fade-in flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-emerald-50 p-4 text-emerald-500 shadow-lg shadow-emerald-100">
              <User size={48} className="animate-bounce" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800">Pendaftaran Berhasil!</h3>
            <p className="max-w-xs text-sm text-slate-500">
              Akun Anda telah berhasil dibuat. Silakan masuk ke halaman sign in.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="animate-slide-up space-y-5">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-[#0a315c]">
                <User size={26} strokeWidth={2} />
              </div>
              <input
                type="text"
                name="name"
                required
                placeholder="Name"
                className="h-[62px] w-full rounded-[16px] border-[1.5px] border-[#0a315c] bg-[#d9e7f5] pl-14 pr-6 text-base font-medium text-[#0a315c] outline-none placeholder:text-[#0a315c]/50"
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-[#0a315c]">
                <Phone size={26} strokeWidth={2} />
              </div>
              <input
                type="tel"
                name="phone"
                required
                placeholder="Phone Number"
                className="h-[62px] w-full rounded-[16px] border-[1.5px] border-[#0a315c] bg-[#d9e7f5] pl-14 pr-6 text-base font-medium text-[#0a315c] outline-none placeholder:text-[#0a315c]/50"
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-[#0a315c]">
                <Mail size={26} strokeWidth={2} />
              </div>
              <input
                type="email"
                name="email"
                required
                placeholder="Email Address"
                className="h-[62px] w-full rounded-[16px] border-[1.5px] border-[#0a315c] bg-[#d9e7f5] pl-14 pr-6 text-base font-medium text-[#0a315c] outline-none placeholder:text-[#0a315c]/50"
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-[#0a315c]">
                <Lock size={26} strokeWidth={2} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Password"
                className="h-[62px] w-full rounded-[16px] border-[1.5px] border-[#0a315c] bg-[#d9e7f5] pl-14 pr-12 text-base font-medium text-[#0a315c] outline-none placeholder:text-[#0a315c]/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-5 text-[#0a315c]/70 transition-colors hover:text-[#0a315c]"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            {errorMessage ? (
              <p className="px-1 text-center text-sm font-semibold text-red-500">{errorMessage}</p>
            ) : null}

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-[60px] w-full items-center justify-center rounded-[16px] border-[1.5px] border-[#0a315c] bg-[#5091cd] text-[20px] font-semibold text-white transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <h2 className="mb-12 text-center text-4xl font-bold text-[#0a2d5e]">Sign Up</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input type="text" name="name" placeholder="Name" icon={User} required />
        <Input type="tel" name="phone" placeholder="Phone Number" icon={Phone} required />
        <Input type="email" name="email" placeholder="Email Address" icon={Mail} required />
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          icon={Lock}
          iconRight={showPassword ? Eye : EyeOff}
          onIconRightClick={() => setShowPassword(!showPassword)}
          required
        />

        {errorMessage ? (
          <p className="text-sm font-semibold text-red-500">{errorMessage}</p>
        ) : null}

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>
        </div>

        <div className="flex justify-center pt-4">
          <span className="text-sm text-black/50">
            Sudah punya akun?{" "}
            <Link href="/signin" className="cursor-pointer hover:text-black">
              Masuk di sini
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
