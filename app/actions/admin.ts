"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "./auth";
import { revalidatePath } from "next/cache";

export async function updateStudentHours(studentId: number, newHours: number, reason: string) {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
        return { error: 'Unauthorized. Admin access required.' };
    }

    try {
        const student = await prisma.user.findUnique({ where: { id: studentId } });
        if (!student) return { error: 'Mahasiswa tidak ditemukan.' };

        const oldHours = student.totalHours;

        await prisma.user.update({
            where: { id: studentId },
            data: { totalHours: Math.max(0, newHours) }
        });

        await prisma.activityLog.create({
            data: {
                userId: user.id,
                action: 'UPDATE_HOURS',
                targetType: 'USER',
                targetId: studentId,
                details: JSON.stringify({
                    studentName: student.name,
                    oldHours,
                    newHours,
                    reason
                })
            }
        });

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/users');
        return { success: true };
    } catch (e: unknown) {
        console.error(e);
        return { error: 'Gagal mengupdate jam hutang.' };
    }
}

export async function getActivityLogs(limit: number = 50) {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') return [];

    try {
        const logs = await prisma.activityLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit
        });
        return logs;
    } catch {
        return [];
    }
}

export async function getSystemSettings() {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') return [];

    try {
        return await prisma.systemSettings.findMany();
    } catch {
        return [];
    }
}

export async function updateSystemSetting(key: string, value: string) {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
        return { error: 'Unauthorized' };
    }

    try {
        await prisma.systemSettings.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        });

        await prisma.activityLog.create({
            data: {
                userId: user.id,
                action: 'UPDATE_SETTINGS',
                targetType: 'SYSTEM',
                details: JSON.stringify({ key, value })
            }
        });

        revalidatePath('/dashboard/settings');
        return { success: true };
    } catch (e: unknown) {
        console.error(e);
        return { error: 'Gagal menyimpan pengaturan.' };
    }
}

export async function importStudents(data: { nim: string; name: string; prodi: string; kelas: string }[]) {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
        return { error: 'Unauthorized' };
    }

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const student of data) {
        if (!student.nim || !student.name) {
            skipCount++;
            continue;
        }

        try {
            const existing = await prisma.user.findUnique({
                where: { username: student.nim }
            });

            if (existing) {
                skipCount++;
                continue;
            }

            await prisma.user.create({
                data: {
                    username: student.nim,
                    nim: student.nim,
                    name: student.name,
                    prodi: student.prodi,
                    kelas: student.kelas,
                    password: student.nim,
                    role: 'MAHASISWA',
                    totalHours: 0
                }
            });
            successCount++;
        } catch {
            errorCount++;
        }
    }

    await prisma.activityLog.create({
        data: {
            userId: user.id,
            action: 'IMPORT_STUDENTS',
            targetType: 'USER',
            details: JSON.stringify({ successCount, skipCount, errorCount })
        }
    });

    revalidatePath('/dashboard/users');
    return { success: true, successCount, skipCount, errorCount };
}

export async function getStudentsForExport(filters?: { prodi?: string; kelas?: string; hasDebt?: boolean }) {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') return [];

    try {
        const where: Record<string, unknown> = { role: 'MAHASISWA' };

        if (filters?.prodi) where.prodi = filters.prodi;
        if (filters?.kelas) where.kelas = filters.kelas;
        if (filters?.hasDebt) where.totalHours = { gt: 0 };

        const students = await prisma.user.findMany({
            where,
            select: {
                nim: true,
                name: true,
                prodi: true,
                kelas: true,
                totalHours: true
            },
            orderBy: [{ kelas: 'asc' }, { name: 'asc' }]
        });

        return students;
    } catch {
        return [];
    }
}
