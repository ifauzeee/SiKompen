import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import MainLayout from "@/components/MainLayout";
import { getSessionUser } from "@/app/actions/auth";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DialogProvider } from "@/contexts/DialogContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SiKompen - Sistem Informasi Kompensasi",
  description: "Manajemen kompensasi mahasiswa PNJ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();

  return (
    <html lang="id" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative min-h-screen overflow-x-hidden bg-gray-50 antialiased selection:bg-[#008C9D] selection:text-white`}
      >
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-[#008C9D]/5 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-[#F4B41A]/5 blur-[100px]" />
        </div>

        <ThemeProvider>
          <DialogProvider>
            <div className="relative z-10">
              <Sidebar role={user?.role} userName={user?.name || undefined} />
              <MainLayout>{children}</MainLayout>
            </div>
          </DialogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
