"use client";

import { useState } from "react";
import { updateSystemSetting } from "@/app/actions/admin";
import Link from "next/link";
import { ArrowLeft, Settings, Save, Check, Calendar, AlertTriangle, CreditCard, Info } from "lucide-react";

interface Setting {
    key: string;
    value: string;
    description?: string | null;
}

export default function SettingsClient({ settings }: { settings: Setting[] }) {
    const [values, setValues] = useState<Record<string, string>>(
        settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {})
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

    const settingConfig: Record<string, { label: string, icon: any, placeholder: string }> = {
        'semester_aktif': {
            label: 'Semester Aktif',
            icon: Calendar,
            placeholder: 'Contoh: 2024/2025 Ganjil'
        },
        'batas_jam_kompen': {
            label: 'Batas Jam Kompen',
            icon: AlertTriangle,
            placeholder: 'Contoh: 100'
        },
        'bank_account': {
            label: 'Rekening Pembayaran',
            icon: CreditCard,
            placeholder: 'Nama Bank & No. Rekening'
        },
    };

    return (
        <div className="pt-8 px-4 sm:px-8 max-w-[1600px] mx-auto min-h-screen pb-12 space-y-8">
            <header>
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors mb-6 font-medium group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Kembali ke Dashboard
                </Link>
                <div className="flex items-start gap-4">
                    <div className="p-4 bg-[#008C9D]/10 text-[#008C9D] rounded-2xl">
                        <Settings size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                            Pengaturan Sistem
                        </h1>
                        <p className="text-gray-500 text-lg font-medium">
                            Konfigurasi global untuk aplikasi SiKompen.
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {settings.map((setting) => {
                    const config = settingConfig[setting.key] || { label: setting.key, icon: Settings, placeholder: '' };
                    const Icon = config.icon;

                    return (
                        <div key={setting.key} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 group hover:border-[#008C9D]/30 transition-all duration-300">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gray-50 text-gray-500 rounded-2xl group-hover:bg-[#008C9D]/10 group-hover:text-[#008C9D] transition-colors">
                                        <Icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{config.label}</h3>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{setting.key.replace(/_/g, ' ')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    {setting.description}
                                </p>

                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={values[setting.key] || ''}
                                            onChange={(e) => setValues({ ...values, [setting.key]: e.target.value })}
                                            placeholder={config.placeholder}
                                            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-[#008C9D]/20 focus:shadow-lg focus:shadow-[#008C9D]/5 outline-none transition-all placeholder:text-gray-300"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleSave(setting.key)}
                                        disabled={saving === setting.key}
                                        className={`px-5 rounded-2xl font-bold transition-all flex items-center justify-center
                                            ${saved === setting.key
                                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                                : 'bg-black text-white hover:bg-gray-800 shadow-lg shadow-gray-200'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {saving === setting.key ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

            <div className="mt-12 p-6 bg-blue-50 rounded-[2rem] border border-blue-100 flex gap-4 items-start max-w-3xl">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mt-1 shrink-0">
                    <Info size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-blue-900 mb-1">Informasi Penting</h4>
                    <p className="text-blue-700 leading-relaxed font-medium">
                        Setiap perubahan yang Anda lakukan akan langsung diterapkan ke seluruh sistem dan database secara <strong>real-time</strong>. Pastikan data yang Anda masukkan sudah benar.
                    </p>
                </div>
            </div>
        </div>
    );
}
