"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "./auth";
import { revalidatePath } from "next/cache";

export async function getApplicationsByStatus(status: 'PENDING' | 'ACCEPTED' | 'VERIFYING' = 'PENDING', supervisorId?: number) {
    const user = await getSessionUser();
    if (!user || !['ADMIN', 'PENGAWAS'].includes(user.role)) return [];

    if (user.role === 'PENGAWAS') {
        supervisorId = user.id;
    }

    const whereClause: Prisma.JobApplicationWhereInput = { status };

    if (supervisorId) {
        whereClause.job = { createdById: supervisorId };
    }

    try {
        const apps = await prisma.jobApplication.findMany({
            where: whereClause,
            include: {
                user: { select: { name: true, nim: true, totalHours: true } },
                job: { select: { title: true, hours: true } }
            },
            orderBy: { appliedAt: 'desc' },
            take: 20
        });
        return apps;
    } catch {
        return [];
    }
}

export async function submitJobProof(appId: number, proof1: string, proof2: string, note: string) {
    const user = await getSessionUser();
    if (!user) return { error: "Unauthorized" };

    try {
        const app = await prisma.jobApplication.findUnique({
            where: { id: appId },
            include: { user: true }
        });

        if (!app) return { error: "Lamaran tidak ditemukan" };
        if (app.userId !== user.id) return { error: "Unauthorized" };
        if (app.status !== 'ACCEPTED') return { error: "Hanya lamaran yang diterima yang bisa dikirim bukti." };

        await prisma.jobApplication.update({
            where: { id: appId },
            data: {
                proofImage1: proof1,
                proofImage2: proof2,
                submissionNote: note,
                status: 'VERIFYING'
            }
        });

        await prisma.activityLog.create({
            data: {
                userId: user.id,
                action: "SUBMIT_PROOF",
                targetType: 'APPLICATION',
                targetId: appId,
                details: `Mengirim bukti pengerjaan.`
            }
        });

        revalidatePath('/dashboard/my-applications');
        revalidatePath('/dashboard/my-jobs');
        return { success: true };
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Gagal mengirim bukti.";
        return { error: message };
    }
}

export async function updateApplicationStatus(appId: number, status: 'ACCEPTED' | 'COMPLETED' | 'REJECTED') {
    const user = await getSessionUser();
    if (!user || !['ADMIN', 'PENGAWAS'].includes(user.role)) return { error: 'Unauthorized' };

    try {
        await prisma.$transaction(async (tx) => {
            const app = await tx.jobApplication.findUnique({
                where: { id: appId },
                include: { job: true, user: true }
            });

            if (!app) throw new Error('Application not found');

            if (user.role === 'PENGAWAS' && app.job.createdById !== user.id) {
                throw new Error('Unauthorized: Anda tidak memiliki akses ke lamaran ini.');
            }

            if (status === 'ACCEPTED') {
                if (app.status !== 'PENDING') throw new Error('Hanya aplikasi PENDING yang bisa di-ACCEPT.');
                if (app.job.quota <= 0) throw new Error('Kuota pekerjaan sudah penuh.');

                const updatedJob = await tx.job.update({
                    where: { id: app.job.id },
                    data: { quota: { decrement: 1 } }
                });

                if (updatedJob.quota <= 0) {
                    await tx.job.update({
                        where: { id: app.job.id },
                        data: { status: 'CLOSED' }
                    });
                }

                await tx.jobApplication.update({
                    where: { id: appId },
                    data: { status: 'ACCEPTED' }
                });
            }

            else if (status === 'COMPLETED') {
                if (!['ACCEPTED', 'VERIFYING'].includes(app.status)) {
                    throw new Error('Hanya aplikasi ACCEPTED/VERIFYING yang bisa di-COMPLETE.');
                }

                const hoursToDeduct = app.job.hours;
                const currentDebt = app.user.totalHours;
                const newDebt = Math.max(0, currentDebt - hoursToDeduct);

                await tx.user.update({
                    where: { id: app.user.id },
                    data: { totalHours: newDebt }
                });

                if (newDebt <= 0 && currentDebt > 0) {
                    const existingClearance = await tx.clearanceRequest.findFirst({
                        where: { userId: app.user.id }
                    });
                    if (!existingClearance) {
                        await tx.clearanceRequest.create({
                            data: { userId: app.user.id, status: 'PENDING' }
                        });
                    }
                }

                await tx.jobApplication.update({
                    where: { id: appId },
                    data: { status: 'COMPLETED' }
                });
            }

            else if (status === 'REJECTED') {
                if (app.status === 'ACCEPTED' || app.status === 'VERIFYING') {
                    await tx.job.update({
                        where: { id: app.job.id },
                        data: {
                            quota: { increment: 1 },
                            status: 'OPEN'
                        }
                    });
                }

                await tx.jobApplication.update({
                    where: { id: appId },
                    data: { status: 'REJECTED' }
                });
            }

            await tx.activityLog.create({
                data: {
                    userId: user.id,
                    action: status,
                    targetType: 'APPLICATION',
                    targetId: appId,
                    details: JSON.stringify({
                        studentName: app.user.name,
                        jobTitle: app.job.title,
                        statusFrom: app.status,
                        statusTo: status
                    })
                }
            });
        });

        revalidatePath('/dashboard');
        revalidatePath('/jobs');
        revalidatePath('/dashboard/my-jobs');
        revalidatePath('/my-applications');
        return { success: true };
    } catch (e: unknown) {
        console.error(e);
        const message = e instanceof Error ? e.message : 'Gagal memproses validasi.';
        return { error: message };
    }
}

export async function applyForJob(jobId: number) {
    const user = await getSessionUser();

    if (!user) {
        return { error: "Anda harus login untuk melamar." };
    }

    if (user.role !== 'MAHASISWA') {
        return { error: "Hanya mahasiswa yang bisa melamar pekerjaan." };
    }

    if (user.totalHours <= 0) {
        return { error: "Anda tidak memiliki tanggungan jam kompen (Sisa: 0 Jam). Tidak perlu melamar." };
    }

    try {
        await prisma.$transaction(async (tx) => {
            const job = await tx.job.findUnique({
                where: { id: jobId }
            });

            if (!job) {
                throw new Error("Pekerjaan tidak ditemukan.");
            }

            if (job.status !== 'OPEN' || job.quota <= 0) {
                throw new Error("Lowongan ini sudah ditutup atau penuh.");
            }

            const existingApp = await tx.jobApplication.findFirst({
                where: {
                    jobId: jobId,
                    userId: user.id
                }
            });

            if (existingApp) {
                throw new Error("Anda sudah melamar pekerjaan ini.");
            }



            const activeAppsCount = await tx.jobApplication.count({
                where: {
                    userId: user.id,
                    status: 'PENDING'
                }
            });

            if (activeAppsCount >= 3) {
                throw new Error("Anda sudah memiliki 3 lamaran aktif. Tunggu proses validasi sebelum melamar lagi.");
            }

            await tx.jobApplication.create({
                data: {
                    jobId,
                    userId: user.id,
                    status: 'PENDING',
                    appliedAt: new Date()
                }
            });


        });

        revalidatePath('/jobs');
        revalidatePath('/dashboard');

        return { success: true };
    } catch (e: unknown) {
        console.error("Apply Job Error:", e);
        const message = e instanceof Error ? e.message : "Terjadi kesalahan saat mengirim lamaran.";
        return { error: message };
    }
}