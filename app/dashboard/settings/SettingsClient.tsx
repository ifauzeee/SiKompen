"use client";

import { useState } from "react";
import { updateSystemSetting } from "@/app/actions/admin";
import Link from "next/link";
import {
  ArrowLeft,
  Settings,
  Save,
  Check,
  Calendar,
  AlertTriangle,
  CreditCard,
  Info,
} from "lucide-react";

interface Setting {
  key: string;
  value: string;
  description?: string | null;
}

export default function SettingsClient({ settings }: { settings: Setting[] }) {
  const [values, setValues] = useState<Record<string, string>>(
    settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {}),
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function handleSave(key: string) {
    setSaving(key);
    await updateSystemSetting(key, values[key]);
    setSaving(null);
    setSaved(key);
    setTimeout(() => setSaved(null), 2000);
  }

  const settingConfig: Record<
    string,
    { label: string; icon: React.ElementType; placeholder: string }
  > = {
    semester_aktif: {
      label: "Semester Aktif",
      icon: Calendar,
      placeholder: "Contoh: 2024/2025 Ganjil",
    },
    batas_jam_kompen: {
      label: "Batas Jam Kompen",
      icon: AlertTriangle,
      placeholder: "Contoh: 100",
    },
    bank_account: {
      label: "Rekening Pembayaran",
      icon: CreditCard,
      placeholder: "Nama Bank & No. Rekening",
    },
  };

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
            <Settings size={32} />
          </div>
          <div>
            <h1 className="mb-2 text-4xl font-black tracking-tight text-gray-900">
              Pengaturan Sistem
            </h1>
            <p className="text-lg font-medium text-gray-500">
              Konfigurasi global untuk aplikasi SiKompen.
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {settings.map((setting) => {
          const config = settingConfig[setting.key] || {
            label: setting.key,
            icon: Settings,
            placeholder: "",
          };
          const Icon = config.icon;

          return (
            <div
              key={setting.key}
              className="group rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/50 transition-all duration-300 hover:border-[#008C9D]/30"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-gray-50 p-3 text-gray-500 transition-colors group-hover:bg-[#008C9D]/10 group-hover:text-[#008C9D]">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {config.label}
                    </h3>
                    <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                      {setting.key.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="leading-relaxed font-medium text-gray-500">
                  {setting.description}
                </p>

                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={values[setting.key] || ""}
                      onChange={(e) =>
                        setValues({ ...values, [setting.key]: e.target.value })
                      }
                      placeholder={config.placeholder}
                      className="w-full rounded-2xl border-2 border-transparent bg-gray-50 px-5 py-4 font-bold text-gray-900 transition-all outline-none placeholder:text-gray-300 focus:border-[#008C9D]/20 focus:bg-white focus:shadow-lg focus:shadow-[#008C9D]/5"
                    />
                  </div>
                  <button
                    onClick={() => handleSave(setting.key)}
                    disabled={saving === setting.key}
                    className={`flex items-center justify-center rounded-2xl px-5 font-bold transition-all ${
                      saved === setting.key
                        ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                        : "bg-black text-white shadow-lg shadow-gray-200 hover:bg-gray-800"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {saving === setting.key ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : saved === setting.key ? (
                      <Check size={20} />
                    ) : (
                      <Save size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex max-w-3xl items-start gap-4 rounded-[2rem] border border-blue-100 bg-blue-50 p-6">
        <div className="mt-1 shrink-0 rounded-lg bg-blue-100 p-2 text-blue-600">
          <Info size={20} />
        </div>
        <div>
          <h4 className="mb-1 font-bold text-blue-900">Informasi Penting</h4>
          <p className="leading-relaxed font-medium text-blue-700">
            Setiap perubahan yang Anda lakukan akan langsung diterapkan ke
            seluruh sistem dan database secara <strong>real-time</strong>.
            Pastikan data yang Anda masukkan sudah benar.
          </p>
        </div>
      </div>
    </div>
  );
}
