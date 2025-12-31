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

export default function EditHoursModal({ isOpen, onClose, student }: EditHoursModalProps) {
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
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                        <Clock size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Edit Jam Hutang</h2>
                        <p className="text-sm text-gray-500">{student.name} ({student.nim})</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">
                            Jam Hutang Saat Ini
                        </label>
                        <p className="text-3xl font-black text-red-600">{student.totalHours} Jam</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">
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
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl font-bold text-2xl text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2">
                            Alasan Perubahan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Contoh: Koreksi data dari admin akademik..."
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
