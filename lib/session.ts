import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET_KEY = process.env.SESSION_SECRET || 'PLEASE_CHANGE_THIS_TO_A_SECURE_RANDOM_STRING_IN_PRODUCTION'
const key = new TextEncoder().encode(SECRET_KEY)

export type SessionPayload = {
    userId: number
    role: string
    username: string
}

export async function createSession(payload: SessionPayload) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(key)

    const cookieStore = await cookies()
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}

export async function verifySession() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')?.value

    if (!session) return null

    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ['HS256'],
        })
        return payload as SessionPayload
    } catch (_error) {
        return null
    }
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}

export async function getSession() {
    return verifySession();
}
