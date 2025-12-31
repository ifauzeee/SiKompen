
import bcrypt from 'bcryptjs';

/**
 * Hashes a plain text password using bcrypt.
 * @param password The plain text password.
 * @returns The hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
}

/**
 * Verifies a password against a hash.
 * Supports legacy plain text passwords for migration purposes.
 * @param password The input password.
 * @param hash The stored hash (or plain text password).
 * @returns true if valid, false otherwise.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    const isBcryptHash = /^\$2[aby]\$.{56}$/.test(hash);

    if (isBcryptHash) {
        return bcrypt.compare(password, hash);
    }

    return password === hash;
}

/**
 * Checks if the password hash needs to be upgraded (e.g. if it's plain text).
 * @param hash The stored hash.
 * @returns true if rehash is needed.
 */
export function needsRehash(hash: string): boolean {
    const isBcryptHash = /^\$2[aby]\$.{56}$/.test(hash);
    return !isBcryptHash;
}
