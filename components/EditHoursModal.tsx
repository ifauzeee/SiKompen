"use client";

import { useState, useEffect } from "react";
import { updateStudentHours } from "@/app/actions/admin";
import { X, Clock, AlertCircle } from "lucide-react";

interface EditHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    id: number;
    name: string | null;
    nim: string | null;
    totalHours: number;
  } | null;
}

export default function EditHoursModal({
  isOpen,
  onClose,
  student,
}: EditHoursModalProps) {
  const [hours, setHours] = useState<number | string>(student?.totalHours || 0);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (student) {
      setHours(student.totalHours);
      setReason("");
      setError("");
    }
  }, [student]);

  if (!isOpen || !student) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!student) return;
    if (!reason.trim()) {
      setError("Alasan perubahan wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");

    const finalHours = hours === "" ? 0 : Number(hours);
    const result = await updateStudentHours(student.id, finalHours, reason);

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      onClose();
      window.location.reload();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative mx-4 w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 transition-colors hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
            <Clock size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Jam Hutang</h2>
            <p className="text-sm text-gray-500">
              {student.name} ({student.nim})
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-500">
              Jam Hutang Saat Ini
            </label>
            <p className="text-3xl font-black text-red-600">
              {student.totalHours} Jam
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-500">
              Jam Hutang Baru
            </label>
            <input
              type="number"
              min="0"
              value={hours}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") setHours("");
                else setHours(parseInt(val));
              }}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-2xl font-bold text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-500">
              Alasan Perubahan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Koreksi data dari admin akademik..."
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-3 font-bold text-gray-600 transition-colors hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-orange-500 py-3 font-bold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
