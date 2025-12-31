"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function SmoothWrapper({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    const container = useRef(null);

    useGSAP(() => {
        gsap.fromTo(
            container.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        );
    }, { scope: container });

    return (
        <div ref={container} className={`w-full ${className}`}>
            {children}
        </div>
    );
}
