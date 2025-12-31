import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { AlertCircle, CheckCircle, FileText } from "lucide-react";
export const dynamic = 'force-dynamic';

export default async function ClearancePage() {
    const userSession = await getSessionUser();
    if (!userSession) redirect('/login');

    const user = await prisma.user.findUnique({ where: { id: userSession.id } });
    if (!user) return null;

    const isEligible = user.totalHours <= 0;

    return (
        <div className="pt-8 px-4 max-w-3xl mx-auto pb-12">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Bebas Kompen</h1>
            <p className="text-gray-500 mb-8">Ajukan surat keterangan bebas kompensasi jika syarat terpenuhi.</p>

            <div className={`p-8 rounded-3xl border-2 ${isEligible ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'} text-center`}>
                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 ${isEligible ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {isEligible ? <CheckCircle size={40} /> : <AlertCircle size={40} />}
                </div>

                <h2 className={`text-2xl font-bold mb-2 ${isEligible ? 'text-green-800' : 'text-red-800'}`}>
                    {isEligible ? "Anda Memenuhi Syarat!" : "Belum Memenuhi Syarat"}
                </h2>

                <p className={`mb-8 ${isEligible ? 'text-green-600' : 'text-red-600'}`}>
                    {isEligible
                        ? "Selamat! Anda tidak memiliki tunggakan jam kompen. Anda dapat mengajukan surat bebas kompen sekarang."
                        : `Anda masih memiliki tunggakan sebanyak ${user.totalHours} Jam Kompen. Silakan selesaikan tugas terlebih dahulu.`
                    }
                </p>

                {isEligible ? (
                    <button className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30 flex items-center gap-2 mx-auto">
                        <FileText />
                        Unduh Surat Keterangan
                    </button>
                ) : (
                    <div className="bg-white/50 p-4 rounded-xl inline-block text-red-700 font-medium text-sm">
                        Selesaikan tugas yang tersedia di menu Pekerjaan.
                    </div>
                )}
            </div>
        </div>
    );
}
