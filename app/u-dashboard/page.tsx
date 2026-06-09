"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CUSTOMER_ROUTES } from "@/components/customer/routes";

export default function CustomerLandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f7fa] p-0 sm:p-4 md:p-8">
      <style jsx global>{`
        @keyframes slideInTruck {
          0% {
            transform: translateX(120%) scale(0.9);
            opacity: 0;
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }

        .animate-truck {
          animation: slideInTruck 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="relative flex min-h-screen w-full max-w-[390px] flex-col justify-between overflow-hidden border border-blue-900/10 bg-gradient-to-b from-[#0a488a] via-[#0d59a3] to-[#4b88c3] p-6 pb-10 pt-12 transition-all duration-500 sm:my-4 sm:min-h-[844px] sm:max-h-[844px] sm:rounded-[36px] sm:shadow-2xl">
        <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
          <svg className="absolute -left-5 top-0 h-[350px] w-[240px] text-white/15 opacity-40" viewBox="0 0 200 300" fill="none">
            <circle cx="30" cy="20" r="3.5" fill="currentColor" />
            <circle cx="120" cy="50" r="4.5" fill="currentColor" />
            <circle cx="80" cy="140" r="4" fill="currentColor" />
            <circle cx="40" cy="220" r="5" fill="currentColor" />
            <circle cx="160" cy="280" r="3.5" fill="currentColor" />
            <line x1="30" y1="20" x2="120" y2="50" stroke="currentColor" strokeWidth="0.75" />
            <line x1="120" y1="50" x2="80" y2="140" stroke="currentColor" strokeWidth="0.75" />
            <line x1="30" y1="20" x2="80" y2="140" stroke="currentColor" strokeWidth="0.75" />
            <line x1="80" y1="140" x2="40" y2="220" stroke="currentColor" strokeWidth="0.75" />
            <line x1="40" y1="220" x2="160" y2="280" stroke="currentColor" strokeWidth="0.75" />
            <line x1="80" y1="140" x2="160" y2="280" stroke="currentColor" strokeWidth="0.75" />
            <circle cx="180" cy="110" r="3" fill="currentColor" />
            <line x1="120" y1="50" x2="180" y2="110" stroke="currentColor" strokeWidth="0.75" />
            <line x1="80" y1="140" x2="180" y2="110" stroke="currentColor" strokeWidth="0.75" />
          </svg>

          <svg className="absolute -right-2 top-2 h-[250px] w-[180px] text-white/10 opacity-30" viewBox="0 0 120 180" fill="none" stroke="currentColor" strokeWidth="0.75">
            {[20, 36, 60, 86, 120].map((y, index) => (
              <g
                key={`box-${y}`}
                transform={`translate(${index === 0 ? 60 : index === 1 ? 90 : index === 2 ? 75 : index === 3 ? 95 : 85}, ${y})`}
              >
                <path d="M 0,-10 L 15,-2 L 0,6 L -15,-2 Z" fill="currentColor" fillOpacity="0.05" />
                <path d="M -15,-2 L -15,10 L 0,18 L 0,6 Z" />
                <path d="M 15,-2 L 15,10 L 0,18 L 0,6 Z" />
                <line x1="0" y1="-2" x2="0" y2="6" stroke="currentColor" strokeWidth="0.5" />
              </g>
            ))}
          </svg>
        </div>

        <div className="z-10 mt-10 select-none text-center">
          <h1 className="text-[44px] leading-none font-black tracking-tight text-white drop-shadow-md">
            Arkadaya
          </h1>
          <h2 className="mt-1.5 text-3xl font-extrabold tracking-wide text-[#f09200] drop-shadow-lg">
            Express Logistics
          </h2>
        </div>

        <div className="relative z-10 my-6 flex h-44 w-full items-center justify-center overflow-hidden select-none">
          <div className="animate-truck flex h-full w-[85%] items-center justify-center">
            <img
              src="/truk1.png"
              alt="Logistics Delivery Truck"
              className="h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        <div className="z-10 mb-6 px-3 text-center select-none">
          <p className="text-[11.5px] leading-relaxed font-medium tracking-wide text-white/85">
            PT. Arkadaya Hakato Persada (AHP Logistics) is a logistics company providing
            reliable transportation and distribution services to support Indonesia&apos;s
            connectivity and economic growth. Since early 2024, it has grown rapidly,
            serving industries such as e-commerce, automotive, agriculture, manufacturing,
            and infrastructure with flexible logistics solutions.
          </p>
        </div>

        <div className="z-10 mb-6 flex w-full shrink-0 flex-col items-center">
          <Link
            href={CUSTOMER_ROUTES.register}
            className="group flex w-full max-w-[280px] cursor-pointer flex-col items-center transition-transform duration-200 active:scale-[0.98]"
          >
            <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors group-hover:text-amber-400">
              Get Started
            </span>
            <div className="relative flex w-full items-center justify-center py-2">
              <div className="relative flex h-[1.5px] w-[180px] items-center justify-end bg-white transition-colors group-hover:bg-amber-400">
                <div className="absolute right-0 translate-x-[20%] text-white transition-colors group-hover:text-amber-400">
                  <ArrowRight size={16} strokeWidth={2.5} className="-mt-[7.5px]" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
