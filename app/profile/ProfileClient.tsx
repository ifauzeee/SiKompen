"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import { logout, changePassword } from "@/app/actions/auth";
import Link from "next/link";
import {
    ArrowLeft,
    User as UserIcon,
    Shield,
    GraduationCap,
    Lock,
    LogOut,
    Check,
    AlertCircle,
    Building,
    BookOpen,
    Clock
} from "lucide-react";

export default function ProfileClient({ user }: { user: User }) {
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Password baru tidak cocok.");
            return;
        }

        setLoading(true);
        const result = await changePassword(currentPassword, newPassword);
        setLoading(false);

        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => {
                setSuccess(false);
                setShowPasswordForm(false);
            }, 2000);
        }
    }

    async function handleLogout() {
        await logout();
    }

    const roleIcons = {
        'ADMIN': <Shield size={24} className="text-white" />,
        'PENGAWAS': <UserIcon size={24} className="text-[#008C9D]" />,
        'MAHASISWA': <GraduationCap size={24} className="text-[#CE2029]" />
    };

    const roleColors = {
        'ADMIN': 'bg-[#008C9D] text-white border-[#008C9D]',
        'PENGAWAS': 'bg-white text-gray-900 border-[#008C9D]',
        'MAHASISWA': 'bg-white text-gray-900 border-[#CE2029]'
    };

    return (
        <div className="pt-8 px-4 sm:px-8 max-w-[1600px] mx-auto min-h-screen pb-12 space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">Profil Saya</h1>
                    <p className="text-gray-500 text-sm md:text-lg font-medium">Kelola informasi akun dan keamanan Anda.</p>
                </div>
            </header>

            <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Lock className="text-[#008C9D]" size={24} />
                    Ubah Password
                </h2>

                <form onSubmit={handleChangePassword} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={18} className="shrink-0" />
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-4 bg-green-50 text-green-600 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                            <Check size={18} className="shrink-0" />
                            Password berhasil diubah!
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">Password Lama</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                placeholder="Masukkan password saat ini"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#008C9D] focus:ring-4 focus:ring-[#008C9D]/10 outline-none transition-all placeholder:text-gray-400 text-sm md:text-base"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">Password Baru</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="Minimal 6 karakter"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#008C9D] focus:ring-4 focus:ring-[#008C9D]/10 outline-none transition-all placeholder:text-gray-400 text-sm md:text-base"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">Konfirmasi Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="Ulangi password baru"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#008C9D] focus:ring-4 focus:ring-[#008C9D]/10 outline-none transition-all placeholder:text-gray-400 text-sm md:text-base"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto px-8 py-3 bg-[#008C9D] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#008C9D]/30 hover:bg-[#007A8A] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <>
                                    <Check size={18} />
                                    <span>Simpan Perubahan</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
