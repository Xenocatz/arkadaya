// Server Component – tidak ada "use client"
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata = {
  title: "Ubah Kata Sandi | Arkadaya Logistic",
  description:
    "Setel ulang kata sandi akun Anda setelah memverifikasi tautan pemulihan.",
};

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f7fa] p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-[#0a315c]">
          Ubah Kata Sandi
        </h1>
        {/* Komponen client yang menangani form */}
        <ResetPasswordForm />
      </div>
    </main>
  );
}
