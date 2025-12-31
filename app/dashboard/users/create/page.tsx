"use client";

import { useFormStatus } from "react-dom";
import { createUser } from "@/app/actions/users";
import { ArrowLeft, User, Shield, GraduationCap, Lock, AlertCircle, Building, BookOpen, UserCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            disabled={pending}
            className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ml-auto"
        >
            {pending ? (
                <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Menyimpan...
                </>
            ) : (
                "Simpan User Baru"
            )}
        </button>
    );
}

export default function CreateUserPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [role, setRole] = useState("MAHASISWA");

    async function clientAction(formData: FormData) {
        setError("");
        const result = await createUser(formData);

        if (result?.error) {
            setError(result.error);
        } else {
            router.push('/dashboard/users');
            router.refresh();
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50">


            <div className="max-w-4xl mx-auto px-6 py-12">
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 flex items-start gap-3 border border-red-100">
                        <AlertCircle className="shrink-0 mt-0.5" size={20} />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                <form action={clientAction} className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Peran Pengguna</label>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { id: 'MAHASISWA', icon: GraduationCap, label: 'Mahasiswa' },
                                { id: 'PENGAWAS', icon: User, label: 'Pengawas' },
                                { id: 'ADMIN', icon: Shield, label: 'Admin' }
                            ].map((r) => (
                                <label key={r.id} className="cursor-pointer relative group">
                                    <input
                                        type="radio"
                                        name="role"
                                        value={r.id}
                                        className="peer sr-only"
                                        checked={role === r.id}
                                        onChange={() => setRole(r.id)}
                                    />
                                    <div className="p-6 text-center border-2 border-gray-100 bg-white rounded-2xl peer-checked:bg-gray-900 peer-checked:text-white peer-checked:border-gray-900 transition-all group-hover:border-gray-300 flex flex-col items-center gap-3">
                                        <r.icon size={24} />
                                        <span className="font-bold text-sm">{r.label}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 pt-4">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
                        <input
                            name="name"
                            placeholder="Nama Lengkap User"
                            required
                            className="w-full px-0 py-4 bg-transparent border-b-2 border-gray-200 focus:border-gray-900 outline-none transition-all text-2xl font-bold text-gray-900 placeholder:text-gray-300"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <UserCircle size={16} />
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username atau NIM"
                                required
                                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[#008C9D] focus:ring-4 focus:ring-[#008C9D]/10 transition-all font-bold text-gray-900"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Lock size={16} />
                                Password Default
                            </label>
                            <input
                                type="text"
                                name="password"
                                placeholder="******"
                                required
                                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[#008C9D] focus:ring-4 focus:ring-[#008C9D]/10 transition-all font-bold text-gray-900"
                            />
                        </div>
                    </div>

                    {role === 'MAHASISWA' && (
                        <div className="space-y-8 pt-4 animate-in fade-in slide-in-from-top-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <GraduationCap size={16} />
                                        NIM
                                    </label>
                                    <input
                                        name="nim"
                                        placeholder="Nomor Induk Mahasiswa"
                                        className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[#008C9D] focus:ring-4 focus:ring-[#008C9D]/10 transition-all font-bold text-gray-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider text-red-500 flex items-center gap-2">
                                        Total Hutang (Jam)
                                    </label>
                                    <input
                                        type="number"
                                        name="totalHours"
                                        defaultValue={0}
                                        className="w-full px-6 py-4 bg-red-50 border border-red-100 rounded-2xl outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-bold text-red-600"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <Building size={16} />
                                        Program Studi
                                    </label>
                                    <select
                                        name="prodi"
                                        className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[#008C9D] focus:ring-4 focus:ring-[#008C9D]/10 transition-all font-bold text-gray-900"
                                    >
                                        <option value="">Pilih Program Studi</option>
                                        <option value="Teknik Informatika">Teknik Informatika</option>
                                        <option value="Teknik Multimedia dan Jaringan">Teknik Multimedia dan Jaringan</option>
                                        <option value="Teknik Multimedia Digital">Teknik Multimedia Digital</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <BookOpen size={16} />
                                        Kelas
                                    </label>
                                    <input
                                        name="kelas"
                                        placeholder="Contoh: TI 1A"
                                        className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[#008C9D] focus:ring-4 focus:ring-[#008C9D]/10 transition-all font-bold text-gray-900"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-8 border-t border-gray-200 flex items-center justify-between">
                        <Link href="/dashboard/users" className="text-gray-500 font-bold hover:text-gray-900">Batal</Link>
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}

