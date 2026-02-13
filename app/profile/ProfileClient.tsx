"use client";

import { useState } from "react";
import { changePassword } from "@/app/actions/auth";
import { Lock, Check, AlertCircle } from "lucide-react";

export default function ProfileClient() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Password baru tidak cocok.");
      return;
    }

    setLoading(true);
    const result = await changePassword(currentPassword, newPassword);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-[1600px] space-y-8 px-4 pt-8 pb-12 sm:px-8">
      <header className="mb-4 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="mb-2 text-3xl font-black tracking-tight text-gray-900 dark:text-white md:text-5xl">
            Profil Saya
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 md:text-lg">
            Kelola informasi akun dan keamanan Anda.
          </p>
        </div>
      </header>

      <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-[#0d1117] dark:shadow-none md:rounded-[2.5rem] md:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
          <Lock className="text-[#008C9D]" size={24} />
          Ubah Password
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-6">
          {error && (
            <div className="animate-in fade-in slide-in-from-top-2 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="animate-in fade-in slide-in-from-top-2 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-600">
              <Check size={18} className="shrink-0" />
              Password berhasil diubah!
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                Password Lama
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="Masukkan password saat ini"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all outline-none placeholder:text-gray-400 focus:border-[#008C9D] focus:bg-white focus:ring-4 focus:ring-[#008C9D]/10 dark:border-white/5 dark:bg-white/5 dark:text-white dark:focus:bg-[#0d1117] md:text-base text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                Password Baru
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Minimal 6 karakter"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all outline-none placeholder:text-gray-400 focus:border-[#008C9D] focus:bg-white focus:ring-4 focus:ring-[#008C9D]/10 dark:border-white/5 dark:bg-white/5 dark:text-white dark:focus:bg-[#0d1117] md:text-base text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                Konfirmasi Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Ulangi password baru"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all outline-none placeholder:text-gray-400 focus:border-[#008C9D] focus:bg-white focus:ring-4 focus:ring-[#008C9D]/10 dark:border-white/5 dark:bg-white/5 dark:text-white dark:focus:bg-[#0d1117] md:text-base text-gray-900"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#008C9D] px-8 py-3 text-sm font-bold text-white transition-all hover:bg-[#007A8A] hover:shadow-lg hover:shadow-[#008C9D]/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 md:w-auto md:text-base"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
