import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <main
        className="h-screen bg-cover bg-center bg-no-repeat "
        style={{ backgroundImage: "url(/bg2.jpeg)" }}>
        <div className="absolute z-10 left-0 top-0 h-full w-full bg-linear-150 from-10% from-black/50 to-transparent to-90%"></div>
        {/* logo */}
        <div className="w-full h-1/6 z-20 relative">
          <div className="size-fit relative">
            <Image src={"/logo.png"} alt="bg" width={278} height={124} />
          </div>
        </div>
        {/* text */}
        <div className=" h-5/6 w-full z-20  relative flex justify-center pt-50">
          <div className="h-fit w-2/3 flex flex-col items-center text-white gap-5">
            <h3 className="text-7xl font-bold">PT. ARKADAYA HAKATO PERSADA</h3>
            <span className="text-xl text-justify">
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
            <div className="text-2xl font- mt-10 self-end w-fit">
              <Link
                href={"/login"}
                className="w-full bg-secondary/60 px-5 py-3 rounded-lg hover:bg-secondary duration-200 shadow-xl">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
