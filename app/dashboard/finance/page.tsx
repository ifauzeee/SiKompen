import { prisma } from "@/lib/prisma";
import FinanceDashboardClient from "./FinanceDashboardClient";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/app/actions/auth";

export default async function FinancePage() {
    const user = await getSessionUser();

    if (!user || (user.role !== 'KEUANGAN' && user.role !== 'ADMIN')) {
        redirect('/dashboard');
    }

    const totalIncome = await (prisma as any).payment.aggregate({
        _sum: { amount: true },
        where: { status: 'APPROVED' }
    }).then((res: any) => res._sum.amount || 0);

    const pendingIncome = await (prisma as any).payment.aggregate({
        _sum: { amount: true },
        where: { status: 'PENDING' }
    }).then((res: any) => res._sum.amount || 0);

    const totalDebtors = await prisma.user.count({
        where: { role: 'MAHASISWA', totalHours: { gt: 0 } }
    });

    const totalOutstandingHours = await prisma.user.aggregate({
        _sum: { totalHours: true },
        where: { role: 'MAHASISWA' }
    }).then(res => res._sum.totalHours || 0);

    const payments = await (prisma as any).payment.findMany({
        where: { status: 'PENDING' },
        include: {
            user: { select: { name: true, nim: true, totalHours: true, kelas: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    const history = await (prisma as any).payment.findMany({
        where: { status: { not: 'PENDING' } },
        take: 10,
        include: {
            user: { select: { name: true, nim: true } }
        },
        orderBy: { updatedAt: 'desc' }
    });

    const debtors = await prisma.user.findMany({
        where: { role: 'MAHASISWA', totalHours: { gt: 0 } },
        orderBy: { totalHours: 'desc' },
        take: 10,
        select: { id: true, name: true, nim: true, totalHours: true, kelas: true }
    });

    return (
        <FinanceDashboardClient
            payments={payments}
            stats={{ totalIncome, pendingIncome, totalDebtors, totalOutstandingHours }}
            history={history}
            debtors={debtors}
        />
    );
}
