"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, Users, AlertCircle } from "lucide-react";
import { createJob } from "@/app/actions/jobs";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="ml-auto flex items-center justify-center gap-3 rounded-xl bg-gray-900 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? (
        <>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Memproses...
        </>
      ) : (
        "Terbitkan Pekerjaan"
      )}
    </button>
  );
}

export default function CreateJobPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function clientAction(formData: FormData) {
    setError("");
    const result = await createJob(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-6">
            <h2 className="text-4xl leading-tight font-black text-gray-900">
              Informasi
              <br />
              Pekerjaan
            </h2>
          </div>

          <div className="lg:col-span-2">
            {error && (
              <div className="animate-in fade-in slide-in-from-top-2 mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-600">
                <AlertCircle className="mt-0.5 shrink-0" size={20} />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form action={clientAction} className="space-y-8">
              <div className="space-y-2">
                <label className="ml-1 text-sm font-bold tracking-wider text-gray-500 uppercase">
                  Nama Pekerjaan
                </label>
                <input
                  name="title"
                  placeholder="Misal: Teknisi Jaringan Lab TIK"
                  required
                  className="w-full border-b-2 border-gray-200 bg-transparent px-0 py-4 text-2xl font-bold text-gray-900 transition-all outline-none placeholder:text-gray-300 focus:border-gray-900"
                />
              </div>

              <div className="space-y-2 pt-4">
                <label className="ml-1 text-sm font-bold tracking-wider text-gray-500 uppercase">
                  Deskripsi Detail
                </label>
                <textarea
                  name="description"
                  placeholder="Deskripsikan tanggung jawab, lokasi kerja, dan persyaratan khusus..."
                  required
                  rows={6}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-6 py-4 text-lg leading-relaxed text-gray-900 transition-all outline-none placeholder:text-gray-400 focus:border-[#008C9D] focus:ring-4 focus:ring-[#008C9D]/10"
                />
              </div>

              <div className="grid grid-cols-1 gap-8 pt-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold tracking-wider text-gray-500 uppercase">
                    <Clock size={16} />
                    Total Jam Kompen
                  </label>
                  <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-all focus-within:border-[#008C9D] focus-within:ring-4 focus-within:ring-[#008C9D]/10">
                    <input
                      type="number"
                      name="hours"
                      placeholder="0"
                      required
                      min="1"
                      className="w-full bg-transparent text-right text-3xl font-black text-gray-900 outline-none"
                    />
                    <span className="pr-2 font-bold text-gray-400">Jam</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold tracking-wider text-gray-500 uppercase">
                    <Users size={16} />
                    Kuota Penerimaan
                  </label>
                  <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-all focus-within:border-[#008C9D] focus-within:ring-4 focus-within:ring-[#008C9D]/10">
                    <input
                      type="number"
                      name="quota"
                      placeholder="0"
                      required
                      min="1"
                      className="w-full bg-transparent text-right text-3xl font-black text-gray-900 outline-none"
                    />
                    <span className="pr-2 font-bold text-gray-400">Orang</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-8">
                <Link
                  href="/dashboard"
                  className="font-bold text-gray-500 transition-colors hover:text-gray-900"
                >
                  Batal
                </Link>
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
