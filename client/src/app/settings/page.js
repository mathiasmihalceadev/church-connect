"use client";

import {useAuth} from "@/hooks/useAuth";
import Toolbar from "@/components/Toolbar";
import Header from "@/components/Header";
import ChurchProfile from "@/app/home/components/ChurchProfile";
import MainFeed from "@/app/home/components/MainFeed";
import Link from "next/link";
import useGetData from "@/hooks/useGetData";
import LoadingScreen from "@/components/LoadingScreen";
import useServerURL from "@/hooks/useServerURL";
import Sidebar from "@/components/Sidebar";
import React from "react";
import {useRouter} from "next/navigation";

export default function Settings() {
    const {loggedIn, user, userId, loading, role} = useAuth();
    const router = useRouter();

    if (loading) {
        return <LoadingScreen/>;
    }

    if (!loggedIn) {
        router.push("/signup");
    }

    const pendingUsers = useGetData(`${useServerURL}/api/users/pending/${userId}`, 'pendingUsers');

    return (
        <div className="flex h-screen bg-background-gray">
            <Sidebar/>
            <div className="flex-1 overflow-hidden bg-white p-0">
                <Header/>
                <main className="overflow-y-auto max-w-[1000px] mx-auto">
                    <div className="px-8">
                        <h1 className="text-3xl font-semibold pt-6 mb-4 tracking-tight">Settings</h1>
                        <ul className="flex flex-col gap-2 mb-6">
                            <li>
                                <h2 className="text-xl font-semibold">Profile</h2>
                            </li>
                            <Link href="/settings/edit-profile">
                                <li className="font-medium hover:text-royal-blue duration-200">Edit profile</li>
                            </Link>
                        </ul>
                        {role === "admin" &&
                            <ul className="flex flex-col gap-2 mb-6">
                                <li>
                                    <h2 className="text-xl font-semibold">Administrator options</h2>
                                </li>
                                <Link href="/settings/add-user">
                                    <li className="font-medium hover:text-royal-blue duration-200">Add user</li>
                                </Link>
                                <li className="flex items-center gap-2">
                                    <Link className="font-medium hover:text-royal-blue duration-200"
                                          href="/settings/pending-users">
                                        Pending users
                                    </Link>
                                    {pendingUsers.isLoading ? <div>Loading...</div> :
                                        (<div className="flex items-center justify-center">
                                    <span
                                        className="px-2 text-sm text-white rounded-full bg-royal-blue">{pendingUsers.data.data.length}</span>
                                        </div>)
                                    }
                                </li>
                                <Link href="/settings/add-post">
                                    <li className="font-medium hover:text-royal-blue duration-200">Add post</li>
                                </Link>
                                <Link href="/settings/church-profile">
                                    <li className="font-medium hover:text-royal-blue duration-200">Edit church profile
                                    </li>
                                </Link>
                            </ul>
                        }
                    </div>
                </main>
            </div>
            <Toolbar/>
        </div>
    );
}

