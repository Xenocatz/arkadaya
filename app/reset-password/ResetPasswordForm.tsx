"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getUserFriendlyErrorMessage } from "@/utils/error-message";

export default function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const type = searchParams.get("type");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Kata sandi tidak cocok.");
            return;
        }
        if (!token || type !== "recovery") {
            setError("Tautan pemulihan tidak valid.");
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
