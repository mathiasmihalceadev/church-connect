"use client"
// src/Calendar.js
import React, {useState} from 'react';
import Header from "@/components/Header";
import Toolbar from "@/components/Toolbar";
import {ArrowRight, ArrowLeft, CaretRight, CaretLeft} from "@phosphor-icons/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui-backup/dialog";
import {ScrollArea} from "@/components/ui/scroll-area";
import useGetData from "@/hooks/useGetData";
import useServerURL from "@/hooks/useServerURL";
import LoadingScreen from "@/components/LoadingScreen";
import Link from "next/link";
import {CalendarBlank} from "@phosphor-icons/react"
import Sidebar from "@/components/Sidebar";
import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "next/navigation";

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarPage = () => {
    const {loggedIn, user, userId, loading} = useAuth();
    const router = useRouter();

    const {
        data: events,
        isLoading,
        isError
    } = useGetData(loggedIn ? `${useServerURL}/api/events/${userId}` : null, `events-${userId}`);
    const [currentDate, setCurrentDate] = useState(new Date());

    if (loading) {
        return <LoadingScreen/>;
    }

    if (!loggedIn) {
        router.push("/signup");
    }


    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDayOfWeek = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const renderDays = () => {
        const days = [];
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="w-full h-16"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = events.data.events.filter(event => new Date(event.date_start).toDateString() === currentDay.toDateString());

            days.push(
                dayEvents && dayEvents.length > 0 ? (
                    <Dialog key={day}>
                        <DialogTrigger>
                            <div
                                className="cursor-pointer font-medium w-full h-16 flex flex-col items-center justify-center relative hover:bg-background-gray duration-200 rounded-full">
                                {day}
                                <div className="w-2 h-2 bg-royal-blue rounded-full absolute bottom-1"></div>
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="mb-4">Events on {currentDay.toDateString()}</DialogTitle>
                                <DialogDescription>
                                    <ScrollArea className="max-h-96">
                                        {dayEvents.map((event, index) => {
                                            const formatTime = (time) => time.slice(0, 5); // Remove seconds

                                            return (
                                                <Link href={`posts/${event.id}`}>
                                                    <div key={index}
                                                         className="py-2 px-6 hover:opacity-80 duration-200 bg-royal-blue rounded-full shadow-md flex justify-between items-center">
                                                        <div>
                                                            <p className="font-semibold text-white">{event.title}</p>
                                                            <p className="font-medium text-sm text-white">
                                                                {formatTime(event.time_start)} - {formatTime(event.time_end)}
                                                            </p>
                                                        </div>
                                                        <div><CalendarBlank size={24} className="text-white"/></div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </ScrollArea>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                ) : (
                    <div key={day}
                         className="cursor-pointer font-medium w-full h-16 flex flex-col items-center justify-center relative hover:bg-background-gray duration-200 rounded-full">
                        {day}
                    </div>
                )
            );
        }
        return days;
    };

    if (isLoading) {
        return <LoadingScreen/>;
    }

    return (
        <div className="flex h-screen bg-background-gray">
            <Sidebar/>
            <div className="flex-1 overflow-hidden bg-white p-0">
                <Header/>
                <main className="overflow-y-auto max-w-[1000px] mx-auto">
                    <div className="px-8 pb-24 lg:max-w-2xl lg:mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-semibold pt-6 tracking-tight mb-2">All Events</h1>
                            <p className="font-medium">Check in with all the events that are happening in your
                                church.</p>
                        </div>
                        <div className="overflow-hidden">
                            <div className="flex justify-between items-center py-4 bg-gray-200">
                                <button onClick={handlePrevMonth}
                                        className="py-2 px-2 bg-gray-300 rounded-full hover:bg-royal-blue hover:text-white duration-200">
                                    <CaretLeft size={28}/>
                                </button>
                                <div className="text-2xl font-bold tracking-tight">
                                    {currentDate.toLocaleString('en-US', {month: 'long'})} {currentDate.getFullYear()}
                                </div>
                                <button onClick={handleNextMonth}
                                        className="px-2 py-2 rounded-full hover:bg-royal-blue hover:text-white duration-200">
                                    <CaretRight size={28}/>
                                </button>
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-7 gap-2">
                                    {daysOfWeek.map((day) => (
                                        <div key={day}
                                             className="text-center py-2 text-xl font-medium bg-royal-blue text-white rounded-full">
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-2 mt-2 text-lg">{renderDays()}</div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Toolbar/>
        </div>
    );
};

export default CalendarPage;
