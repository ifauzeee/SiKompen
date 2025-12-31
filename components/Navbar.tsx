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
    Search
} from "lucide-react";

import { logout } from "@/app/actions/auth";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ role, userName }: { role?: string; userName?: string | null }) {
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
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
                ease: "power3.out"
            });
            gsap.to(mobileBackdropRef.current, {
                opacity: 1,
                duration: 0.3,
                pointerEvents: "auto",
                ease: "power2.out"
            });
            gsap.fromTo(mobileContentRef.current?.children || [],
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.05, delay: 0.2, duration: 0.4, ease: "back.out(1.2)" }
            );
        } else {
            gsap.to(mobileMenuRef.current, {
                xPercent: 100,
                duration: 0.4,
                ease: "power3.in"
            });
            gsap.to(mobileBackdropRef.current, {
                opacity: 0,
                duration: 0.3,
                pointerEvents: "none",
                ease: "power2.in"
            });
        }
    }, [mobileOpen]);

    if (!isAuthPage) return null;

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, show: true },
        { href: "/jobs", label: "Pekerjaan", icon: Briefcase, show: true },
        { href: "/dashboard/my-jobs", label: "Pekerjaan Saya", icon: FolderOpen, show: ['ADMIN', 'PENGAWAS'].includes(role || '') },
        { href: "/dashboard/users", label: "Data Pengguna", icon: Users, show: role === 'ADMIN' },
        { href: "/my-applications", label: "Lamaran Saya", icon: FileText, show: role === 'MAHASISWA' },
        { href: "/clearance", label: "Bebas Kompen", icon: CheckCircle, show: role === 'MAHASISWA' },
    ].filter(item => item.show);

    return (
        <>
            <nav
                className={`fixed top-0 right-0 z-30 transition-all duration-300 lg:left-72 ${scrolled
                    ? "h-16 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm"
                    : "h-20 bg-transparent border-b border-transparent"
                    } left-0`}
            >
                <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <Link href="/dashboard" className="group flex items-center gap-3 lg:hidden">
                        <div className="relative w-9 h-9 bg-gradient-to-br from-pnj-blue to-pnj-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-pnj-blue/20 group-hover:scale-105 transition-transform duration-300">
                            <span className="font-black text-white text-lg">S</span>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-gray-100 text-lg tracking-tight hidden sm:block">
                            SiKompen
                        </span>
                    </Link>

                    <div className="hidden lg:block flex-1 max-w-xl">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-pnj-blue transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-100 dark:border-gray-800 rounded-xl leading-5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pnj-blue/20 focus:border-pnj-blue/50 focus:bg-white dark:focus:bg-gray-950 transition-all duration-200 sm:text-sm"
                                placeholder="Cari pekerjaan, mahasiswa, atau informasi..."
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-xs text-gray-400 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5">⌘K</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                        <button className="relative p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors hidden sm:block">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-950"></span>
                        </button>

                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block" />

                        <div className="relative z-50" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className={`flex items-center gap-3 pl-1 pr-3 py-1 rounded-full border transition-all duration-200 ${dropdownOpen
                                    ? "bg-white dark:bg-gray-900 border-pnj-blue/50 ring-2 ring-pnj-blue/10"
                                    : "bg-transparent border-transparent hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                                    }`}
                            >
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-bold shadow-inner border border-white dark:border-gray-700 ring-2 ring-gray-100 dark:ring-gray-800">
                                    {userName?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="hidden sm:flex flex-col items-start">
                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200 leading-none mb-1">
                                        {userName?.split(' ')[0] || 'User'}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-semibold leading-none uppercase tracking-wide">
                                        {role}
                                    </span>
                                </div>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <div
                                className={`absolute right-0 mt-4 w-64 bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 overflow-hidden transition-all duration-200 origin-top-right z-50 ${dropdownOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2 pointer-events-none"
                                    }`}
                            >
                                <div className="p-2 space-y-1">
                                    <div className="px-4 py-3 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl mb-1">
                                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{userName}</p>
                                        <p className="text-xs text-gray-500 truncate">{role}</p>
                                    </div>
                                    <Link
                                        href="/profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                                    >
                                        <UserCircle size={18} className="text-gray-400 group-hover:text-pnj-blue transition-colors" />
                                        <span className="font-medium">Profil Saya</span>
                                    </Link>
                                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1 mx-2" />
                                    <button
                                        onClick={() => logout()}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                                    >
                                        <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">Keluar</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2.5 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300 transition-colors"
                        >
                            <Menu size={22} />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="fixed inset-0 z-[60] pointer-events-none">
                <div
                    ref={mobileBackdropRef}
                    className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm opacity-0 pointer-events-none"
                    onClick={() => setMobileOpen(false)}
                />

                <div
                    ref={mobileMenuRef}
                    className="absolute top-0 right-0 bottom-0 w-80 bg-white dark:bg-gray-950 shadow-2xl border-l border-gray-100 dark:border-gray-800 pointer-events-auto flex flex-col translate-x-full"
                >
                    <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                        <span className="font-bold text-lg text-gray-900 dark:text-white">Menu</span>
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
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
                                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                                            ? 'bg-pnj-blue/10 text-pnj-blue translate-x-2'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:translate-x-1'
                                            }`}
                                    >
                                        <Icon size={20} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                        <div className="flex items-center gap-3 mb-4 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-pnj-blue flex items-center justify-center text-white font-bold">
                                {userName?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{userName || 'User'}</span>
                                <span className="text-xs text-gray-500">{role}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <ThemeToggle />
                            <button
                                onClick={() => logout()}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium text-sm"
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

