import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            name: 'Administrator',
            password: 'admin123',
            role: 'ADMIN',
        }
    });
    console.log('Admin created:', admin);

    const pengawas = await prisma.user.upsert({
        where: { username: 'pengawas' },
        update: {},
        create: {
            username: 'pengawas',
            name: 'Pengawas Kompen',
            password: 'pengawas123',
            role: 'PENGAWAS',
        }
    });
    console.log('Pengawas created:', pengawas);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
