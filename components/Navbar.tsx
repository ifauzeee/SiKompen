"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  CheckCircle,
  LogOut,
  Users,
  FolderOpen,
  UserCircle,
  ChevronDown,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";

import { logout } from "@/app/actions/auth";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({
  role,
  userName,
}: {
  role?: string;
  userName?: string | null;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileBackdropRef = useRef<HTMLDivElement>(null);
  const mobileContentRef = useRef<HTMLDivElement>(null);

  const isAuthPage = !["/", "/login"].includes(pathname);

  useGSAP(() => {
    if (!mobileMenuRef.current) return;
    gsap.set(mobileMenuRef.current, { xPercent: 100 });
    gsap.set(mobileBackdropRef.current, { opacity: 0 });
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useGSAP(() => {
    if (!mobileMenuRef.current) return;

    if (mobileOpen) {
      gsap.to(mobileMenuRef.current, {
        xPercent: 0,
        duration: 0.5,
        ease: "power3.out",
      });
      gsap.to(mobileBackdropRef.current, {
        opacity: 1,
        duration: 0.3,
        pointerEvents: "auto",
        ease: "power2.out",
      });
      gsap.fromTo(
        mobileContentRef.current?.children || [],
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          delay: 0.2,
          duration: 0.4,
          ease: "back.out(1.2)",
        },
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        xPercent: 100,
        duration: 0.4,
        ease: "power3.in",
      });
      gsap.to(mobileBackdropRef.current, {
        opacity: 0,
        duration: 0.3,
        pointerEvents: "none",
        ease: "power2.in",
      });
    }
  }, [mobileOpen]);

  if (!isAuthPage) return null;

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      show: true,
    },
    { href: "/jobs", label: "Pekerjaan", icon: Briefcase, show: true },
    {
      href: "/dashboard/my-jobs",
      label: "Pekerjaan Saya",
      icon: FolderOpen,
      show: ["ADMIN", "PENGAWAS"].includes(role || ""),
    },
    {
      href: "/dashboard/users",
      label: "Data Pengguna",
      icon: Users,
      show: role === "ADMIN",
    },
    {
      href: "/my-applications",
      label: "Lamaran Saya",
      icon: FileText,
      show: role === "MAHASISWA",
    },
    {
      href: "/clearance",
      label: "Bebas Kompen",
      icon: CheckCircle,
      show: role === "MAHASISWA",
    },
  ].filter((item) => item.show);

  return (
    <>
      <nav
        className={`fixed top-0 right-0 z-30 transition-all duration-300 lg:left-72 ${
          scrolled
            ? "h-16 border-b border-gray-200/50 bg-white/70 shadow-sm backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-950/70"
            : "h-20 border-b border-transparent bg-transparent"
        } left-0`}
      >
        <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 lg:hidden"
          >
            <div className="from-pnj-blue to-pnj-blue-700 shadow-pnj-blue/20 relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-105">
              <span className="text-lg font-black text-white">S</span>
            </div>
            <span className="hidden text-lg font-bold tracking-tight text-gray-900 sm:block dark:text-gray-100">
              SiKompen
            </span>
          </Link>

          <div className="hidden max-w-xl flex-1 lg:block">
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="group-focus-within:text-pnj-blue h-4 w-4 text-gray-400 transition-colors" />
              </div>
              <input
                type="text"
                className="focus:ring-pnj-blue/20 focus:border-pnj-blue/50 block w-full rounded-xl border border-gray-100 bg-gray-50 py-2 pr-3 pl-10 leading-5 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:bg-white focus:ring-2 focus:outline-none sm:text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:focus:bg-gray-950"
                placeholder="Cari pekerjaan, mahasiswa, atau informasi..."
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="rounded border border-gray-200 px-1.5 py-0.5 text-xs text-gray-400 dark:border-gray-700">
                  ⌘K
                </span>
              </div>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <button className="relative hidden rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100/50 hover:text-gray-600 sm:block dark:hover:bg-gray-800/50 dark:hover:text-gray-300">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full border-2 border-white bg-red-500 dark:border-gray-950"></span>
            </button>

            <div className="hidden h-8 w-px bg-gray-200 sm:block dark:bg-gray-800" />

            <div className="relative z-50" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-3 rounded-full border py-1 pr-3 pl-1 transition-all duration-200 ${
                  dropdownOpen
                    ? "border-pnj-blue/50 ring-pnj-blue/10 bg-white ring-2 dark:bg-gray-900"
                    : "border-transparent bg-transparent hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white bg-gradient-to-tr from-gray-100 to-gray-50 text-sm font-bold text-gray-700 shadow-inner ring-2 ring-gray-100 dark:border-gray-700 dark:from-gray-800 dark:to-gray-700 dark:text-gray-300 dark:ring-gray-800">
                  {userName?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="hidden flex-col items-start sm:flex">
                  <span className="mb-1 text-xs leading-none font-bold text-gray-700 dark:text-gray-200">
                    {userName?.split(" ")[0] || "User"}
                  </span>
                  <span className="text-[10px] leading-none font-semibold tracking-wide text-gray-400 uppercase">
                    {role}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`absolute right-0 z-50 mt-4 w-64 origin-top-right overflow-hidden rounded-2xl border border-gray-100 bg-white/90 shadow-2xl shadow-gray-200/50 backdrop-blur-xl transition-all duration-200 dark:border-gray-800 dark:bg-gray-900/95 dark:shadow-black/50 ${
                  dropdownOpen
                    ? "translate-y-0 scale-100 opacity-100"
                    : "pointer-events-none translate-y-2 scale-95 opacity-0"
                }`}
              >
                <div className="space-y-1 p-2">
                  <div className="mb-1 rounded-xl bg-gray-50/50 px-4 py-3 dark:bg-gray-800/20">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {userName}
                    </p>
                    <p className="truncate text-xs text-gray-500">{role}</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <UserCircle
                      size={18}
                      className="group-hover:text-pnj-blue text-gray-400 transition-colors"
                    />
                    <span className="font-medium">Profil Saya</span>
                  </Link>
                  <div className="mx-2 my-1 h-px bg-gray-100 dark:bg-gray-800" />
                  <button
                    onClick={() => logout()}
                    className="group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut
                      size={18}
                      className="transition-transform group-hover:scale-110"
                    />
                    <span className="font-medium">Keluar</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-xl p-2.5 text-gray-600 transition-colors hover:bg-gray-100/50 md:hidden dark:text-gray-300 dark:hover:bg-gray-800/50"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      <div className="pointer-events-none fixed inset-0 z-[60]">
        <div
          ref={mobileBackdropRef}
          className="pointer-events-none absolute inset-0 bg-gray-900/20 opacity-0 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        <div
          ref={mobileMenuRef}
          className="pointer-events-auto absolute top-0 right-0 bottom-0 flex w-80 translate-x-full flex-col border-l border-gray-100 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950"
        >
          <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-800">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Menu
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4" ref={mobileContentRef}>
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-pnj-blue/10 text-pnj-blue translate-x-2"
                        : "text-gray-600 hover:translate-x-1 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900"
                    }`}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-100 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-gray-900/50">
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="bg-pnj-blue flex h-10 w-10 items-center justify-center rounded-full font-bold text-white">
                {userName?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {userName || "User"}
                </span>
                <span className="text-xs text-gray-500">{role}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <ThemeToggle />
              <button
                onClick={() => logout()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
              >
                <LogOut size={18} />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20" />
    </>
  );
}
