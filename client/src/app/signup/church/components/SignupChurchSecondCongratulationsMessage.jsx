import React, {useState} from 'react';
import TitleSubtitle from "@/components/TitleSubtitle";
import {ArrowLeft} from "@phosphor-icons/react";
import {Button} from "@/components/ui-backup/button";
import Link from "next/link";

export default function SignupChurchFirstCongratulationsMessage({}) {
    return (
        <div>
            <div className="flex gap-2 mb-6">
                <div className="h-3 rounded-full bg-royal-blue flex-1"></div>
                <div className="h-3 rounded-full bg-royal-blue flex-1"></div>
                <div className="h-3 rounded-full bg-royal-blue flex-1"></div>
            </div>
            <TitleSubtitle
                title="Congratulations!"
                subtitle="Your church is created. Is time to start organizing your church and connect you congregation."
            />
            <div className="flex flex-col gap-8">
                <Button className="w-full tracking-normal" asChild><Link href="/home">Let's go!</Link></Button>
            </div>
        </div>
    );
}
