"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "./auth";
import { revalidatePath } from "next/cache";

export async function createJob(formData: FormData) {
    const user = await getSessionUser();

    if (!user || !['ADMIN', 'PENGAWAS'].includes(user.role)) {
        return { error: 'Unauthorized. Access required.' };
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const hours = parseInt(formData.get('hours') as string);
    const quota = parseInt(formData.get('quota') as string);

    if (!title || !description || !hours || !quota) {
        return { error: 'Semua kolom wajib diisi.' };
    }

    try {
        await prisma.job.create({
            data: {
                title,
                description,
                hours,
                quota,
                category: 'UMUM',
                status: 'OPEN',
                createdById: user.id
            }
        });

        revalidatePath('/dashboard');
        revalidatePath('/jobs');
        return { success: true };
    } catch (e) {
        console.error('Create Job Error:', e);
        return { error: 'Gagal membuat pekerjaan.' };
    }
}

export async function deleteJob(jobId: number) {
    const user = await getSessionUser();
    if (!user || !['ADMIN', 'PENGAWAS'].includes(user.role)) return { error: 'Unauthorized' };

    try {
        await prisma.$transaction(async (tx) => {
            await tx.jobApplication.deleteMany({
                where: { jobId }
            });

            await tx.job.delete({ where: { id: jobId } });
        });

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/my-jobs');
        return { success: true };
    } catch (error) {
        console.error('Delete Job Error:', error);
        return { error: 'Gagal menghapus data.' };
    }
}

export async function updateJob(id: number, formData: FormData) {
    const user = await getSessionUser();
    if (!user || !['ADMIN', 'PENGAWAS'].includes(user.role)) {
        return { error: 'Unauthorized' };
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const hours = parseInt(formData.get('hours') as string);
    const quota = parseInt(formData.get('quota') as string);

    if (!title || !description || !hours || !quota) {
        return { error: 'Semua kolom wajib diisi.' };
    }

    try {
        const existingJob = await prisma.job.findUnique({
            where: { id },
            include: { _count: { select: { applications: true } } }
        });

        if (existingJob && existingJob._count.applications > 0 && existingJob.hours !== hours) {
            return { error: 'Tidak dapat mengubah jam kompen karena sudah ada pelamar. Silahkan tolak pelamar terlebih dahulu atau buat lowongan baru.' };
        }

        await prisma.job.update({
            where: { id },
            data: {
                title, description, hours, quota
            }
        });
        revalidatePath('/dashboard/my-jobs');
        revalidatePath('/jobs');
        return { success: true };
    } catch {
        return { error: 'Gagal mengupdate pekerjaan.' };
    }
}

export async function toggleJobStatus(jobId: number, currentStatus: string) {
    const user = await getSessionUser();
    if (!user || !['ADMIN', 'PENGAWAS'].includes(user.role)) return { error: 'Unauthorized' };

    try {
        const newStatus = currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN';

        await prisma.job.update({
            where: { id: jobId },
            data: { status: newStatus }
        });

        revalidatePath('/dashboard/my-jobs');
        revalidatePath('/jobs');
        return { success: true, newStatus };
    } catch {
        return { error: 'Gagal mengubah status.' };
    }
}
