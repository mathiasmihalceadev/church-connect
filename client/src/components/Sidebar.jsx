"use client";

import {CalendarDots, House, Users, CheckCircle, Gear} from "@phosphor-icons/react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useAuth} from "@/hooks/useAuth";
import LoadingScreen from "@/components/LoadingScreen";

const Sidebar = () => {
    const {role, loading} = useAuth();
    const currentPath = usePathname();

    if (loading) {
        return (<div>
            <LoadingScreen/>
        </div>)
    }

    return (
        <aside className="h-screen hidden md:flex shadow-md w-64 flex-col px-6 pt-6 bg-background-gray drop-shadow-sm">
            <div className="text-hyacinth-arbor font-bold pb-6">
                <p className="text-xl" style={{lineHeight: '0.9'}}>Church <br/></p>
                <p className="text-2xl" style={{lineHeight: '0.9'}}>Connect.</p>
            </div>
            <nav className="flex flex-col gap-2">
                <Link href="/home"
                      className={`py-2 px-2 font-semibold gap-2 flex items-center hover:text-royal-blue hover:bg-lila-purple rounded-full hover:shadow-md duration-200 ${currentPath === "/home" ? "text-royal-blue bg-lila-purple rounded-full shadow-md" : "text-lead-gray"}`}>
                    <House size={20}/>
                    <p className="leading-none tracking-tight">Home</p>
                </Link>
                <Link href="/groups"
                      className={`py-2 px-2 font-semibold gap-2 flex items-center hover:text-royal-blue hover:bg-lila-purple rounded-full hover:shadow-md duration-200 ${currentPath === "/groups" ? "text-royal-blue bg-lila-purple rounded-full shadow-md" : "text-lead-gray"}`}>
                    <Users size={20}/>
                    <p className="leading-none tracking-tight">Groups</p>
                </Link>
                <Link href="/calendar"
                      className={`py-2 px-2 font-semibold gap-2 flex items-center hover:text-royal-blue hover:bg-lila-purple rounded-full hover:shadow-md duration-200 ${currentPath === "/calendar" ? "text-royal-blue bg-lila-purple rounded-full shadow-md" : "text-lead-gray"}`}>
                    <CalendarDots size={20}/>
                    <p className="leading-none tracking-tight">Calendar</p>
                </Link>
                <Link href="/attendance"
                      className={`py-2 px-2 font-semibold gap-2 flex items-center hover:text-royal-blue hover:bg-lila-purple rounded-full hover:shadow-md duration-200 ${currentPath === "/attendance" || currentPath.startsWith("/attendance/") ? "text-royal-blue bg-lila-purple rounded-full shadow-md" : "text-lead-gray"}`}>
                    <CheckCircle size={20}/>
                    <p className="leading-none tracking-tight">Attendance</p>
                </Link>
                {role === "admin" &&
                    <div className="flex flex-col gap-3 font-medium pl-9">
                        <Link href="/attendance/manage-attendance">
                            <p className={`${currentPath === "/attendance/manage-attendance" ? "text-royal-blue" : ""} hover:text-royal-blue duration-200`}>Manage
                                attendance</p>
                        </Link>
                        <Link href="/attendance/scan-code">
                            <p className={`${currentPath === "/attendance/scan-code" ? "text-royal-blue" : ""} hover:text-royal-blue duration-200`}>Scan
                                users</p>
                        </Link>
                    </div>}
                <Link href="/settings"
                      className={`py-2 px-2 font-semibold gap-2 flex items-center hover:text-royal-blue hover:bg-lila-purple rounded-full hover:shadow-md duration-200 ${currentPath === "/settings" || currentPath.startsWith("/settings/") ? "text-royal-blue bg-lila-purple rounded-full shadow-md" : "text-lead-gray"}`}>
                    <Gear size={20}/>
                    <p className="leading-none tracking-tight">Settings</p>
                </Link>
                {role === "admin" &&
                    <div className="flex flex-col gap-3 font-medium pl-9">
                        <Link href="/settings/add-post">
                            <p className={`${currentPath === "/settings/add-post" ? "text-royal-blue" : ""} hover:text-royal-blue duration-200`}>Add
                                post</p>
                        </Link>
                        <Link href="/settings/add-user">
                            <p className={`${currentPath === "/settings/add-user" ? "text-royal-blue" : ""} hover:text-royal-blue duration-200`}>Add
                                user</p>
                        </Link>
                        <Link href="/settings/church-profile">
                            <p className={`${currentPath === "/settings/church-profile" ? "text-royal-blue" : ""} hover:text-royal-blue duration-200`}>Church
                                profile</p>
                        </Link>
                        <Link href="/settings/edit-profile">
                            <p className={`${currentPath === "/settings/edit-profile" ? "text-royal-blue" : ""} hover:text-royal-blue duration-200`}>Edit
                                profile</p>
                        </Link>
                        <Link href="/settings/pending-users">
                            <p className={`${currentPath === "/settings/pending-users" ? "text-royal-blue" : ""} hover:text-royal-blue duration-200`}>Pending
                                users</p>
                        </Link>
                        <Link href="/settings/manage-users">
                            <p className={`${currentPath === "/settings/manage-users" ? "text-royal-blue" : ""} hover:text-royal-blue duration-200`}>Manage
                                users</p>
                        </Link>
                    </div>
                }
            </nav>
        </aside>
    );
};

export default Sidebar;
