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
} from "lucide-react";
import Image from "next/image";

import { logout } from "@/app/actions/auth";

export default function Sidebar({
  role,
  userName,
}: {
  role?: string;
  userName?: string;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
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
      <div className="fixed top-0 right-0 left-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 shadow-sm backdrop-blur-md transition-all duration-300 lg:hidden">
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
          <span className="text-lg font-black tracking-tight text-gray-900">
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
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-gray-200 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} `}
      >
        <div className="flex h-full flex-col">
          <div className="relative flex h-28 shrink-0 flex-col justify-center overflow-hidden border-b border-gray-100 bg-[#008C9D]/5 px-6">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-[#008C9D]/10 blur-2xl"></div>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-20 rounded-full p-2 text-gray-500 transition-colors hover:bg-white/50 hover:text-gray-900 lg:hidden"
            >
              <X size={20} />
            </button>

            <div className="group relative z-10 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
                <Image
                  src="/Logo PNJ.png"
                  alt="PNJ Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-lg leading-none font-black tracking-tight text-gray-900 transition-colors group-hover:text-[#008C9D]">
                  {userName?.split(" ")[0] || "SiKompen"}
                </span>
                <span className="mt-1.5 w-fit rounded-full bg-[#008C9D]/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-[#008C9D] uppercase">
                  {role || "Mahasiswa"}
                </span>
              </div>
            </div>
          </div>

          <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto p-4">
            <div className="mt-2 mb-3 px-4 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
              Main Menu
            </div>

            {role !== "KEUANGAN" && (
              <>
                <SidebarLink
                  href="/dashboard"
                  icon={<LayoutDashboard size={20} />}
                  label="Dashboard"
                  active={pathname === "/dashboard"}
                />
                <SidebarLink
                  href="/jobs"
                  icon={<Briefcase size={20} />}
                  label="Pekerjaan"
                  active={pathname.startsWith("/jobs")}
                />
              </>
            )}
            {["ADMIN", "PENGAWAS"].includes(role || "") && (
              <SidebarLink
                href="/dashboard/my-jobs"
                icon={<FolderOpen size={20} />}
                label="Pekerjaan Saya"
                active={pathname.startsWith("/dashboard/my-jobs")}
              />
            )}

            {role === "KEUANGAN" && (
              <SidebarLink
                href="/dashboard/finance"
                icon={<Wallet size={20} />}
                label="Validasi Pembayaran"
                active={pathname.startsWith("/dashboard/finance")}
              />
            )}

            {role === "ADMIN" && (
              <>
                <SidebarLink
                  href="/dashboard/users"
                  icon={<Users size={20} />}
                  label="Data Pengguna"
                  active={pathname.startsWith("/dashboard/users")}
                />
                <SidebarLink
                  href="/dashboard/finance"
                  icon={<Wallet size={20} />}
                  label="Finance Portal"
                  active={pathname.startsWith("/dashboard/finance")}
                />
              </>
            )}

            {role === "MAHASISWA" && (
              <>
                <SidebarLink
                  href="/my-applications"
                  icon={<FileText size={20} />}
                  label="Lamaran Saya"
                  active={pathname.startsWith("/my-applications")}
                />
                <SidebarLink
                  href="/clearance"
                  icon={<CheckCircle size={20} />}
                  label="Bebas Kompen"
                  active={pathname === "/clearance"}
                />
              </>
            )}

            <div className="mx-2 my-6 border-t border-gray-100/80"></div>

            <div className="mb-3 px-4 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
              Settings
            </div>
            <SidebarLink
              href="/profile"
              icon={<UserCircle size={20} />}
              label="Profil Saya"
              active={pathname === "/profile"}
            />
          </nav>

          <div className="shrink-0 border-t border-gray-100 bg-gray-50/50 p-4">
            <button
              onClick={() => logout()}
              className="group flex w-full items-center justify-start gap-3 rounded-xl px-4 py-3.5 text-gray-600 transition-all duration-200 hover:bg-[#CE2029]/10 hover:text-[#CE2029]"
            >
              <LogOut
                size={20}
                className="transition-transform group-hover:-translate-x-1"
              />
              <span className="text-sm font-bold">Keluar</span>
            </button>

            <div className="mt-4 mb-2 text-center">
              <p className="text-[10px] font-medium text-gray-300">
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
      className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3.5 transition-all duration-300 ${
        active
          ? "bg-[#008C9D] font-bold text-white shadow-lg shadow-[#008C9D]/25"
          : "font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <span
        className={`transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}
      >
        {icon}
      </span>
      <span className="text-sm">{label}</span>

      {!active && (
        <ChevronRight
          size={14}
          className="absolute right-3 -translate-x-2 text-gray-400 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
        />
      )}
    </Link>
  );
}
