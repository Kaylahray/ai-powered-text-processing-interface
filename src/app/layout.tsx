import type { Metadata } from "next";
import "./globals.css";
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          httpEquiv="origin-trial"
          content={process.env.NEXT_PUBLIC_ORIGIN_TRIAL_ONE}
        />
        <meta
          httpEquiv="origin-trial"
          content={process.env.NEXT_PUBLIC_ORIGIN_TRIAL_TWO}
        />
        <meta
          httpEquiv="origin-trial"
          content={process.env.NEXT_PUBLIC_ORIGIN_TRIAL_THREE}
        />
      </head>
      <body className={`${manrope.className} min-h-screen  antialiased`}>
        {children}
      </body>
    </html>
  );
}
