"use client";

import { useState } from "react";
import { importStudents } from "@/app/actions/admin";
import Link from "next/link";
import { ArrowLeft, FileUp, Upload, CheckCircle, AlertCircle, FileText } from "lucide-react";

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
        const lines = textData.split('\n').filter(line => line.trim());
        const students: ParsedStudent[] = [];

        for (const line of lines) {
            if (line.toLowerCase().includes('nim') || line.toLowerCase().includes('nama')) continue;
            if (line.startsWith('No') || line.startsWith('DATA')) continue;

            const parts = line.split(/\t+|\s{2,}/);

            if (parts.length >= 3) {
                const nimCandidate = parts[1]?.trim();
                const nameCandidate = parts[2]?.trim();

                if (/^\d{10}$/.test(nimCandidate) && nameCandidate) {
                    students.push({
                        nim: nimCandidate,
                        name: nameCandidate,
                        prodi: prodi,
                        kelas: kelas
                    });
                }
            } else if (parts.length >= 2) {
                const nimCandidate = parts[0]?.trim();
                const nameCandidate = parts[1]?.trim();

                if (/^\d{10}$/.test(nimCandidate) && nameCandidate) {
                    students.push({
                        nim: nimCandidate,
                        name: nameCandidate,
                        prodi: prodi,
                        kelas: kelas
                    });
                }
            }
        }

        setPreview(students);
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
        <div className="min-h-screen bg-gray-50/50">
            <div className="border-b border-gray-200 bg-white sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                        <ArrowLeft size={24} />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#008C9D]/10 text-[#008C9D] rounded-xl">
                            <FileUp size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Import Data Mahasiswa</h1>
                            <p className="text-sm text-gray-500">Tambah mahasiswa dari data teks</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {result && (
                    <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-2xl">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle size={24} className="text-green-600" />
                            <h3 className="font-bold text-green-800">Import Selesai!</h3>
                        </div>
                        <p className="text-green-700">
                            Berhasil: <strong>{result.success}</strong> |
                            Dilewati: <strong>{result.skip}</strong> |
                            Gagal: <strong>{result.error}</strong>
                        </p>
                    </div>
                )}

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-500 mb-2">Program Studi</label>
                            <select
                                value={prodi}
                                onChange={(e) => setProdi(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl font-medium focus:border-[#008C9D] outline-none"
                            >
                                <option value="Teknik Informatika">Teknik Informatika</option>
                                <option value="Teknik Multimedia dan Jaringan">Teknik Multimedia dan Jaringan</option>
                                <option value="Teknik Multimedia Digital">Teknik Multimedia Digital</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-500 mb-2">Kelas</label>
                            <input
                                type="text"
                                value={kelas}
                                onChange={(e) => setKelas(e.target.value)}
                                placeholder="Contoh: TI 1A"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl font-medium focus:border-[#008C9D] outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">
                            Data Mahasiswa (Copy-paste dari Excel)
                        </label>
                        <textarea
                            value={textData}
                            onChange={(e) => setTextData(e.target.value)}
                            placeholder={"No\tNIM\tNama Mahasiswa\n1\t2507411001\tNama Mahasiswa 1\n2\t2507411002\tNama Mahasiswa 2\n..."}
                            rows={10}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl font-mono text-sm focus:border-[#008C9D] outline-none resize-none"
                        />
                    </div>

                    <button
                        onClick={parseData}
                        disabled={!textData.trim() || !kelas.trim()}
                        className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <FileText size={20} />
                        Parse Data
                    </button>
                </div>

                {preview.length > 0 && (
                    <div className="mt-6 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900">Preview Data</h3>
                                <p className="text-sm text-gray-500">{preview.length} mahasiswa ditemukan</p>
                            </div>
                            <button
                                onClick={handleImport}
                                disabled={importing}
                                className="px-6 py-3 bg-[#008C9D] text-white rounded-xl font-bold hover:bg-[#007A8A] transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {importing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Mengimport...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={20} />
                                        Import Semua
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="p-4 text-xs font-bold text-gray-500">NIM</th>
                                        <th className="p-4 text-xs font-bold text-gray-500">NAMA</th>
                                        <th className="p-4 text-xs font-bold text-gray-500">KELAS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {preview.slice(0, 50).map((s, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="p-4 font-mono text-sm">{s.nim}</td>
                                            <td className="p-4 font-medium">{s.name}</td>
                                            <td className="p-4 text-gray-500">{s.kelas}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {preview.length > 50 && (
                                <p className="p-4 text-center text-sm text-gray-400">
                                    ...dan {preview.length - 50} lainnya
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
