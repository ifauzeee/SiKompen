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
    Wallet
} from "lucide-react";
import Image from "next/image";

import { logout } from "@/app/actions/auth";

export default function Sidebar({ role, userName }: { role?: string; userName?: string }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const isAuthPage = !["/", "/login"].includes(pathname);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isAuthPage) return null;

    return (
        <>
            <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 h-16 flex items-center justify-between shadow-sm transition-all duration-300">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#008C9D]/10 rounded-lg flex items-center justify-center p-1">
                        <Image
                            src="/Logo PNJ.png"
                            alt="PNJ Logo"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    </div>
                    <span className="font-black text-gray-900 tracking-tight text-lg">SiKompen</span>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
                    aria-label="Open Menu"
                >
                    <Menu size={24} />
                </button>
            </div>

            <div
                className={`
                    fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
                onClick={() => setIsOpen(false)}
            />

            <aside
                className={`
                    fixed left-0 top-0 bottom-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.02)]
                    transition-transform duration-300 ease-in-out lg:translate-x-0
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="flex flex-col h-full">
                    <div className="h-28 flex flex-col justify-center px-6 border-b border-gray-100 bg-[#008C9D]/5 relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#008C9D]/10 rounded-full blur-2xl -mr-10 -mt-10"></div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:bg-white/50 hover:text-gray-900 rounded-full z-20 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 group relative z-10">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center p-1.5 shrink-0">
                                <Image
                                    src="/Logo PNJ.png"
                                    alt="PNJ Logo"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-lg font-black text-gray-900 tracking-tight leading-none group-hover:text-[#008C9D] transition-colors truncate">
                                    {userName?.split(' ')[0] || 'SiKompen'}
                                </span>
                                <span className="text-[10px] font-bold text-[#008C9D] uppercase tracking-widest mt-1.5 bg-[#008C9D]/10 px-2 py-0.5 rounded-full w-fit">
                                    {role || 'Mahasiswa'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                        <div className="px-4 mt-2 mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            Main Menu
                        </div>

                        {role !== 'KEUANGAN' && (
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
                        {['ADMIN', 'PENGAWAS'].includes(role || '') && (
                            <SidebarLink
                                href="/dashboard/my-jobs"
                                icon={<FolderOpen size={20} />}
                                label="Pekerjaan Saya"
                                active={pathname.startsWith("/dashboard/my-jobs")}
                            />
                        )}

                        {role === 'KEUANGAN' && (
                            <SidebarLink
                                href="/dashboard/finance"
                                icon={<Wallet size={20} />}
                                label="Validasi Pembayaran"
                                active={pathname.startsWith("/dashboard/finance")}
                            />
                        )}

                        {role === 'ADMIN' && (
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

                        {role === 'MAHASISWA' && (
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

                        <div className="my-6 border-t border-gray-100/80 mx-2"></div>

                        <div className="px-4 mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            Settings
                        </div>
                        <SidebarLink
                            href="/profile"
                            icon={<UserCircle size={20} />}
                            label="Profil Saya"
                            active={pathname === "/profile"}
                        />
                    </nav>

                    <div className="p-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
                        <button
                            onClick={() => logout()}
                            className="flex justify-start items-center gap-3 px-4 py-3.5 text-gray-600 hover:bg-[#CE2029]/10 hover:text-[#CE2029] rounded-xl transition-all duration-200 group w-full"
                        >
                            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-bold text-sm">Keluar</span>
                        </button>

                        <div className="text-center mt-4 mb-2">
                            <p className="text-[10px] text-gray-300 font-medium">
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
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${active
                ? 'bg-[#008C9D] text-white shadow-lg shadow-[#008C9D]/25 font-bold'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                }`}
        >
            <span className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                {icon}
            </span>
            <span className="text-sm">{label}</span>

            {!active && (
                <ChevronRight size={14} className="absolute right-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-gray-400" />
            )}
        </Link>
    );
}
