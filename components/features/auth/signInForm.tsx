"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { ForgotPasswordModal } from "@/components/features/auth/ForgotPasswordModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getProfileByEmail, signInUser } from "@/service/auth.service";
import {
  getUserFriendlyErrorMessage,
  logAppError,
} from "@/utils/error-message";

interface SignInFormProps {
  mobile?: boolean;
}

export function SignInForm({ mobile = false }: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const email = data.email.toString().trim().toLowerCase();
      const password = data.password.toString().trim();

      if (!email || !password) {
        setErrorMessage("Email dan kata sandi wajib diisi.");
        return;
      }

      const signInResult = await signInUser(email, password);

      if (!signInResult.success) {
        throw new Error(signInResult.error);
      }

      const profileResult = await getProfileByEmail(email);

      if (!profileResult.success) {
        throw new Error(profileResult.error);
      }

      const role = profileResult.data?.role;

      switch (role) {
        case "admin":
          router.push("/a-dashboard");
          break;
        case "user":
          router.push("/u-dashboard");
          break;
        default:
          router.push("/u-dashboard");
      }
    } catch (error) {
      logAppError("Admin sign in failed", error);
      setErrorMessage(getUserFriendlyErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mobile) {
    return (
      <div className="w-full px-7 pb-8">
        <form onSubmit={handleSubmit} className="animate-slide-up flex h-full flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-[#0a315c]">
                <Mail size={26} strokeWidth={2} />
              </div>
              <input
                type="email"
                name="email"
                required
                placeholder="Email"
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

            {/* Link lupa password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-[13px] font-medium text-[#5091cd] transition-colors hover:text-[#0a315c] hover:underline"
              >
                Lupa Password?
              </button>
            </div>
          </div>

          <div className="space-y-6 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-[60px] w-full items-center justify-center rounded-[16px] border-[1.5px] border-[#0a315c] bg-[#5091cd] text-[20px] font-semibold text-white transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>

            <div className="text-center text-[12px] font-normal text-[#7a8c9e]">
              {"Haven't any account? "}
              <Link href="/signup" className="transition-colors hover:text-[#0a315c] hover:underline">
                Create an account
              </Link>
            </div>
          </div>
        </form>

        {/* Modal lupa password untuk mobile */}
        {showForgotPassword && (
          <ForgotPasswordModal
            mobile
            onClose={() => setShowForgotPassword(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <h2 className="mb-12 text-center text-4xl font-bold text-[#0a2d5e]">Sign In</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input type="email" placeholder="Email" name="email" icon={Mail} required />

        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          name="password"
          icon={Lock}
          iconRight={showPassword ? Eye : EyeOff}
          onIconRightClick={() => setShowPassword(!showPassword)}
          required
        />

        {errorMessage ? (
          <p className="text-sm font-semibold text-red-500">{errorMessage}</p>
        ) : null}

        {/* Link lupa password */}
        <div className="flex justify-end -mt-2">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm font-medium text-[#5a94cc] transition-colors hover:text-[#0a2d5e] hover:underline"
          >
            Lupa Password?
          </button>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </div>

        <div className="flex justify-center pt-4">
          <span className="text-sm text-black/50">
            Have&apos;nt any account?{" "}
            <Link href="/signup" className="cursor-pointer hover:text-black">
              Create an account
            </Link>
          </span>
        </div>
      </form>

      {/* Modal lupa password untuk desktop */}
      {showForgotPassword && (
        <ForgotPasswordModal
          onClose={() => setShowForgotPassword(false)}
        />
      )}
    </div>
  );
}
