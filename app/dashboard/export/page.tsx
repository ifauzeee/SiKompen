import { getSessionUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import ExportClient from "./ExportClient";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function ExportPage() {
    const user = await getSessionUser();

    if (!user || user.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    const students = await prisma.user.findMany({
        where: { role: 'MAHASISWA' },
        select: { prodi: true, kelas: true }
    });

    const prodis = [...new Set(students.map(s => s.prodi).filter(Boolean))] as string[];
    const kelasList = [...new Set(students.map(s => s.kelas).filter(Boolean))] as string[];

    return <ExportClient prodis={prodis} kelasList={kelasList} />;
}
