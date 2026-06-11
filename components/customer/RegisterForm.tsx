"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { CUSTOMER_ROUTES } from "@/components/customer/routes";
import { addUserProfiles, signUpNewUser } from "@/service/auth.service";
import {
  getUserFriendlyErrorMessage,
  logAppError,
} from "@/utils/error-message";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
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
      const username = formData.username.trim();
      const phone = formData.phone.trim();
      const email = formData.email.trim().toLowerCase();
      const password = formData.password.trim();

      if (!username) {
        setErrorMessage("Nama pengguna wajib diisi.");
        return;
      }

      if (!phone) {
        setErrorMessage("Nomor telepon wajib diisi.");
        return;
      }

      if (!email) {
        setErrorMessage("Email wajib diisi.");
        return;
      }

      if (!password) {
        setErrorMessage("Kata sandi wajib diisi.");
        return;
      }

      const signUpResult = await signUpNewUser(email, password);

      if (!signUpResult.success) {
        throw new Error(signUpResult.error);
      }

      const profileResult = await addUserProfiles(
        username,
        email,
        phone,
      );

      if (!profileResult.success) {
        throw new Error(profileResult.error ?? "Gagal membuat profil pengguna.");
      }

      setIsSubmitted(true);
      window.setTimeout(() => {
        setFormData({ username: "", phone: "", email: "", password: "" });
        router.push(CUSTOMER_ROUTES.login);
      }, 1200);
    } catch (error) {
      logAppError("Customer sign up failed", error);
      setErrorMessage(getUserFriendlyErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-7 pb-8">
      {isSubmitted ? (
        <div className="animate-fade-in flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-emerald-50 p-4 text-emerald-500 shadow-lg shadow-emerald-100">
            <CheckCircle2 size={48} className="animate-bounce" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-slate-800">Pendaftaran Berhasil!</h3>
          <p className="max-w-xs text-sm text-slate-500">
            Akun Anda telah berhasil dibuat. Silakan masuk ke dashboard customer.
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
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="h-[62px] w-full rounded-[16px] border-[1.5px] border-[#0a315c] bg-[#d9e7f5] pl-14 pr-6 text-base font-medium text-[#0a315c] outline-none"
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
              value={formData.phone}
              onChange={handleChange}
              className="h-[62px] w-full rounded-[16px] border-[1.5px] border-[#0a315c] bg-[#d9e7f5] pl-14 pr-6 text-base font-medium text-[#0a315c] outline-none"
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
              value={formData.email}
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

          {errorMessage ? (
            <p className="px-1 text-center text-sm font-semibold text-red-500">
              {errorMessage}
            </p>
          ) : null}

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-[60px] w-full items-center justify-center rounded-[16px] border-[1.5px] border-[#0a315c] bg-[#5091cd] text-[20px] font-semibold text-white transition-all active:scale-[0.99]"
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
