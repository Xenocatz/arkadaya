"use client";

import React, { useState } from "react";
import { User, Phone, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-4xl font-bold text-[#0a2d5e] mb-12 text-center ">
        Sign In
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input type="text" placeholder="Name" icon={User} required />

        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
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
