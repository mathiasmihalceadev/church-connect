"use client";

import {useAuth} from "@/hooks/useAuth";
import Toolbar from "@/components/Toolbar";
import Header from "@/components/Header";
import Link from "next/link";
import useGetData from "@/hooks/useGetData";
import useServerURL from "@/hooks/useServerURL";
import Sidebar from "@/components/Sidebar";
import React from "react";
import {useRouter} from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui-backup/avatar";
import GroupUsersAvatars from "@/app/groups/components/GroupUsersAvatars";
import {Button} from "@/components/ui-backup/button";
import {Plus} from "@phosphor-icons/react";

export default function Groups() {
    const {loggedIn, user, userId, loading} = useAuth();
    const router = useRouter();

    // Use a conditional check to only call useGetData when userId is defined
    const {data, isLoading, error} = useGetData(
        userId ? `${useServerURL}/api/groups/user/${userId}` : null,
        'userGroups',
        {enabled: !!userId} // This ensures the query only runs when userId is not null
    );

    if (loading) {
        return <LoadingScreen/>;
    }

    if (!loggedIn) {
        router.push("/signup");
        return null; // Ensure we return null to avoid rendering the rest of the component
    }

    if (isLoading) return <div><LoadingScreen/></div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="flex h-screen bg-background-gray">
            <Sidebar/>
            <div className="flex-1 overflow-hidden bg-white p-0">
                <Header/>
                <main className="overflow-y-auto max-w-[1000px] mx-auto">
                    <div className="px-8">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-semibold pt-6 mb-4 tracking-tight">My groups</h1>
                        </div>
                        {data?.data.length ? (
                            <ul>
                                {data.data.map(group => (
                                    <Link href={`/groups/${group.name}?id=${group.id}`} key={group.id}>
                                        <li className="mb-2 bg-background-gray p-4 rounded-full shadow-md">
                                            <div className="flex justify-between items-center">
                                                <p className="font-medium text-lg text-dark-slate tracking-tight">{group.name}</p>
                                                <GroupUsersAvatars groupId={group.id}/>
                                            </div>
                                        </li>
                                    </Link>
                                ))}
                            </ul>
                        ) : (
                            <p>No groups found for this user.</p>
                        )}
                    </div>
                </main>
            </div>
            <Toolbar/>
        </div>
    );
}
