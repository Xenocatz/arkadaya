"use client";

import React, { useState } from "react";
import { User, Phone, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { addUserProfiles, signUpNewUser } from "@/service/auth.service";

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      // send signUp data to supabase
      const signUpResult = await signUpNewUser(
        data.email as string,
        data.password as string,
      );

      if (!signUpResult.success) {
        throw new Error(signUpResult.error);
      }

      // send data to table profiles
      const profileResult = await addUserProfiles(
        data.name as string,
        data.email as string,
        data.phone as string,
      );

      if (!profileResult.success) {
        throw new Error(profileResult.error ?? "Profile creation failed.");
      }

      console.log("Form Data Submitted:", signUpResult.data);
    } catch (err) {
      console.error("gagal signUp: ", err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-4xl font-bold text-[#0a2d5e] mb-12 text-center ">
        Sign Up
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="text"
          name="name"
          placeholder="Name"
          icon={User}
          required
        />

        <Input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          icon={Phone}
          required
        />

        <Input
          type="email"
          name="email"
          placeholder="Email Address"
          icon={Mail}
          required
        />

        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          icon={Lock}
          iconRight={showPassword ? Eye : EyeOff}
          onIconRightClick={() => setShowPassword(!showPassword)}
          required
        />

        <div className="flex justify-end pt-4">
          <Button type="submit">Sign Up</Button>
        </div>
      </form>
    </div>
  );
}
