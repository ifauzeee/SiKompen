import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import ClearanceClient from "./ClearanceClient";

export const dynamic = 'force-dynamic';

export default async function ClearancePage() {
    const userSession = await getSessionUser();
    if (!userSession) redirect('/login');

    const user = await prisma.user.findUnique({ where: { id: userSession.id } });
    if (!user) return null;

    const bankSetting = await prisma.systemSettings.findUnique({ where: { key: 'bank_account' } });
    const bankInfo = bankSetting?.value || 'BNI 1234567890 a.n. Politeknik Negeri Jakarta';

    return <ClearanceClient
        currentDebt={user.totalHours}
        userId={user.id}
        bankInfo={bankInfo}
        isLibraryClear={user.isLibraryClear}
        isAdminClear={user.isAdminClear}
        userData={{
            name: user.name || '-',
            nim: user.nim || '-',
            prodi: user.prodi || 'Teknik Informatika',
            kelas: user.kelas || '-'
        }}
    />;
}
