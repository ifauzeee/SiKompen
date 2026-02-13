"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  CheckCircle,
  LogOut,
  Users,
  FolderOpen,
  UserCircle,
  ChevronRight,
  Menu,
  X,
  Wallet,
  Sun,
  Moon,
} from "lucide-react";
import Image from "next/image";

import { logout } from "@/app/actions/auth";
import { useTheme } from "@/contexts/ThemeContext";

export default function Sidebar({
  role,
}: {
  role?: string;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();
  const isAuthPage = !["/", "/login"].includes(pathname);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isAuthPage) return null;

  return (
    <>
      <div className="fixed top-0 right-0 left-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-white/5 dark:bg-black/50 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#008C9D]/10 p-1">
            <Image
              src="/Logo PNJ.png"
              alt="PNJ Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
            SiKompen
          </span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="-mr-2 rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 active:scale-95"
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} `}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out dark:border-white/5 dark:bg-[#010409] lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} `}
      >
        <div className="flex h-full flex-col">
          <div className="relative flex h-28 shrink-0 flex-col justify-center px-6">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-[#008C9D]/5 blur-3xl dark:bg-[#008C9D]/10"></div>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-20 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-white/5 dark:hover:text-white lg:hidden"
            >
              <X size={20} />
            </button>

            <div className="group relative z-10 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-xl shadow-gray-200/50 dark:bg-white dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <Image
                  src="/Logo PNJ.png"
                  alt="PNJ Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl leading-none font-black tracking-tight text-gray-900 dark:text-white">
                    SiKompen
                  </span>
                  <span className="rounded-md bg-[#008C9D]/10 px-1.5 py-0.5 text-[9px] font-black tracking-widest text-[#008C9D] uppercase dark:bg-[#008C9D]/20">
                    {role || "USER"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto p-4">
            <div className="mt-2 mb-3 px-4 text-[10px] font-extrabold tracking-[0.2em] text-gray-400 uppercase dark:text-gray-500">
              Main Menu
            </div>

            {role !== "KEUANGAN" && (
              <>
                <SidebarLink
                  href="/dashboard"
                  icon={<LayoutDashboard size={18} />}
                  label="Dashboard"
                  active={pathname === "/dashboard"}
                />
                <SidebarLink
                  href="/jobs"
                  icon={<Briefcase size={18} />}
                  label="Pekerjaan"
                  active={pathname.startsWith("/jobs")}
                />
              </>
            )}
            {["ADMIN", "PENGAWAS"].includes(role || "") && (
              <SidebarLink
                href="/dashboard/my-jobs"
                icon={<FolderOpen size={18} />}
                label="Pekerjaan Saya"
                active={pathname.startsWith("/dashboard/my-jobs")}
              />
            )}

            {role === "ADMIN" && (
              <>
                <SidebarLink
                  href="/dashboard/users"
                  icon={<Users size={18} />}
                  label="Data Pengguna"
                  active={pathname.startsWith("/dashboard/users")}
                />
                <SidebarLink
                  href="/dashboard/finance"
                  icon={<Wallet size={18} />}
                  label="Finance Portal"
                  active={pathname.startsWith("/dashboard/finance")}
                />
              </>
            )}

            {role === "KEUANGAN" && (
              <SidebarLink
                href="/dashboard/finance"
                icon={<Wallet size={18} />}
                label="Finance Portal"
                active={pathname.startsWith("/dashboard/finance")}
              />
            )}

            {role === "MAHASISWA" && (
              <>
                <SidebarLink
                  href="/my-applications"
                  icon={<FileText size={18} />}
                  label="Lamaran Saya"
                  active={pathname.startsWith("/my-applications")}
                />
                <SidebarLink
                  href="/clearance"
                  icon={<CheckCircle size={18} />}
                  label="Bebas Kompen"
                  active={pathname === "/clearance"}
                />
              </>
            )}

            <div className="mx-4 my-6 border-t border-gray-100 dark:border-white/5"></div>

            <div className="mb-3 px-4 text-[10px] font-extrabold tracking-[0.2em] text-gray-400 uppercase dark:text-gray-500">
              Settings
            </div>
            <SidebarLink
              href="/profile"
              icon={<UserCircle size={18} />}
              label="Profil Saya"
              active={pathname === "/profile"}
            />
          </nav>

          <div className="shrink-0 space-y-4 p-4 pb-6">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="group flex w-full items-center justify-start gap-3 rounded-xl px-4 py-3 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-[#008C9D] dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
              >
                <div className="flex items-center gap-3">
                  {theme === "light" ? (
                    <Moon size={18} className="transition-transform group-hover:rotate-12" />
                  ) : (
                    <Sun size={18} className="transition-transform group-hover:rotate-12" />
                  )}
                  <span className="text-sm font-bold">
                    Mode {theme === "light" ? "Gelap" : "Terang"}
                  </span>
                </div>
              </button>
            )}

            <button
              onClick={() => logout()}
              className="group flex w-full items-center justify-start gap-3 rounded-xl px-4 py-3 text-gray-500 transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 dark:text-gray-400"
            >
              <LogOut
                size={18}
                className="transition-transform group-hover:-translate-x-1"
              />
              <span className="text-sm font-bold">Keluar</span>
            </button>

            <div className="px-4">
              <p className="text-[10px] font-bold tracking-tight text-gray-600">
                &copy; 2025 Politeknik Negeri Jakarta
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

function SidebarLink({ href, icon, label, active }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3 transition-all duration-300 ${active
        ? "bg-[#008C9D] font-bold text-white shadow-[0_8px_20px_rgba(0,140,157,0.3)]"
        : "font-medium text-gray-500 hover:bg-gray-100 hover:text-[#008C9D] dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
        }`}
    >
      <span
        className={`transition-transform duration-300 ${active ? "scale-105" : "group-hover:scale-105"}`}
      >
        {icon}
      </span>
      <span className="text-[13px] tracking-tight">{label}</span>

      {!active && (
        <ChevronRight
          size={14}
          className="absolute right-3 -translate-x-2 text-white/40 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
        />
      )}
    </Link>
  );
}
