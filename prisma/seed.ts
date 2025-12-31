import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding (Admin Only)...");

    await prisma.payment.deleteMany().catch(() => { });
    await prisma.activityLog.deleteMany().catch(() => { });
    await prisma.jobApplication.deleteMany().catch(() => { });
    await prisma.clearanceRequest.deleteMany().catch(() => { });
    await prisma.job.deleteMany().catch(() => { });
    await prisma.user.deleteMany().catch(() => { });

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    const admin = await prisma.user.create({
        data: {
            username: "admin",
            name: "Administrator PNJ",
            nim: null,
            prodi: "Pusat",
            role: "ADMIN",
            totalHours: 0,
            password: hashedPassword,
        },
    });

    console.log("Seeding finished.");
    console.log("Created Admin User:");
    console.log("Username: admin");
    console.log("Password: admin123");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });