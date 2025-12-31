"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    CheckCircle,
    LogOut,
    Users,
    FolderOpen,
    UserCircle,
    Settings,
    ChevronRight
} from "lucide-react";
import Image from "next/image";

import { logout } from "@/app/actions/auth";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar({ role, userName }: { role?: string; userName?: string }) {
    const pathname = usePathname();
    const sidebarRef = useRef(null);
    const isAuthPage = !["/", "/login"].includes(pathname);

    if (!isAuthPage) return null;

    return (
        <aside
            ref={sidebarRef}
            className="fixed left-0 top-0 bottom-0 z-40 w-20 lg:w-72 bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
        >
            <div className="flex flex-col h-full">
                <div className="h-28 flex flex-col justify-center px-6 border-b border-gray-100 bg-[#008C9D]/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#008C9D]/10 rounded-full blur-2xl -mr-10 -mt-10"></div>

                    <Link href="/dashboard" className="flex items-center gap-3 group relative z-10">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center p-1.5 shrink-0">
                            <Image
                                src="/Logo PNJ.png"
                                alt="PNJ Logo"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                        </div>
                        <div className="hidden lg:flex flex-col">
                            <span className="text-lg font-black text-gray-900 tracking-tight leading-none group-hover:text-[#008C9D] transition-colors truncate w-full">
                                {userName?.split(' ')[0] || 'SiKompen'}
                            </span>
                            <span className="text-[10px] font-bold text-[#008C9D] uppercase tracking-widest mt-1.5 bg-[#008C9D]/10 px-2 py-0.5 rounded-full w-fit">
                                {role || 'Mahasiswa'}
                            </span>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                    <div className="hidden lg:block px-4 mt-2 mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        Main Menu
                    </div>

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

                    {['ADMIN', 'PENGAWAS'].includes(role || '') && (
                        <SidebarLink
                            href="/dashboard/my-jobs"
                            icon={<FolderOpen size={20} />}
                            label="Pekerjaan Saya"
                            active={pathname.startsWith("/dashboard/my-jobs")}
                        />
                    )}

                    {role === 'ADMIN' && (
                        <SidebarLink
                            href="/dashboard/users"
                            icon={<Users size={20} />}
                            label="Data Pengguna"
                            active={pathname.startsWith("/dashboard/users")}
                        />
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

                    <div className="hidden lg:block px-4 mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        Settings
                    </div>
                    <SidebarLink
                        href="/profile"
                        icon={<UserCircle size={20} />}
                        label="Profil Saya"
                        active={pathname === "/profile"}
                    />
                </nav>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <button
                        onClick={() => logout()}
                        className="flex justify-center lg:justify-start items-center gap-3 px-4 py-3.5 text-gray-600 hover:bg-[#CE2029]/10 hover:text-[#CE2029] rounded-xl transition-all duration-200 group w-full"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold hidden lg:block text-sm">Keluar</span>
                    </button>

                    <div className="hidden lg:block text-center mt-4 mb-2">
                        <p className="text-[10px] text-gray-300 font-medium">
                            &copy; 2025 Politeknik Negeri Jakarta
                        </p>
                    </div>
                </div>
            </div>
        </aside>
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
            <span className="hidden lg:block text-sm">{label}</span>

            {!active && (
                <ChevronRight size={14} className="absolute right-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-gray-400" />
            )}
        </Link>
    );
}


