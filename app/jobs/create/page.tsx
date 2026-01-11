"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, Users, AlertCircle } from "lucide-react";
import { createJob } from "@/app/actions/jobs";

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
                    Memproses...
                </>
            ) : (
                "Terbitkan Pekerjaan"
            )}
        </button>
    );
}

export default function CreateJobPage() {
    const router = useRouter();
    const [error, setError] = useState("");

    async function clientAction(formData: FormData) {
        setError("");
        const result = await createJob(formData);

        if (result?.error) {
            setError(result.error);
        } else {
            router.push("/dashboard");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50">


            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-black text-gray-900 leading-tight">
                            Informasi<br />Pekerjaan
                        </h2>

                    </div>

                    <div className="lg:col-span-2">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 flex items-start gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        <form action={clientAction} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Nama Pekerjaan</label>
                                <input
                                    name="title"
                                    placeholder="Misal: Teknisi Jaringan Lab TIK"
                                    required
                                    className="w-full px-0 py-4 bg-transparent border-b-2 border-gray-200 focus:border-gray-900 outline-none transition-all text-2xl font-bold text-gray-900 placeholder:text-gray-300"
                                />
                            </div>

                            <div className="space-y-2 pt-4">
                                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Deskripsi Detail</label>
                                <textarea
                                    name="description"
                                    placeholder="Deskripsikan tanggung jawab, lokasi kerja, dan persyaratan khusus..."
                                    required
                                    rows={6}
                                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[#008C9D] focus:ring-4 focus:ring-[#008C9D]/10 transition-all text-gray-900 placeholder:text-gray-400 text-lg leading-relaxed"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <Clock size={16} />
                                        Total Jam Kompen
                                    </label>
                                    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 focus-within:border-[#008C9D] focus-within:ring-4 focus-within:ring-[#008C9D]/10 transition-all">
                                        <input
                                            type="number"
                                            name="hours"
                                            placeholder="0"
                                            required
                                            min="1"
                                            className="w-full bg-transparent outline-none font-black text-3xl text-gray-900 text-right"
                                        />
                                        <span className="text-gray-400 font-bold pr-2">Jam</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <Users size={16} />
                                        Kuota Penerimaan
                                    </label>
                                    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 focus-within:border-[#008C9D] focus-within:ring-4 focus-within:ring-[#008C9D]/10 transition-all">
                                        <input
                                            type="number"
                                            name="quota"
                                            placeholder="0"
                                            required
                                            min="1"
                                            className="w-full bg-transparent outline-none font-black text-3xl text-gray-900 text-right"
                                        />
                                        <span className="text-gray-400 font-bold pr-2">Orang</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-200 flex items-center justify-between">
                                <Link href="/dashboard" className="text-gray-500 font-bold hover:text-gray-900 transition-colors">
                                    Batal
                                </Link>
                                <SubmitButton />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
