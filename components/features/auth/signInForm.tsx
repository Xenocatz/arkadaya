"use client";

import React, { useState } from "react";
import { User, Phone, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { checkForEmailAndRole, signInUser } from "@/service/auth.service";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      // cek email berdasarkan name
      const checkEmailResult = await checkForEmailAndRole(
        data.name.toString().trim(),
      );

      if (!checkEmailResult.success) {
        throw new Error(checkEmailResult.error);
      }

      const email = checkEmailResult.data?.email;
      const role = checkEmailResult.data?.role;

      if (!email) {
        throw new Error("Email not found");
      }

      // send signIn data to supabase
      const signUpResult = await signInUser(
        email as string,
        data.password as string,
      );

      if (!signUpResult.success) {
        throw new Error(signUpResult.error);
      }

      switch (role) {
        case "admin":
          router.push("/a-dashboard");
          break;
        case "user":
          router.push("/u-dashboard");
      }
    } catch (err) {
      console.error("gagal signIn: ", err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-4xl font-bold text-[#0a2d5e] mb-12 text-center ">
        Sign In
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="text"
          placeholder="Name"
          name="name"
          icon={User}
          required
        />

        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          name="password"
          icon={Lock}
          iconRight={showPassword ? Eye : EyeOff}
          onIconRightClick={() => setShowPassword(!showPassword)}
          required
        />
        <div className="flex justify-end">
          <span className=" text-sm text-black/50 cursor-pointer hover:text-black">
            Forgot Password?
          </span>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit">Sign In</Button>
        </div>

        <div className="flex justify-center pt-4">
          <span className=" text-sm text-black/50">
            Have’nt any account?{" "}
            <Link href={"/signup"} className="cursor-pointer hover:text-black">
              Create an account
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
