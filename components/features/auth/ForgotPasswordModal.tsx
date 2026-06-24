"use client";

import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { resetPasswordForEmail } from "@/service/auth.service";
import {
  getUserFriendlyErrorMessage,
  logAppError,
} from "@/utils/error-message";

interface ForgotPasswordModalProps {
  /** Callback untuk menutup modal */
  onClose: () => void;
  /** Tampilan mobile */
  mobile?: boolean;
}

/**
 * Modal lupa password — mengirim link reset password ke email pengguna
 * melalui Supabase Auth.
 */
export function ForgotPasswordModal({
  onClose,
  mobile = false,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  // Menangani pengiriman form reset password
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setErrorMessage("Email wajib diisi.");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await resetPasswordForEmail(trimmedEmail);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Berhasil mengirim email reset
      setIsSent(true);
    } catch (error) {
      logAppError("Reset password failed", error);
      setErrorMessage(getUserFriendlyErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // === Tampilan mobile (tanpa Modal wrapper, langsung inline) ===
  if (mobile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div
          className="relative mx-4 w-full max-w-[390px] overflow-hidden rounded-3xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header dekoratif */}
          <div className="relative h-[140px] w-full overflow-hidden">
            <div
              className="absolute left-[-80px] top-[-80px] z-[1] h-[240px] w-[240px] rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, #0a4a8a 0%, #002f6c 100%)",
              }}
            />
            <div
              className="absolute right-[-60px] top-[-60px] z-[2] h-[220px] w-[220px] rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, #2995f5 0%, #0066d6 50%, #005bc4 100%)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 z-[3] h-[40px] bg-white"
              style={{
                borderTopLeftRadius: "50% 100%",
                borderTopRightRadius: "50% 100%",
              }}
            />
            {/* Ikon kembali */}
            <button
              onClick={onClose}
              className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              <ArrowLeft size={20} />
            </button>
          </div>

          <div className="px-7 pb-8">
            {isSent ? (
              // Tampilan sukses
              <div className="animate-fade-in flex flex-col items-center space-y-4 py-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2
                    size={32}
                    className="text-emerald-600"
                    strokeWidth={2}
                  />
                </div>
                <h2 className="text-[22px] font-bold tracking-tight text-[#0a315c]">
                  Email Terkirim!
                </h2>
                <p className="text-sm leading-relaxed text-[#7a8c9e]">
                  Kami telah mengirim link reset password ke{" "}
                  <span className="font-semibold text-[#0a315c]">{email}</span>.
                  Silakan cek inbox atau folder spam Anda.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 flex h-[52px] w-full items-center justify-center rounded-[16px] border-[1.5px] border-[#0a315c] bg-[#5091cd] text-[16px] font-semibold text-white transition-all active:scale-[0.99]"
                >
                  Kembali ke Login
                </button>
              </div>
            ) : (
              // Form input email
              <>
                <div className="mb-6 text-center">
                  <h2 className="text-[24px] font-bold tracking-tight text-[#0a315c]">
                    Lupa Password?
                  </h2>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#7a8c9e]">
                    Masukkan email yang terdaftar dan kami akan mengirim link
                    untuk mereset password Anda.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-[#0a315c]">
                      <Mail size={26} strokeWidth={2} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Email"
                      className="h-[62px] w-full rounded-[16px] border-[1.5px] border-[#0a315c] bg-[#d9e7f5] pl-14 pr-6 text-base font-medium text-[#0a315c] outline-none placeholder:text-[#0a315c]/50"
                    />
                  </div>

                  {errorMessage ? (
                    <p className="px-1 text-center text-sm font-semibold text-red-500">
                      {errorMessage}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-[56px] w-full items-center justify-center gap-2 rounded-[16px] border-[1.5px] border-[#0a315c] bg-[#5091cd] text-[16px] font-semibold text-white transition-all active:scale-[0.99] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      "Kirim Link Reset"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex w-full items-center justify-center gap-1.5 text-[13px] font-medium text-[#7a8c9e] transition-colors hover:text-[#0a315c]"
                  >
                    <ArrowLeft size={14} />
                    Kembali ke Login
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // === Tampilan desktop (menggunakan komponen Modal) ===
  return (
    <Modal title="" onClose={onClose} size="sm">
      {isSent ? (
        // Tampilan sukses
        <div className="flex flex-col items-center space-y-5 py-2 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2
              size={40}
              className="text-emerald-500"
              strokeWidth={1.8}
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0a2d5e]">
              Email Terkirim!
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Kami telah mengirim link reset password ke{" "}
              <span className="font-semibold text-[#0a2d5e]">{email}</span>.
              <br />
              Silakan cek inbox atau folder spam Anda.
            </p>
          </div>
          <Button type="button" onClick={onClose} className="w-full">
            Kembali ke Login
          </Button>
        </div>
      ) : (
        // Form input email
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#0a2d5e]">
              Lupa Password?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Masukkan email yang terdaftar dan kami akan mengirim link untuk
              mereset password Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              placeholder="Email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {errorMessage ? (
              <p className="text-center text-sm font-semibold text-red-500">
                {errorMessage}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Mengirim...
                </span>
              ) : (
                "Kirim Link Reset"
              )}
            </Button>

            <button
              type="button"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-[#0a2d5e]"
            >
              <ArrowLeft size={14} />
              Kembali ke Login
            </button>
          </form>
        </div>
      )}
    </Modal>
  );
}
