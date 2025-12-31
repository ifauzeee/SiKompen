"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Shield, GraduationCap, FileText } from "lucide-react";

export default function HelpPage() {
    return (
        <div className="pt-8 px-4 max-w-5xl mx-auto pb-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black text-gray-900 mb-4">Pusat Bantuan SiKompen</h1>
                <p className="text-lg text-gray-500">Temukan panduan lengkap penggunaan sistem kompensasi PNJ.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                        <Shield className="text-[#008C9D]" />
                        Untuk Admin & Pengawas
                    </h2>

                    <Accordion title="Cara Membuat Pekerjaan Baru">
                        <ol className="list-decimal pl-5 space-y-2 text-gray-600 text-sm">
                            <li>Klik tombol <strong>&quot;Buat Pekerjaan Baru&quot;</strong> di Dashboard.</li>
                            <li>Isi detail pekerjaan (Judul, Jam Kompen, Kuota, dll).</li>
                            <li>Klik <strong>Simpan</strong>. Pekerjaan akan langsung muncul di halaman mahasiswa.</li>
                        </ol>
                    </Accordion>

                    <Accordion title="Cara Memvalidasi Mahasiswa">
                        <ol className="list-decimal pl-5 space-y-2 text-gray-600 text-sm">
                            <li>Buka Dashboard dan lihat bagian <strong>&quot;Validation Queue&quot;</strong>.</li>
                            <li>Klik <strong>Terima</strong> untuk menyetujui. Jam kompen mahasiswa akan otomatis berkurang.</li>
                            <li>Klik <strong>Tolak</strong> jika pekerjaan tidak sesuai.</li>
                        </ol>
                    </Accordion>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                        <GraduationCap className="text-blue-600" />
                        Untuk Mahasiswa
                    </h2>

                    <Accordion title="Cara Melamar Pekerjaan">
                        <ol className="list-decimal pl-5 space-y-2 text-gray-600 text-sm">
                            <li>Buka menu <strong>Pekerjaan</strong>.</li>
                            <li>Pilih pekerjaan yang diminati dan klik tombol <strong>Lamar</strong>.</li>
                            <li>Tunggu validasi dari Pengawas/Admin.</li>
                        </ol>
                    </Accordion>

                    <Accordion title="Kapan Jam Kompen Berkurang?">
                        <p className="text-gray-600 text-sm">
                            Jam kompen Anda HANYA akan berkurang setelah Pengawas/Admin menekan tombol <strong>Terima (Approve)</strong> pada lamaran Anda.
                        </p>
                    </Accordion>

                    <Accordion title="Cara Mengajukan Bebas Kompen">
                        <ol className="list-decimal pl-5 space-y-2 text-gray-600 text-sm">
                            <li>Pastikan sisa jam kompen Anda sudah <strong>0 Jam</strong>.</li>
                            <li>Buka menu <strong>Bebas Kompen</strong>.</li>
                            <li>Unduh surat keterangan bebas kompen.</li>
                        </ol>
                    </Accordion>
                </div>
            </div>

            <div className="mt-12 bg-gray-50 p-8 rounded-3xl border border-gray-100 text-center">
                <FileText className="mx-auto text-gray-400 mb-4" size={40} />
                <h3 className="text-lg font-bold text-gray-900">Masih Butuh Bantuan?</h3>
                <p className="text-gray-500 mb-6">Hubungi Admin Jurusan atau Kepala Laboratorium TIK.</p>
                <div className="text-sm font-medium text-[#008C9D]">tiktik@pnj.ac.id</div>
            </div>
        </div>
    );
}

function Accordion({ title, children }: { title: string, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-bold text-gray-800 hover:bg-gray-50 transition-colors"
            >
                <span>{title}</span>
                {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </button>
            {isOpen && (
                <div className="p-4 pt-0 border-t border-gray-100 bg-gray-50/50">
                    {children}
                </div>
            )}
        </div>
    );
}
