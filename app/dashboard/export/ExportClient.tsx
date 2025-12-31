"use client";

import { useState } from "react";
import { getStudentsForExport } from "@/app/actions/admin";
import Link from "next/link";
import { ArrowLeft, Download, FileSpreadsheet, Filter, Printer } from "lucide-react";

interface Student {
    nim: string | null;
    name: string | null;
    prodi: string | null;
    kelas: string | null;
    totalHours: number;
}

export default function ExportClient({ prodis, kelasList }: { prodis: string[]; kelasList: string[] }) {
    const [prodi, setProdi] = useState("");
    const [kelas, setKelas] = useState("");
    const [hasDebt, setHasDebt] = useState(false);
    const [data, setData] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);

    async function loadData() {
        setLoading(true);
        const students = await getStudentsForExport({
            prodi: prodi || undefined,
            kelas: kelas || undefined,
            hasDebt: hasDebt || undefined
        });
        setData(students);
        setLoading(false);
    }

    function exportToCSV() {
        if (data.length === 0) return;

        const headers = ['NIM', 'Nama', 'Program Studi', 'Kelas', 'Jam Hutang'];
        const rows = data.map(s => [
            s.nim || '',
            s.name || '',
            s.prodi || '',
            s.kelas || '',
            s.totalHours.toString()
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `export_mahasiswa_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    }

    function printData() {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Laporan Data Mahasiswa</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { font-size: 18px; margin-bottom: 10px; }
                    p { font-size: 12px; color: #666; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; font-size: 12px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f5f5f5; font-weight: bold; }
                    .debt { color: red; font-weight: bold; }
                    @media print { body { padding: 0; } }
                </style>
            </head>
            <body>
                <h1>Laporan Data Mahasiswa - SiKompen</h1>
                <p>Dicetak: ${new Date().toLocaleString('id-ID')} | Total: ${data.length} mahasiswa</p>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>NIM</th>
                            <th>Nama</th>
                            <th>Kelas</th>
                            <th>Jam Hutang</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((s, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${s.nim || '-'}</td>
                                <td>${s.name || '-'}</td>
                                <td>${s.kelas || '-'}</td>
                                <td class="${s.totalHours > 0 ? 'debt' : ''}">${s.totalHours}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
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
                            <Download size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Export Data</h1>
                            <p className="text-sm text-gray-500">Download data mahasiswa</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter size={20} className="text-gray-400" />
                        <h3 className="font-bold text-gray-900">Filter Data</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select
                            value={prodi}
                            onChange={(e) => setProdi(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-xl font-medium focus:border-[#008C9D] outline-none"
                        >
                            <option value="">Semua Prodi</option>
                            {prodis.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>

                        <select
                            value={kelas}
                            onChange={(e) => setKelas(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-xl font-medium focus:border-[#008C9D] outline-none"
                        >
                            <option value="">Semua Kelas</option>
                            {kelasList.sort().map(k => (
                                <option key={k} value={k}>{k}</option>
                            ))}
                        </select>

                        <label className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={hasDebt}
                                onChange={(e) => setHasDebt(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <span className="font-medium text-gray-700">Hanya Berhutang</span>
                        </label>

                        <button
                            onClick={loadData}
                            disabled={loading}
                            className="px-6 py-3 bg-[#008C9D] text-white rounded-xl font-bold hover:bg-[#007A8A] transition-colors disabled:opacity-50"
                        >
                            {loading ? "Loading..." : "Tampilkan Data"}
                        </button>
                    </div>
                </div>

                {data.length > 0 && (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900">Hasil ({data.length} mahasiswa)</h3>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={exportToCSV}
                                    className="px-4 py-2 bg-[#008C9D]/10 text-[#008C9D] rounded-xl font-bold hover:bg-[#008C9D]/20 transition-colors flex items-center gap-2"
                                >
                                    <FileSpreadsheet size={18} />
                                    Export CSV
                                </button>
                                <button
                                    onClick={printData}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                                >
                                    <Printer size={18} />
                                    Print
                                </button>
                            </div>
                        </div>

                        <div className="max-h-[500px] overflow-y-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="p-4 text-xs font-bold text-gray-500">NO</th>
                                        <th className="p-4 text-xs font-bold text-gray-500">NIM</th>
                                        <th className="p-4 text-xs font-bold text-gray-500">NAMA</th>
                                        <th className="p-4 text-xs font-bold text-gray-500">KELAS</th>
                                        <th className="p-4 text-xs font-bold text-gray-500 text-right">JAM HUTANG</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data.map((s, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="p-4 text-gray-400">{i + 1}</td>
                                            <td className="p-4 font-mono text-sm">{s.nim}</td>
                                            <td className="p-4 font-medium">{s.name}</td>
                                            <td className="p-4 text-gray-500">{s.kelas}</td>
                                            <td className={`p-4 text-right font-bold ${s.totalHours > 0 ? 'text-[#CE2029]' : 'text-[#008C9D]'}`}>
                                                {s.totalHours}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
