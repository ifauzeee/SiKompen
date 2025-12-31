import { getSessionUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const user = await getSessionUser();

    if (!user) {
        redirect('/login');
    }

    return <ProfileClient user={user} />;
}
