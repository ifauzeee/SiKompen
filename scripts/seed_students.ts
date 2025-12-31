
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const filePath = path.join(__dirname, 'data_import.txt');
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const lines = fileContent.split('\n');
    let successCount = 0;
    let skippedCount = 0;
    let erroredCount = 0;

    let currentClass = '';

    for (const line of lines) {
        const cleanLine = line.trim();
        if (!cleanLine) continue;

        if (cleanLine.startsWith('TI')) {
            currentClass = cleanLine;
            console.log(`Processing Class: ${currentClass}`);
            continue;
        }

        if (cleanLine.startsWith('No') || cleanLine.startsWith('DATA DI') || cleanLine.startsWith('No.')) {
            continue;
        }

        const match = cleanLine.match(/^\d+\s+(\d{10})\s+(.*)$/);

        if (!match) {
            const parts = cleanLine.split('\t');
            if (parts.length >= 3) {
                const nim = parts[1].trim();
                if (/^\d{10}$/.test(nim)) {
                    const name = parts[2].trim();
                    await createUser(nim, name, currentClass);
                    continue;
                }
            }

            if (!cleanLine.startsWith('TI')) {
            }
            continue;
        }

        const nim = match[1];
        let name = match[2];

        const parts = cleanLine.split('\t');
        if (parts.length >= 3 && parts[1].trim() === nim) {
            name = parts[2].trim();
        } else {
            const nameMatch = name.match(/^(.*?)(?=\t|\s+\d)/);
            if (nameMatch) {
                name = nameMatch[1].trim();
            }
        }

        await createUser(nim, name, currentClass);
    }

    async function createUser(nim: string, name: string, kelas: string) {
        try {
            const existing = await prisma.user.findUnique({
                where: { username: nim }
            });

            if (existing) {
                skippedCount++;
                return;
            }

            await prisma.user.create({
                data: {
                    username: nim,
                    nim: nim,
                    name: name,
                    prodi: 'Teknik Informatika',
                    kelas: kelas,
                    password: nim,
                    role: 'MAHASISWA',
                    totalHours: 0
                }
            });
            console.log(`Created: ${name} (${kelas})`);
            successCount++;
        } catch (e) {
            console.error(`Error ${nim}:`, e);
            erroredCount++;
        }
    }

    console.log('--- Import Summary ---');
    console.log(`Success: ${successCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log(`Errors: ${erroredCount}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
