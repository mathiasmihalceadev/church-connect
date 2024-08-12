"use client";

import {useParams, useRouter, useSearchParams} from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import React from "react";
import Toolbar from "@/components/Toolbar";
import {CalendarBlank, ChatsCircle} from "@phosphor-icons/react";
import {useAuth} from "@/hooks/useAuth";
import LoadingScreen from "@/components/LoadingScreen";
import useGetData from "@/hooks/useGetData";
import useServerURL from "@/hooks/useServerURL";
import ServiceEvent from "@/app/groups/components/ServiceEvent";
import GroupUsers from "@/app/groups/components/GroupUsers";
import AuthButton from "@/app/groups/components/AuthButton";
import {parseEventDateTime} from "@/utils/utils";


export default function SingleGroup() {
    const {loggedIn, user, userId, loading, role} = useAuth();
    const router = useRouter();
    const {name} = useParams();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const {
        data: events,
        isLoading,
        isError
    } = useGetData(loggedIn ? `${useServerURL}/api/events/${userId}` : null, `events-${userId}`);

    if (!loading && !loggedIn) {
        router.push("/signup");
    }

    if (loading || isLoading) {
        return <LoadingScreen/>;
    }

    const currentDateTime = new Date();

    const upcomingEvents = events?.data?.events?.filter(event => {
        const eventDateTime = parseEventDateTime(event.date_start, event.time_start); // Switch the parameters
        console.log(eventDateTime);
        console.log(currentDateTime);
        return eventDateTime >= currentDateTime;
    });

    const pastEvents = events?.data?.events?.filter(event => {
        const eventDateTime = parseEventDateTime(event.date_start, event.time_start); // Switch the parameters
        return eventDateTime < currentDateTime;
    });

    return (
        <div className="flex h-screen bg-white">
            <Sidebar/>
            <div className="flex-1 flex flex-col bg-white p-0 overflow-hidden tracking-tight">
                <Header/>
                <main className="flex-1 overflow-y-auto pb-24">
                    <div className="max-w-[1000px] mx-auto px-4">
                        <div className="mb-8">
                            <div className="flex items-center gap-4">
                                <h1 className="text-4xl font-semibold pt-6 tracking-tight mb-4">{name}</h1>
                                <GroupUsers groupId={id} role={role}/>
                            </div>
                            <AuthButton name={name}/>
                        </div>
                        <div>
                            <p className="font-semibold text-3xl mb-4">Upcoming Events & Services</p>
                            <div className="flex flex-col gap-6">
                                {upcomingEvents.length === 0 ? (
                                    <p>No upcoming events.</p>
                                ) : (
                                    upcomingEvents.map((event, index) => (
                                        <ServiceEvent groupId={id} key={index} event={event} userId={userId}/>
                                    ))
                                )}
                            </div>
                        </div>
                        <div className="mt-12">
                            <p className="font-semibold text-3xl mb-4">Past Events & Services</p>
                            <div className="flex flex-col gap-6">
                                {pastEvents.length === 0 ? (
                                    <p>No past events or services.</p>
                                ) : (
                                    pastEvents.map((event, index) => (
                                        <ServiceEvent role={role} groupId={id} key={index} event={event}
                                                      userId={userId}/>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Toolbar/>
        </div>
    );
}
