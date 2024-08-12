"use client"

import {useAuth} from '@/hooks/useAuth.js'
import Toolbar from "@/components/Toolbar";
import useGetData from "@/hooks/useGetData";
import useServerURL from "@/hooks/useServerURL";
import LoadingScreen from "@/components/LoadingScreen";
import Header from "@/components/Header";
import React from "react";
import Sidebar from "@/components/Sidebar";
import {useRouter} from "next/navigation";
import UserAttendance from "@/app/user/components/UserAttendance";
import CurrentUserAttendance from "@/app/attendance/components/CurrentUserAttendance";

export default function AttendancePage() {
    const {loggedIn, user, userId, loading} = useAuth();
    const router = useRouter();

    if (loading) {
        return <LoadingScreen/>;
    }

    if (!loggedIn) {
        router.push("/signup");
    }

    const {data, error, isLoading} = useGetData(`${useServerURL}/api/user/${userId}`, "userProfile");

    if (isLoading) {
        return <LoadingScreen/>;
    }

    const qrCodeSrc = data.data.qr_code;
    console.log(data.data);
    const validationCode = data.data.validation_code;

    return (

        <div className="flex h-screen bg-background-gray">
            <Sidebar/>
            <div className="flex-1 overflow-hidden bg-white p-0">
                <Header/>
                <main className="overflow-y-auto max-w-[1000px] mx-auto tracking-tight">
                    <div className="pb-24">
                        <div className="mb-8">
                            <h1 className="text-3xl font-semibold pt-6 tracking-tight mb-2">Attendance</h1>
                            <p className="font-medium">Scan this code or validate your code when you get to church.</p>
                        </div>
                        <div className="lg:flex gap-12">
                            <div>
                                <h2 className="font-medium text-2xl tracking-tight mb-4">QR Code</h2>
                                <img src={qrCodeSrc} alt="QR Code" className="lg:w-48 mx-auto lg:mx-0"/>
                            </div>
                            <div>
                                <h2 className="font-medium text-2xl tracking-tight mb-4">Validation code</h2>
                                <p>{validationCode}</p>
                            </div>
                        </div>
                        <CurrentUserAttendance userId={userId}/>
                    </div>
                </main>
            </div>
            <Toolbar/>
        </div>
    )
}