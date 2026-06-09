"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, Lock, User } from "lucide-react";
import { CUSTOMER_ROUTES } from "@/components/customer/routes";
import { checkForEmailAndRole, signInUser } from "@/service/auth.service";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const checkEmailResult = await checkForEmailAndRole(formData.username.trim());

      if (!checkEmailResult.success) {
        throw new Error(checkEmailResult.error);
      }

      const email = checkEmailResult.data?.email;
      const role = checkEmailResult.data?.role;

      if (!email) {
        throw new Error("Email tidak ditemukan untuk akun ini.");
      }

      const signInResult = await signInUser(email, formData.password);

      if (!signInResult.success) {
        throw new Error(signInResult.error);
      }

      if (role === "admin") {
        router.push("/a-dashboard");
        return;
      }

      setIsSubmitted(true);
      setFormData({ username: "", password: "" });
      window.setTimeout(() => {
        router.push(CUSTOMER_ROUTES.order);
      }, 600);
    } catch (error) {
      console.error("gagal signIn customer:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Login gagal. Silakan coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex-1 px-7 pb-8">
      {isSubmitted ? (
        <div className="animate-fade-in my-auto flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-emerald-50 p-4 text-emerald-500 shadow-lg shadow-emerald-100">
            <CheckCircle2 size={48} className="animate-bounce" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-slate-800">Login Berhasil!</h3>
          <p className="max-w-xs text-sm text-slate-500">
            Selamat datang kembali di Arkadaya Logistic.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="animate-slide-up flex h-full flex-col justify-between space-y-6"
        >
          <div className="space-y-5">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-[#0a315c]">
                <User size={26} strokeWidth={2} />
              </div>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="h-[62px] w-full rounded-[16px] border-[1.5px] border-[#0a315c] bg-[#d9e7f5] pl-14 pr-6 text-base font-medium text-[#0a315c] outline-none"
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
                value={formData.password}
                onChange={handleChange}
                className="h-[62px] w-full rounded-[16px] border-[1.5px] border-[#0a315c] bg-[#d9e7f5] pl-14 pr-12 text-base font-medium text-[#0a315c] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-5 text-[#0a315c]/70 transition-colors hover:text-[#0a315c]"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            <div className="pt-1 text-center">
              <Link
                href="#"
                className="text-[11px] font-normal text-[#7a8c9e] transition-colors hover:text-[#0a315c]"
              >
                Forgot Password?
              </Link>
            </div>

            {errorMessage ? (
              <p className="px-1 text-center text-sm font-semibold text-red-500">
                {errorMessage}
              </p>
            ) : null}
          </div>

          <div className="space-y-6 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-[60px] w-full items-center justify-center rounded-[16px] border-[1.5px] border-[#0a315c] bg-[#5091cd] text-[20px] font-semibold text-white transition-all active:scale-[0.99]"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>

            <div className="text-center text-[12px] font-normal text-[#7a8c9e]">
              {"Haven't any account? "}
              <Link
                href={CUSTOMER_ROUTES.register}
                className="transition-colors hover:text-[#0a315c] hover:underline"
              >
                Create an account
              </Link>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
