import React from "react";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  signUp?: boolean;
}

export function AuthSplitLayout({ children, signUp }: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row ">
      {/* Left Section - Branding/Info */}
      <div className="relative flex flex-col justify-start w-full md:w-1/2 text-white p-12 lg:px-24 lg:py-34 overflow-hidden min-h-100 md:min-h-screen">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full  overflow-hidden z-0">
          <div className="absolute -left-80 -top-120 size-300 bg-linear-180 from-primary to-dark-primary rounded-full mix-blend-multiply filter blur-xs "></div>

          <div className="absolute top-150 -left-20 size-100 bg-linear-45 from-primary to-dark-primary rounded-full  blur-xs "></div>

          <div className="absolute top-110 right-30 size-80 bg-linear-120 from-primary to-dark-primary rounded-full blur-xs"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-full ">
          <h1 className="text-8xl font-bold mb-4">Welcome</h1>
          <h2 className="text-4xl font-medium mb-8">Arkadaya Logistic</h2>
          <p className="text-lg text-blue-100 mb-12 leading-tight max-w-lg ">
            AHP Logistics is a fast-growing logistics company providing
            efficient and flexible transportation solutions for various
            industries in Indonesia.
          </p>
          {signUp && (
            <p className="text-2xl font-medium">Daftarkan Akunmu Sekarang!</p>
          )}
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 lg:p-24 bg-white relative z-10">
        {children}
      </div>
    </div>
  );
}
