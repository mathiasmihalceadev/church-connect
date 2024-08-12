// app/layout.js
"use client";

import {DM_Sans} from 'next/font/google';
import "./globals.css";

import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import {useState} from "react";
import AuthProvider from "@/hooks/useAuth";
import {Toaster} from "@/components/ui/toaster";

const dmSans = DM_Sans({subsets: ['latin']});

const queryClient = new QueryClient();

export default function RootLayout({children}) {
    return (
        <QueryClientProvider client={queryClient}>
            <html className={dmSans.className} lang="en">
            <body suppressHydrationWarning={true}>
            <AuthProvider>
                <main>{children}</main>
                <Toaster/>
            </AuthProvider>
            </body>
            </html>
        </QueryClientProvider>
    );
}
