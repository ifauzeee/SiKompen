"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

interface Student {
  nim: string | null;
  name: string | null;
  prodi: string | null;
  kelas: string | null;
  totalHours: number;
}

interface Stats {
  totalStudents: number;
  studentsWithDebt: number;
  totalDebtHours: number;
  averageDebt: number;
}

export default function ReportClient({
  students,
  stats,
  kelasList,
}: {
  students: Student[];
  stats: Stats;
  kelasList: string[];
}) {
  const [selectedKelas, setSelectedKelas] = useState("");
  const [reportType, setReportType] = useState<"summary" | "detail">("summary");

  const filteredStudents = selectedKelas
    ? students.filter((s) => s.kelas === selectedKelas)
    : students;

  const generatePDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const now = new Date().toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });

    let tableRows = "";
    if (reportType === "detail") {
      tableRows = filteredStudents
        .map(
          (s, i) => `
                <tr>
                    <td>${i + 1}</td>
                    <td>${s.nim || "-"}</td>
                    <td>${s.name || "-"}</td>
                    <td>${s.kelas || "-"}</td>
                    <td class="${s.totalHours > 0 ? "debt" : ""}">${s.totalHours}</td>
                </tr>
            `,
        )
        .join("");
    }

    const kelasGroups: Record<
      string,
      { count: number; totalHours: number; withDebt: number }
    > = {};
    filteredStudents.forEach((s) => {
      const kelas = s.kelas || "Tidak ada kelas";
      if (!kelasGroups[kelas]) {
        kelasGroups[kelas] = { count: 0, totalHours: 0, withDebt: 0 };
      }
      kelasGroups[kelas].count++;
      kelasGroups[kelas].totalHours += s.totalHours;
      if (s.totalHours > 0) kelasGroups[kelas].withDebt++;
    });

    const summaryRows = Object.entries(kelasGroups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([kelas, data]) => `
                <tr>
                    <td>${kelas}</td>
                    <td>${data.count}</td>
                    <td class="debt">${data.withDebt}</td>
                    <td class="debt">${data.totalHours}</td>
                    <td>${data.count > 0 ? Math.round(data.totalHours / data.count) : 0}</td>
                </tr>
            `,
      )
      .join("");

    const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Laporan Kompensasi - SiKompen</title>
                <style>
                    @page { margin: 1.5cm; }
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        color: #333;
                        line-height: 1.6;
                    }
                    .header { 
                        text-align: center; 
                        border-bottom: 3px solid #008C9D;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .header h1 { 
                        margin: 0; 
                        color: #008C9D;
                        font-size: 24px;
                    }
                    .header h2 {
                        margin: 5px 0 0 0;
                        font-weight: normal;
                        color: #666;
                        font-size: 16px;
                    }
                    .header p { 
                        margin: 10px 0 0 0; 
                        font-size: 12px; 
                        color: #999; 
                    }
                    .stats {
                        display: flex;
                        justify-content: space-around;
                        margin-bottom: 30px;
                        padding: 20px;
                        background: #f8f9fa;
                        border-radius: 8px;
                    }
                    .stat-item {
                        text-align: center;
                    }
                    .stat-value {
                        font-size: 28px;
                        font-weight: bold;
                        color: #008C9D;
                    }
                    .stat-label {
                        font-size: 12px;
                        color: #666;
                        text-transform: uppercase;
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-top: 20px;
                        font-size: 12px;
                    }
                    th { 
                        background: #008C9D;  
                        color: white;
                        padding: 12px 8px;
                        text-align: left;
                        font-weight: 600;
                    }
                    td { 
                        padding: 10px 8px;
                        border-bottom: 1px solid #eee;
                    }
                    tr:hover { background: #f8f9fa; }
                    .debt { color: #dc3545; font-weight: bold; }
                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 1px solid #eee;
                        font-size: 11px;
                        color: #999;
                        text-align: center;
                    }
                    @media print {
                        .no-print { display: none; }
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>LAPORAN KOMPENSASI MAHASISWA</h1>
                    <h2>Sistem Informasi Kompensasi - Politeknik Negeri Jakarta</h2>
                    <p>Dicetak pada: ${now}${selectedKelas ? ` | Filter: ${selectedKelas}` : ""}</p>
                </div>

                <div class="stats">
                    <div class="stat-item">
                        <div class="stat-value">${filteredStudents.length}</div>
                        <div class="stat-label">Total Mahasiswa</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" style="color: #dc3545;">${filteredStudents.filter((s) => s.totalHours > 0).length}</div>
                        <div class="stat-label">Berhutang</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" style="color: #dc3545;">${filteredStudents.reduce((sum, s) => sum + s.totalHours, 0)}</div>
                        <div class="stat-label">Total Jam Hutang</div>
                    </div>
                </div>

                ${
                  reportType === "summary"
                    ? `
                    <h3>Ringkasan Per Kelas</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Kelas</th>
                                <th>Jumlah Mahasiswa</th>
                                <th>Berhutang</th>
                                <th>Total Jam</th>
                                <th>Rata-rata</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${summaryRows}
                        </tbody>
                    </table>
                `
                    : `
                    <h3>Detail Mahasiswa</h3>
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
                            ${tableRows}
                        </tbody>
                    </table>
                `
                }

                <div class="footer">
                    <p>Dokumen ini dihasilkan secara otomatis oleh SiKompen © ${new Date().getFullYear()}</p>
                </div>
            </body>
            </html>
        `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="mx-auto min-h-screen max-w-6xl space-y-8 px-4 pt-8 pb-12 sm:px-8">
      <header>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#008C9D]/10 px-3 py-1 text-xs font-bold tracking-wider text-[#008C9D] uppercase">
          <FileText size={14} />
          <span>Reporting</span>
        </div>
        <h1 className="mb-3 text-4xl font-black tracking-tight text-gray-900">
          Laporan Kompensasi
        </h1>
        <p className="max-w-2xl text-lg text-gray-500">
          Generate dan unduh rekapitulasi data kompensasi mahasiswa dalam format
          PDF untuk keperluan administrasi.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110">
            <Users size={24} />
          </div>
          <p className="mb-1 text-sm font-medium text-gray-500">
            Total Mahasiswa
          </p>
          <p className="text-3xl font-black text-gray-900">
            {stats.totalStudents}
          </p>
        </div>

        <div className="group rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition-transform group-hover:scale-110">
            <AlertTriangle size={24} />
          </div>
          <p className="mb-1 text-sm font-medium text-gray-500">Berhutang</p>
          <p className="text-3xl font-black text-red-600">
            {stats.studentsWithDebt}
          </p>
        </div>

        <div className="group rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition-transform group-hover:scale-110">
            <Clock size={24} />
          </div>
          <p className="mb-1 text-sm font-medium text-gray-500">
            Total Jam Hutang
          </p>
          <p className="text-3xl font-black text-green-900">
            {stats.totalDebtHours}
          </p>
        </div>

        <div className="group rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 transition-transform group-hover:scale-110">
            <TrendingUp size={24} />
          </div>
          <p className="mb-1 text-sm font-medium text-gray-500">
            Rata-rata Hutang
          </p>
          <p className="text-3xl font-black text-gray-900">
            {stats.averageDebt}{" "}
            <span className="text-sm font-normal text-gray-400">jam</span>
          </p>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-lg shadow-gray-100/50">
        <div className="mb-8">
          <h3 className="mb-2 text-xl font-bold text-gray-900">
            Konfigurasi Laporan
          </h3>
          <p className="text-gray-500">
            Sesuaikan filter dan jenis laporan yang ingin dicetak.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <label className="text-sm font-bold tracking-wide text-gray-700 uppercase">
              Jenis Laporan
            </label>
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-1.5">
              <button
                onClick={() => setReportType("summary")}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                  reportType === "summary"
                    ? "bg-white text-[#008C9D] shadow-sm ring-1 ring-gray-100"
                    : "text-gray-400 hover:bg-white/50 hover:text-gray-600"
                }`}
              >
                Ringkasan
              </button>
              <button
                onClick={() => setReportType("detail")}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                  reportType === "detail"
                    ? "bg-white text-[#008C9D] shadow-sm ring-1 ring-gray-100"
                    : "text-gray-400 hover:bg-white/50 hover:text-gray-600"
                }`}
              >
                Detail Mahasiswa
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold tracking-wide text-gray-700 uppercase">
              Filter Kelas
            </label>
            <div className="relative">
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="h-[54px] w-full cursor-pointer appearance-none rounded-2xl border border-gray-200 bg-white px-4 font-medium text-gray-900 transition-all outline-none focus:border-[#008C9D] focus:ring-4 focus:ring-[#008C9D]/10"
              >
                <option value="">Semua Kelas</option>
                {kelasList.sort().map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-400">
                <Users size={18} />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={generatePDF}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#008C9D] py-4 font-bold text-white shadow-lg shadow-[#008C9D]/25 transition-all hover:bg-[#007A8A] hover:shadow-xl hover:shadow-[#008C9D]/30 active:scale-[0.99]"
        >
          <Download size={20} />
          <span>Generate PDF Document</span>
        </button>
      </div>
    </div>
  );
}
