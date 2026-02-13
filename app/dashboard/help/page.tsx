"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Shield,
  GraduationCap,
  FileText,
} from "lucide-react";

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 pb-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-black text-gray-900">
          Pusat Bantuan SiKompen
        </h1>
        <p className="text-lg text-gray-500">
          Temukan panduan lengkap penggunaan sistem kompensasi PNJ.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Shield className="text-[#008C9D]" />
            Untuk Admin & Pengawas
          </h2>

          <Accordion title="Cara Membuat Pekerjaan Baru">
            <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-600">
              <li>
                Klik tombol <strong>&quot;Buat Pekerjaan Baru&quot;</strong> di
                Dashboard.
              </li>
              <li>Isi detail pekerjaan (Judul, Jam Kompen, Kuota, dll).</li>
              <li>
                Klik <strong>Simpan</strong>. Pekerjaan akan langsung muncul di
                halaman mahasiswa.
              </li>
            </ol>
          </Accordion>

          <Accordion title="Cara Memvalidasi Mahasiswa">
            <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-600">
              <li>
                Buka Dashboard dan lihat bagian{" "}
                <strong>&quot;Validation Queue&quot;</strong>.
              </li>
              <li>
                Klik <strong>Terima</strong> untuk menyetujui. Jam kompen
                mahasiswa akan otomatis berkurang.
              </li>
              <li>
                Klik <strong>Tolak</strong> jika pekerjaan tidak sesuai.
              </li>
            </ol>
          </Accordion>
        </div>

        <div className="space-y-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <GraduationCap className="text-blue-600" />
            Untuk Mahasiswa
          </h2>

          <Accordion title="Cara Melamar Pekerjaan">
            <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-600">
              <li>
                Buka menu <strong>Pekerjaan</strong>.
              </li>
              <li>
                Pilih pekerjaan yang diminati dan klik tombol{" "}
                <strong>Lamar</strong>.
              </li>
              <li>Tunggu validasi dari Pengawas/Admin.</li>
            </ol>
          </Accordion>

          <Accordion title="Kapan Jam Kompen Berkurang?">
            <p className="text-sm text-gray-600">
              Jam kompen Anda HANYA akan berkurang setelah Pengawas/Admin
              menekan tombol <strong>Terima (Approve)</strong> pada lamaran
              Anda.
            </p>
          </Accordion>

          <Accordion title="Cara Mengajukan Bebas Kompen">
            <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-600">
              <li>
                Pastikan sisa jam kompen Anda sudah <strong>0 Jam</strong>.
              </li>
              <li>
                Buka menu <strong>Bebas Kompen</strong>.
              </li>
              <li>Unduh surat keterangan bebas kompen.</li>
            </ol>
          </Accordion>
        </div>
      </div>

      <div className="mt-12 rounded-3xl border border-gray-100 bg-gray-50 p-8 text-center">
        <FileText className="mx-auto mb-4 text-gray-400" size={40} />
        <h3 className="text-lg font-bold text-gray-900">
          Masih Butuh Bantuan?
        </h3>
        <p className="mb-6 text-gray-500">
          Hubungi Admin Jurusan atau Kepala Laboratorium TIK.
        </p>
        <div className="text-sm font-medium text-[#008C9D]">
          tiktik@pnj.ac.id
        </div>
      </div>
    </div>
  );
}

function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left font-bold text-gray-800 transition-colors hover:bg-gray-50"
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronUp size={20} className="text-gray-400" />
        ) : (
          <ChevronDown size={20} className="text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="border-t border-gray-100 bg-gray-50/50 p-4 pt-0">
          {children}
        </div>
      )}
    </div>
  );
}
