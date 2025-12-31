"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/session";

const CreatePaymentSchema = z.object({
    userId: z.number(),
    amount: z.number().positive("Jumlah pembayaran harus positif"),
    hoursEquivalent: z.number().int().nonnegative("Jam kompensasi tidak boleh negatif"),
    proofUrl: z.string().url("URL bukti pembayaran tidak valid"),
    note: z.string().optional()
});

export async function createPayment(userId: number, amount: number, hoursEquivalent: number, proofUrl: string, note?: string) {
    const session = await getSession();
    if (!session) return { error: "Unauthorized" };

    if (session.userId !== userId && session.role !== 'ADMIN' && session.role !== 'KEUANGAN') {
        return { error: "Unauthorized: Anda tidak dapat membuat pembayaran untuk user lain." };
    }

    const validation = CreatePaymentSchema.safeParse({ userId, amount, hoursEquivalent, proofUrl, note });
    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors.amount?.[0] || "Data tidak valid" };
    }

    try {
        await prisma.payment.create({
            data: {
                userId,
                amount,
                hoursEquivalent,
                proofUrl,
                note,
                status: 'PENDING'
            }
        });

        await prisma.activityLog.create({
            data: {
                userId: session.userId,
                action: "CREATE_PAYMENT",
                targetType: "PAYMENT",
                details: `Payment of Rp ${amount} for User ${userId}`
            }
        });

        revalidatePath('/dashboard/finance');
        return { success: true };
    } catch (error) {
        return { error: "Gagal membuat pembayaran" };
    }
}

export async function verifyPayment(paymentId: number, status: 'APPROVED' | 'REJECTED') {
    const session = await getSession();
    if (!session) return { error: "Unauthorized" };

    const ALLOWED_ROLES = ['ADMIN', 'KEUANGAN'];
    if (!ALLOWED_ROLES.includes(session.role)) {
        console.error(`Security Alert: Unauthorized payment verification attempt by User ${session.userId}`);
        return { error: "Access Denied: Requires KEUANGAN or ADMIN role." };
    }

    try {
        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: { user: true }
        });

        if (!payment) return { error: "Payment not found" };

        if (status === 'APPROVED') {
            const currentHours = payment.user.totalHours;
            const newHours = Math.max(0, currentHours - payment.hoursEquivalent);

            await prisma.$transaction([
                prisma.payment.update({
                    where: { id: paymentId },
                    data: { status: 'APPROVED' }
                }),
                prisma.user.update({
                    where: { id: payment.userId },
                    data: { totalHours: newHours }
                }),
                prisma.activityLog.create({
                    data: {
                        userId: session.userId,
                        action: "PAYMENT_APPROVED",
                        targetType: "PAYMENT",
                        targetId: paymentId,
                        details: `Approved by ${session.username}. Paid off ${payment.hoursEquivalent} hours.`
                    }
                })
            ]);
        } else {
            await prisma.$transaction([
                prisma.payment.update({
                    where: { id: paymentId },
                    data: { status: 'REJECTED' }
                }),
                prisma.activityLog.create({
                    data: {
                        userId: session.userId,
                        action: "PAYMENT_REJECTED",
                        targetType: "PAYMENT",
                        targetId: paymentId,
                        details: `Rejected by ${session.username}.`
                    }
                })
            ]);
        }

        revalidatePath('/dashboard/finance');
        return { success: true };
    } catch (error) {
        return { error: "Gagal memverifikasi pembayaran" };
    }
}
