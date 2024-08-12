import React, {useState} from 'react';
import TitleSubtitle from "@/components/TitleSubtitle";
import {ArrowLeft} from "@phosphor-icons/react";
import {Button} from "@/components/ui-backup/button";
import Link from "next/link";

export default function SignupChurchFirstCongratulationsMessage({passData}) {
    const setData = (arg) => {
        passData(arg);
    }

    return (
        <div>
            <div className="flex gap-2 mb-6">
                <div className="h-3 rounded-full bg-royal-blue flex-1"></div>
                <div className="h-3 rounded-full bg-royal-blue flex-1"></div>
                <div className="h-3 rounded-full bg-lila-purple flex-1"></div>
            </div>
            <TitleSubtitle
                title="Congratulations"
                subtitle="You signed up as a church. Now, you need to create a user as the main administrator. If you do not do that, the church will not be created."
            />
            <div className="flex flex-col gap-8">
                <Button onClick={() => setData(3)} className="w-full tracking-normal">Create Admin User</Button>
                <Button onClick={() => setData(0)} variant="secondary"
                        className="w-full tracking-normal cursor-pointer" asChild>
                    <div className="flex gap-2 items-center">
                        <ArrowLeft size={20}/>
                        <span>Go Back</span>
                    </div>
                </Button>
            </div>
        </div>
    );
}
