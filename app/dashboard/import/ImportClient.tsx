"use client";

import { useState } from "react";
import { importStudents } from "@/app/actions/admin";
import Link from "next/link";
import { ArrowLeft, FileUp, Upload, CheckCircle, AlertCircle, FileText, Info, AlertTriangle } from "lucide-react";

interface ParsedStudent {
    nim: string;
    name: string;
    prodi: string;
    kelas: string;
}

export default function ImportClient() {
    const [textData, setTextData] = useState("");
    const [prodi, setProdi] = useState("Teknik Informatika");
    const [kelas, setKelas] = useState("");
    const [preview, setPreview] = useState<ParsedStudent[]>([]);
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState<{ success: number; skip: number; error: number } | null>(null);

    function parseData() {
        if (!textData.trim()) return;

        const lines = textData.split('\n').filter(line => line.trim());
        const students: ParsedStudent[] = [];

        for (const line of lines) {
            if (line.toLowerCase().includes('nim') || line.toLowerCase().includes('nama')) continue;
            if (line.startsWith('No') || line.startsWith('DATA')) continue;

            const parts = line.split(/\t+|\s{2,}/);

            let nim = "";
            let name = "";

            for (const part of parts) {
                const trimmed = part.trim();
                if (/^\d{10}$/.test(trimmed)) {
                    nim = trimmed;
                } else if (trimmed.length > 3 && !/^\d+$/.test(trimmed) && trimmed !== "L" && trimmed !== "P") {
                    if (!name) name = trimmed;
                }
            }

            if (nim && name) {
                students.push({
                    nim,
                    name,
                    prodi,
                    kelas
                });
            }
        }

        setPreview(students);
        setResult(null);
    }

    async function handleImport() {
        if (preview.length === 0) return;

        setImporting(true);
        const res = await importStudents(preview);
        setImporting(false);

        if (res.success) {
            setResult({
                success: res.successCount || 0,
                skip: res.skipCount || 0,
                error: res.errorCount || 0
            });
            setPreview([]);
            setTextData("");
        }
    }

    return (
        <div className="pt-8 px-4 sm:px-8 max-w-[1600px] mx-auto min-h-screen pb-12 space-y-8">
            <header>
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors mb-6 font-medium group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Kembali ke Dashboard
                </Link>
                <div className="flex items-start gap-4">
                    <div className="p-4 bg-[#008C9D]/10 text-[#008C9D] rounded-2xl">
                        <FileUp size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                            Import Data Mahasiswa
                        </h1>
                        <p className="text-gray-500 text-lg font-medium">
                            Tambah data mahasiswa secara massal dari Excel atau CSV.
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">1</div>
                            <h3 className="text-xl font-bold text-gray-900">Konfigurasi Data</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Program Studi</label>
                                <div className="relative">
                                    <select
                                        value={prodi}
                                        onChange={(e) => setProdi(e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-[#008C9D]/20 focus:shadow-lg focus:shadow-[#008C9D]/5 outline-none transition-all appearance-none"
                                    >
                                        <option value="Teknik Informatika">Teknik Informatika</option>
                                        <option value="Teknik Multimedia dan Jaringan">Teknik Multimedia dan Jaringan</option>
                                        <option value="Teknik Multimedia Digital">Teknik Multimedia Digital</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <ArrowLeft size={20} className="-rotate-90" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Kelas</label>
                                <input
                                    type="text"
                                    value={kelas}
                                    onChange={(e) => setKelas(e.target.value)}
                                    placeholder="Contoh: TI 6A"
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-[#008C9D]/20 focus:shadow-lg focus:shadow-[#008C9D]/5 outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">2</div>
                            <h3 className="text-xl font-bold text-gray-900">Paste Data Excel</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 mb-4">
                                <p className="text-sm text-blue-800 font-medium flex gap-2">
                                    <Info size={18} className="shrink-0" />
                                    Salin kolom NIM dan Nama dari Excel, lalu tempel di bawah ini.
                                </p>
                            </div>

                            <textarea
                                value={textData}
                                onChange={(e) => setTextData(e.target.value)}
                                placeholder={"NIM         Nama Mahasiswa\n2107411001  Ahmad Dahlan\n2107411002  Budi Santoso..."}
                                rows={12}
                                className="w-full p-5 bg-gray-50 border-2 border-transparent rounded-2xl font-mono text-sm text-gray-900 focus:bg-white focus:border-[#008C9D]/20 focus:shadow-lg focus:shadow-[#008C9D]/5 outline-none transition-all resize-none placeholder:text-gray-400"
                            />

                            <button
                                onClick={parseData}
                                disabled={!textData.trim() || !kelas.trim()}
                                className="w-full py-4 bg-[#008C9D] text-white rounded-xl font-bold hover:bg-[#007A8A] transition-colors shadow-lg shadow-[#008C9D]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                            >
                                <FileText size={20} className="group-hover:scale-110 transition-transform" />
                                Proses Data
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {result && (
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 animate-in slide-in-from-top-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold shrink-0">
                                    <CheckCircle size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Hasil Import</h3>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-green-50 rounded-2xl border border-green-100 text-center">
                                    <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Berhasil</p>
                                    <p className="text-3xl font-black text-green-900">{result.success}</p>
                                </div>
                                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                                    <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Dilewati</p>
                                    <p className="text-3xl font-black text-orange-900">{result.skip}</p>
                                </div>
                                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-center">
                                    <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Gagal</p>
                                    <p className="text-3xl font-black text-red-900">{result.error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {preview.length > 0 && !result && (
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col h-full max-h-[800px]">
                            <div className="flex items-center justify-between mb-6 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-bold shrink-0">3</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Preview Data</h3>
                                        <p className="text-sm font-medium text-gray-400">{preview.length} data terbaca</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleImport}
                                    disabled={importing}
                                    className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2"
                                >
                                    {importing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Proses...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={18} />
                                            Import Sekarang
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="flex-1 overflow-hidden relative rounded-2xl border border-gray-100">
                                <div className="absolute inset-0 overflow-y-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 sticky top-0 z-10">
                                            <tr>
                                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">NIM</th>
                                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Mahasiswa</th>
                                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Kelas</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {preview.map((s, i) => (
                                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                    <td className="p-4 font-mono font-bold text-gray-600 text-sm">{s.nim}</td>
                                                    <td className="p-4 font-bold text-gray-900 text-sm">{s.name}</td>
                                                    <td className="p-4 text-gray-500 text-sm font-medium">{s.kelas}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {!preview.length && !result && (
                        <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 rounded-[2.5rem] text-gray-400">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle size={32} className="opacity-50" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-600">Belum ada data</h3>
                            <p className="max-w-xs mx-auto mt-2">
                                Data yang Anda proses akan muncul di sini untuk diperiksa sebelum disimpan.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
