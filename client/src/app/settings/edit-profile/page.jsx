"use client";

import {useAuth} from "@/hooks/useAuth";
import Toolbar from "@/components/Toolbar";
import Header from "@/components/Header";
import EditProfilePicture from "@/app/settings/edit-profile/components/EditProfilePicture";
import UpdateUserForm from "@/app/settings/edit-profile/components/UpdateUser";
import React from "react";
import Sidebar from "@/components/Sidebar";
import {useRouter} from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import {Button} from "@/components/ui-backup/button";
import Link from "next/link";

export default function HomePage() {
    const {loggedIn, user, userId, loading} = useAuth();
    const router = useRouter();

    if (loading) {
        return <LoadingScreen/>;
    }

    if (!loggedIn) {
        router.push("/signup");
    }

    return (
        <div className="flex h-screen bg-white">
            <Sidebar/>
            <div className="flex-1 flex flex-col bg-white p-0 overflow-hidden">
                <Header/>
                <main className="flex-1 overflow-y-auto pb-24">
                    <div className="max-w-[800px] mx-auto px-4">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-semibold pt-6 pb-6 tracking-tight">
                                Edit profile
                            </h1>
                            <Button size="sm">
                                <Link href={`/user/${userId}`}>
                                    User Details
                                </Link>
                            </Button>
                        </div>
                        <div className="pb-6">
                            <div className="mb-12">
                                <h2 className="font-medium text-xl tracking-tight mb-4">Edit profile picture</h2>
                                <EditProfilePicture userId={userId}/>
                            </div>
                            <div className="mb-2">
                                <h2 className="font-medium text-xl tracking-tight mb-4">Edit user data</h2>
                                <UpdateUserForm userId={userId}/>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Toolbar/>
        </div>
    );
}
