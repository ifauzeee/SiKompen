'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { hashPassword, verifyPassword, needsRehash } from '@/lib/password'
import { createSession, deleteSession, getSession } from '@/lib/session'
import { User } from '@prisma/client'

const LoginSchema = z.object({
    username: z.string().min(1, "Username wajib diisi"),
    password: z.string().min(1, "Password wajib diisi"),
})

const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6, "Password baru minimal 6 karakter")
})

export async function login(formData: FormData) {
    const rawData = {
        username: formData.get('username'),
        password: formData.get('password'),
    }

    const validatedFields = LoginSchema.safeParse(rawData)

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        return { error: errors.username?.[0] || errors.password?.[0] || "Input tidak valid" }
    }

    const { username, password } = validatedFields.data

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { username: username },
                { nim: username }
            ]
        }
    })

    if (!user) {
        return { error: 'Username atau password salah.' }
    }

    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
        return { error: 'Username atau password salah.' }
    }

    if (needsRehash(user.password)) {
        const newHash = await hashPassword(password)
        await prisma.user.update({
            where: { id: user.id },
            data: { password: newHash }
        })
    }

    await createSession({
        userId: user.id,
        role: user.role,
        username: user.username
    })

    redirect('/dashboard')
}

export async function logout() {
    await deleteSession()
    redirect('/login')
}

export async function getSessionUser() {
    const session = await getSession()
    if (!session) return null

    const user = await prisma.user.findUnique({
        where: { id: session.userId }
    })

    if (!user) return null;

    const { password: _password, ...safeUser } = user;
    return safeUser as unknown as User;
}

export async function changePassword(currentPassword: string, newPassword: string) {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return { error: 'Unauthorized' };

    const validated = ChangePasswordSchema.safeParse({ currentPassword, newPassword });
    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors.newPassword?.[0] || "Input tidak valid" };
    }

    const isValid = await verifyPassword(currentPassword, user.password);
    if (!isValid) {
        return { error: 'Password lama salah.' };
    }

    try {
        const hashedPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        await prisma.activityLog.create({
            data: {
                userId: user.id,
                action: 'CHANGE_PASSWORD',
                targetType: 'USER',
                targetId: user.id,
                details: JSON.stringify({ username: user.username })
            }
        });

        return { success: true };
    } catch {
        return { error: 'Gagal mengubah password.' };
    }
}
