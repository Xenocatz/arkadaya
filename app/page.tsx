import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <main
        className="relative min-h-screen bg-cover bg-center bg-no-repeat flex flex-col pb-10"
        style={{ backgroundImage: "url(/bg2.jpeg)" }}>
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/80 via-black/40 to-transparent"></div>
        {/* logo */}
        <div className="w-full pt-8 px-6 z-20 relative flex justify-center md:justify-start">
          <div className="relative">
            <Image src={"/logo.png"} alt="bg" width={278} height={124} className="w-[200px] md:w-[278px] h-auto" />
          </div>
        </div>
        {/* text */}
        <div className="flex-1 w-full z-20 relative flex items-center justify-center mt-10 md:mt-0">
          <div className="w-11/12 md:w-3/4 lg:w-2/3 flex flex-col items-center md:items-start text-white gap-5 md:gap-8">
            <h3 className="text-5xl md:text-7xl font-bold text-center md:text-left leading-tight drop-shadow-lg">
              PT. ARKADAYA HAKATO PERSADA
            </h3>
            <span className="text-base md:text-xl text-justify md:text-left leading-relaxed drop-shadow-md">
              PT. Arkadaya Hakato Persada (AHP Logistics) is a logistics company
              that provides reliable and efficient transportation and
              distribution services to support Indonesia’s connectivity and
              economic growth. Since early 2024, it has expanded rapidly with a
              growing fleet and now serves multiple industries, including
              e-commerce, automotive, agriculture, manufacturing, and
              infrastructure, by offering flexible and tailored logistics
              solutions.
            </span>
            {/* button */}
            <div className="text-xl md:text-2xl mt-8 md:mt-10 w-full md:w-fit self-center md:self-end">
              <Link
                href={"/signin"}
                className="flex w-full justify-center bg-blue-900/80 px-8 py-3.5 rounded-xl border border-white/20 hover:bg-blue-900 duration-200 shadow-2xl backdrop-blur-sm active:scale-95 font-semibold">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
