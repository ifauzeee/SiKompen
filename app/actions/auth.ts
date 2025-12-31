'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const username = (formData.get('username') as string).trim()
    const password = (formData.get('password') as string).trim()

    if (!username || !password) {
        return { error: 'Username dan password wajib diisi.' }
    }

    const user = await prisma.user.findUnique({
        where: { username },
    })

    if (!user || user.password !== password) {
        return { error: 'Username atau password salah.' }
    }

    const cookieStore = await cookies()
    cookieStore.set('session_userId', user.id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    })

    redirect('/dashboard')
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('session_userId')
    redirect('/login')
}

export async function getSessionUser() {
    const cookieStore = await cookies()
    const userId = cookieStore.get('session_userId')?.value

    if (!userId) return null

    const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) }
    })

    return user
}

export async function changePassword(currentPassword: string, newPassword: string) {
    const user = await getSessionUser();
    if (!user) return { error: 'Unauthorized' };

    if (user.password !== currentPassword) {
        return { error: 'Password lama salah.' };
    }

    if (newPassword.length < 6) {
        return { error: 'Password baru minimal 6 karakter.' };
    }

    try {
        await prisma.user.update({
            where: { id: user.id },
            data: { password: newPassword }
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
