import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <div className="relative bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="overflow-hidden pt-8 flex flex-col gap-6 items-center">
        <Image
          src="/logo.svg"
          width={50}
          height={40}
          alt="logo"
          className=""
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-6 py-8 sm:py-10 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-10">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <h1 className="mt-10 text-pretty text-5xl  text-[#EA8800] sm:text-6xl font-extrabold lg:leading-[80px]">
              Supercharge{" "}
              <span className="text-[#373737]">Your Text in Seconds ⚡</span>
            </h1>
            <p className="mt-8 max-w-[565px] text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
              Detect languages, summarize essays, and translate seamlessly—all
              in one place. No expertise needed, just paste and go!
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/chat"
                className=" inline-block gap-2 px-6 py-4 text-white text-base font-semibold rounded-lg bg-[#EA8800] leading-normal cursor-pointer transition-all duration-300 hover:bg-[#d97706]"
              >
                Try It Now - For Free
              </Link>
            </div>

            <div className="inline-flex flex-col px-6 py-5 mt-14 items-start gap-4 rounded-xl border border-[#EEE] bg-white/30 backdrop-blur-md">
              <h2 className="text-[#4D4D4D] text-base font-bold leading-normal">
                Features
              </h2>
              <ul className="list-disc pl-5 text-[#4D4D4D] text-[14px] leading-[21px]">
                <li>
                  <span className="font-semibold">🔍 Detect languages</span> in
                  seconds.
                </li>
                <li>
                  <span className="font-semibold">✂️ Summarize essays</span>{" "}
                  into clear, concise bullet points.
                </li>
                <li>
                  <span className="font-semibold">🌎 Translate</span> seamlessly
                  across English, Portuguese, Spanish, Russian, Turkish, and
                  French.
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:shrink-0 lg:grow">
            <Image
              src="/aiImage.png"
              width={571}
              height={464}
              alt=""
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center gap-x-6 md:order-2">
            <h1>KAYLA</h1>
          </div>
          <p className="mt-8 text-center text-sm/6 text-gray-600 md:order-1 md:mt-0">
            &copy; 2024 Kayla, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
