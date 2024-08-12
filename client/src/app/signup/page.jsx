"use client";

import {Button} from "@/components/ui-backup/button";
import SignupHeader from "@/app/signup/church/components/SignupHeader";
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import useRedirectIfAuthenticated from "@/hooks/useRedirectIfAuthenticated";

export default function SignupMain() {
    useRedirectIfAuthenticated();

    return (
        <div>
            <div className="absolute px-8">
                <SignupHeader></SignupHeader>
            </div>
            <div className="text-lead-gray flex justify-center items-center min-h-screen px-8 xl:max-w-lg xl:mx-auto">
                <div className='w-full'>
                    <h1 className="font-bold text-2xl text-center tracking-tight mb-4">Sign in to church Connect</h1>
                    <div className="flex flex-col gap-2">
                        <Button className="w-full" asChild><Link href="/signup/church">Sign up as a
                            church</Link></Button>
                        <span className="text-center font-bold text-2xl tracking-tight">or</span>
                        <Button variant="secondary" asChild><Link href="/signup/member">Sign up as a
                            member</Link></Button>
                        <p className="text-center text font-medium mt-4">Already signed up? Then <span
                            className="underline text-royal-blue font-semibold"><Link
                            href="/login">Log in.</Link></span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
