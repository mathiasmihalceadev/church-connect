"use client";

import React from "react";
import useGetData from "@/hooks/useGetData";
import LoadingScreen from "@/components/LoadingScreen";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui-backup/avatar";
import useServerURL from "@/hooks/useServerURL";
import {useParams, useRouter} from "next/navigation";
import {useAuth} from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import UserAttendance from "@/app/user/components/UserAttendance";

const UserProfile = () => {
    const {loggedIn, loading, role} = useAuth();
    const router = useRouter();
    const {id} = useParams();
    const serverURL = useServerURL;
    const {data, isLoading, error} = useGetData(`${serverURL}/api/user/${id}`, `user-profile-${id}`);

    if (loading) {
        return <LoadingScreen/>;
    }

    if (!loggedIn) {
        router.push("/signup");
    }


    if (isLoading) return <LoadingScreen/>;
    if (error) return <div>Error: {error.message}</div>;

    const user = data?.data;
    console.log(data.data);

    return (
        <div className="flex h-screen bg-background-gray">
            <Sidebar/>
            <div className="flex-1 flex flex-col overflow-hidden bg-white p-0">
                <Header/>
                <main className="overflow-y-auto flex-1 tracking-tight">
                    <div className="px-8 pb-24 max-w-[1000px] mx-auto">
                        <h1 className="text-3xl font-semibold mb-6 mt-6">User Profile</h1>
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-20 h-20">
                                    {user.profilePictureUrl ? (
                                        <AvatarImage src={`${serverURL}${user.profilePictureUrl}`}/>
                                    ) : (
                                        <AvatarFallback>
                                            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div>
                                    <h2 className="text-2xl font-medium">{user.first_name} {user.last_name}</h2>
                                    <p className="text-sm text-gray-500">@{user.username}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between">
                                    <span className="font-medium">Email:</span>
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Role:</span>
                                    <span>{user.role}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Validation Code:</span>
                                    <span>{user.validation_code}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Status:</span>
                                    <span>{user.status}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Created At:</span>
                                    <span>{new Date(user.created_at).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <span className="font-medium">QR Code:</span>
                                <div className="mt-2">
                                    <img src={user.qr_code} alt="QR Code" className="lg:w-48 mx-auto lg:mx-0"/>
                                </div>
                            </div>

                            <UserAttendance/>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserProfile;
