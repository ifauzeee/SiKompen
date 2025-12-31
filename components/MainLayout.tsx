"use client";

import { usePathname } from "next/navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isPublicPage = ["/", "/login"].includes(pathname);

    return (
        <div className={`min-h-screen transition-all duration-300 ${!isPublicPage ? 'lg:pl-72 pt-[4.5rem] lg:pt-0' : ''}`}>
            <main>{children}</main>
        </div>
    );
}
