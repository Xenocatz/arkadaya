"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getUserFriendlyErrorMessage } from "@/utils/error-message";

export default function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code"); // ← ganti dari "token" ke "code"

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sessionReady, setSessionReady] = useState(false); // ← tambah ini

    const supabase = createClient();

    // Tukar code jadi session dulu sebelum form bisa dipakai
    useEffect(() => {
        if (!code) {
            router.push("/");
            return;
        }

        supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
            if (error) {
                setError("Tautan pemulihan tidak valid atau sudah kadaluarsa.");
            } else {
                setSessionReady(true);
            }
        });
    }, [code]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Kata sandi tidak cocok.");
            return;
        }

        setLoading(true);
        try {
            const { error: updateError } = await supabase.auth.updateUser({ password });
            if (updateError) {
                setError(getUserFriendlyErrorMessage(updateError));
            } else {
                setSuccess(true);
                setTimeout(() => router.push("/signin"), 2000);
            }
        } catch (e) {
            setError(getUserFriendlyErrorMessage(e));
        } finally {
            setLoading(false);
        }
    };

    // Tampilkan loading saat menukar code
    if (!sessionReady && !error) {
        return <p className="text-center text-gray-500">Memverifikasi tautan...</p>;
    }

    return (
        <>
            {error && (
                <p className="mb-4 rounded bg-red-100 p-2 text-sm text-red-700">{error}</p>
            )}
            {success ? (
                <p className="text-center text-green-700">
                    Kata sandi berhasil diubah! Mengarahkan ke halaman masuk…
                </p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="password"
                        placeholder="Kata sandi baru"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Konfirmasi kata sandi"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Menyimpan…" : "Ubah Kata Sandi"}
                    </Button>
                </form>
            )}
        </>
    );
}