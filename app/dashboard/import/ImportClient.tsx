"use client";

import { useState } from "react";
import { importStudents } from "@/app/actions/admin";
import Link from "next/link";
import {
  ArrowLeft,
  FileUp,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  Info,
} from "lucide-react";

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
  const [result, setResult] = useState<{
    success: number;
    skip: number;
    error: number;
  } | null>(null);

  function parseData() {
    if (!textData.trim()) return;

    const lines = textData.split("\n").filter((line) => line.trim());
    const students: ParsedStudent[] = [];

    for (const line of lines) {
      if (
        line.toLowerCase().includes("nim") ||
        line.toLowerCase().includes("nama")
      )
        continue;
      if (line.startsWith("No") || line.startsWith("DATA")) continue;

      const parts = line.split(/\t+|\s{2,}/);

      let nim = "";
      let name = "";

      for (const part of parts) {
        const trimmed = part.trim();
        if (/^\d{10}$/.test(trimmed)) {
          nim = trimmed;
        } else if (
          trimmed.length > 3 &&
          !/^\d+$/.test(trimmed) &&
          trimmed !== "L" &&
          trimmed !== "P"
        ) {
          if (!name) name = trimmed;
        }
      }

      if (nim && name) {
        students.push({
          nim,
          name,
          prodi,
          kelas,
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
        error: res.errorCount || 0,
      });
      setPreview([]);
      setTextData("");
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-[1600px] space-y-8 px-4 pt-8 pb-12 sm:px-8">
      <header>
        <Link
          href="/dashboard"
          className="group mb-6 inline-flex items-center gap-2 font-medium text-gray-400 transition-colors hover:text-gray-900"
        >
          <ArrowLeft
            size={20}
            className="transition-transform group-hover:-translate-x-1"
          />
          Kembali ke Dashboard
        </Link>
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-[#008C9D]/10 p-4 text-[#008C9D]">
            <FileUp size={32} />
          </div>
          <div>
            <h1 className="mb-2 text-4xl font-black tracking-tight text-gray-900">
              Import Data Mahasiswa
            </h1>
            <p className="text-lg font-medium text-gray-500">
              Tambah data mahasiswa secara massal dari Excel atau CSV.
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/50">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Konfigurasi Data
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold tracking-wider text-gray-500 uppercase">
                  Program Studi
                </label>
                <div className="relative">
                  <select
                    value={prodi}
                    onChange={(e) => setProdi(e.target.value)}
                    className="w-full appearance-none rounded-2xl border-2 border-transparent bg-gray-50 px-5 py-4 font-bold text-gray-900 transition-all outline-none focus:border-[#008C9D]/20 focus:bg-white focus:shadow-lg focus:shadow-[#008C9D]/5"
                  >
                    <option value="Teknik Informatika">
                      Teknik Informatika
                    </option>
                    <option value="Teknik Multimedia dan Jaringan">
                      Teknik Multimedia dan Jaringan
                    </option>
                    <option value="Teknik Multimedia Digital">
                      Teknik Multimedia Digital
                    </option>
                  </select>
                  <div className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-gray-400">
                    <ArrowLeft size={20} className="-rotate-90" />
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold tracking-wider text-gray-500 uppercase">
                  Kelas
                </label>
                <input
                  type="text"
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  placeholder="Contoh: TI 6A"
                  className="w-full rounded-2xl border-2 border-transparent bg-gray-50 px-5 py-4 font-bold text-gray-900 transition-all outline-none placeholder:text-gray-300 focus:border-[#008C9D]/20 focus:bg-white focus:shadow-lg focus:shadow-[#008C9D]/5"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/50">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Paste Data Excel
              </h3>
            </div>

            <div className="space-y-4">
              <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="flex gap-2 text-sm font-medium text-blue-800">
                  <Info size={18} className="shrink-0" />
                  Salin kolom NIM dan Nama dari Excel, lalu tempel di bawah ini.
                </p>
              </div>

              <textarea
                value={textData}
                onChange={(e) => setTextData(e.target.value)}
                placeholder={
                  "NIM         Nama Mahasiswa\n2107411001  Ahmad Dahlan\n2107411002  Budi Santoso..."
                }
                rows={12}
                className="w-full resize-none rounded-2xl border-2 border-transparent bg-gray-50 p-5 font-mono text-sm text-gray-900 transition-all outline-none placeholder:text-gray-400 focus:border-[#008C9D]/20 focus:bg-white focus:shadow-lg focus:shadow-[#008C9D]/5"
              />

              <button
                onClick={parseData}
                disabled={!textData.trim() || !kelas.trim()}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#008C9D] py-4 font-bold text-white shadow-lg shadow-[#008C9D]/20 transition-colors hover:bg-[#007A8A] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FileText
                  size={20}
                  className="transition-transform group-hover:scale-110"
                />
                Proses Data
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {result && (
            <div className="animate-in slide-in-from-top-4 rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/50">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-600">
                  <CheckCircle size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Hasil Import
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-center">
                  <p className="mb-1 text-xs font-bold tracking-widest text-green-600 uppercase">
                    Berhasil
                  </p>
                  <p className="text-3xl font-black text-green-900">
                    {result.success}
                  </p>
                </div>
                <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4 text-center">
                  <p className="mb-1 text-xs font-bold tracking-widest text-orange-600 uppercase">
                    Dilewati
                  </p>
                  <p className="text-3xl font-black text-orange-900">
                    {result.skip}
                  </p>
                </div>
                <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-center">
                  <p className="mb-1 text-xs font-bold tracking-widest text-red-600 uppercase">
                    Gagal
                  </p>
                  <p className="text-3xl font-black text-red-900">
                    {result.error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {preview.length > 0 && !result && (
            <div className="flex h-full max-h-[800px] flex-col rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/50">
              <div className="mb-6 flex shrink-0 items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 font-bold text-purple-600">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Preview Data
                    </h3>
                    <p className="text-sm font-medium text-gray-400">
                      {preview.length} data terbaca
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-bold text-white shadow-lg transition-colors hover:bg-black disabled:opacity-50"
                >
                  {importing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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

              <div className="relative flex-1 overflow-hidden rounded-2xl border border-gray-100">
                <div className="absolute inset-0 overflow-y-auto">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 z-10 bg-gray-50">
                      <tr>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
                          NIM
                        </th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
                          Nama Mahasiswa
                        </th>
                        <th className="p-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
                          Kelas
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {preview.map((s, i) => (
                        <tr
                          key={i}
                          className="transition-colors hover:bg-gray-50"
                        >
                          <td className="p-4 font-mono text-sm font-bold text-gray-600">
                            {s.nim}
                          </td>
                          <td className="p-4 text-sm font-bold text-gray-900">
                            {s.name}
                          </td>
                          <td className="p-4 text-sm font-medium text-gray-500">
                            {s.kelas}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {!preview.length && !result && (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-gray-200 p-8 text-center text-gray-400">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                <AlertCircle size={32} className="opacity-50" />
              </div>
              <h3 className="text-lg font-bold text-gray-600">
                Belum ada data
              </h3>
              <p className="mx-auto mt-2 max-w-xs">
                Data yang Anda proses akan muncul di sini untuk diperiksa
                sebelum disimpan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
