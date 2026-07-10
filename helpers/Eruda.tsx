// components/Eruda.tsx
"use client";

import { useEffect } from "react";

export default function Eruda() {

    useEffect(() => {
        // alert("Eruda component carregou");

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/eruda";

        script.onload = () => {
            // alert("Script carregou");

            // @ts-ignore
            window.eruda?.init();
        };

        script.onerror = () => {
            // alert("Erro carregando Eruda");
        };

        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        if (process.env.NODE_ENV !== "development") return;

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/eruda";

        script.onload = () => {
            // @ts-ignore
            window.eruda?.init();
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return null;
}