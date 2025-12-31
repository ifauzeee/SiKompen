"use client";

import { useState } from "react";
import { updateSystemSetting } from "@/app/actions/admin";
import Link from "next/link";
import { ArrowLeft, Settings, Save, Check } from "lucide-react";

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

    const settingLabels: Record<string, string> = {
        'semester_aktif': 'Semester Aktif',
        'batas_jam_kompen': 'Batas Jam Kompen',
        'jam_per_sks': 'Jam per SKS',
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="border-b border-gray-200 bg-white sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                        <ArrowLeft size={24} />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#008C9D]/10 text-[#008C9D] rounded-xl">
                            <Settings size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Pengaturan Sistem</h1>
                            <p className="text-sm text-gray-500">Konfigurasi aplikasi SiKompen</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-8">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
                    {settings.map((setting) => (
                        <div key={setting.key} className="p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <label className="block font-bold text-gray-900 mb-1">
                                        {settingLabels[setting.key] || setting.key}
                                    </label>
                                    <p className="text-sm text-gray-500 mb-3">{setting.description}</p>
                                    <input
                                        type="text"
                                        value={values[setting.key] || ''}
                                        onChange={(e) => setValues({ ...values, [setting.key]: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl font-medium text-gray-900 focus:border-[#008C9D] focus:ring-2 focus:ring-[#008C9D]/20 outline-none"
                                    />
                                </div>
                                <button
                                    onClick={() => handleSave(setting.key)}
                                    disabled={saving === setting.key}
                                    className={`mt-8 p-3 rounded-xl transition-all ${saved === setting.key
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-[#008C9D]/10 text-[#008C9D] hover:bg-[#008C9D]/20'
                                        } disabled:opacity-50`}
                                >
                                    {saving === setting.key ? (
                                        <div className="w-5 h-5 border-2 border-[#008C9D]/30 border-t-[#008C9D] rounded-full animate-spin" />
                                    ) : saved === setting.key ? (
                                        <Check size={20} />
                                    ) : (
                                        <Save size={20} />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-center text-sm text-gray-400 mt-6">
                    Perubahan akan langsung tersimpan ke database.
                </p>
            </div>
        </div>
    );
}
