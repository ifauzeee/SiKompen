import { getSessionUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import ImportClient from "./ImportClient";

export const dynamic = 'force-dynamic';

export default async function ImportPage() {
    const user = await getSessionUser();

    if (!user || user.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    return <ImportClient />;
}
