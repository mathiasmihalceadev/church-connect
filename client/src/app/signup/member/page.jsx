"use client";

import {useState} from "react";
import SignupHeader from "@/app/signup/church/components/SignupHeader";
import ValidationCodeEnter from "@/app/signup/member/components/ValidationCodeEnter";
import SignupMember from "@/app/signup/member/components/SignupMember";

export default function SignupAsMemberPage() {
    const [currentComponentIndex, setCurrentComponentIndex] = useState(0);
    const [userId, setUserId] = useState(null);

    const handleVerificationCode = (data) => {
        setCurrentComponentIndex(1)
        setUserId(data);
    }

    return (
        <main className="px-8">
            <SignupHeader/>
            <section className="pt-12 pb-12 text-lead-gray tracking-tight xl:max-w-lg xl:mx-auto">
                {currentComponentIndex === 0 && (
                    <ValidationCodeEnter passData={handleVerificationCode}/>
                )}
                {currentComponentIndex === 1 && (
                    <SignupMember userId={userId}/>
                )}
            </section>
        </main>
    );
}