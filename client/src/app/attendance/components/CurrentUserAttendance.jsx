"use client";

import React from "react";
import useGetData from "@/hooks/useGetData";
import LoadingScreen from "@/components/LoadingScreen";
import useServerURL from "@/hooks/useServerURL";
import {useParams} from "next/navigation";
import Link from "next/link";

const UserAttendance = ({userId}) => {
    const serverURL = useServerURL;
    const {
        data,
        isLoading,
        error
    } = useGetData(`${serverURL}/api/user/${userId}/attendance`, `user-attendance-${userId}`);

    if (isLoading) return <LoadingScreen/>;
    if (error) return <div>Error: {error.message}</div>;

    const attendance = data?.data.data || [];

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-medium mb-4">Attended Events</h2>
            <div className="flex flex-col gap-4">
                {attendance.length > 0 ? (
                    attendance.map((event) => (
                        <Link href={`/posts/${event.id}`} key={event.id}>
                            <div className="flex justify-between border-b pb-2 hover:text-royal-blue duration-200">
                                <span className="font-medium">{event.title}</span>
                                <span className="text-gray-500">{new Date(event.date_start).toLocaleDateString()}</span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>No events attended.</p>
                )}
            </div>
        </div>
    );
};

export default UserAttendance;
