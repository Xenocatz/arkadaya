"use client";

import React, { useState } from "react";
import { User, Phone, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-4xl font-bold text-[#0a2d5e] mb-12 text-center ">
        Sign Up
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input type="text" placeholder="Name" icon={User} required />

        <Input type="tel" placeholder="Phone Number" icon={Phone} required />

        <Input type="email" placeholder="Email Address" icon={Mail} required />

        <Input
          type={showPassword ? "text" : "password"}
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
