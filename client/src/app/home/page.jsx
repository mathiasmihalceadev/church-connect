"use client";

import Toolbar from "@/components/Toolbar";
import Header from "@/components/Header";
import ChurchProfile from "@/app/home/components/ChurchProfile";
import MainFeed from "@/app/home/components/MainFeed";
import LoadingScreen from "@/components/LoadingScreen";
import Sidebar from "@/components/Sidebar";
import AuthProvider, {useAuth} from "@/hooks/useAuth";
import {useRouter} from "next/navigation";
import AuthButton from "@/app/groups/components/AuthButton";

export default function HomePage() {
    const {loggedIn, user, userId, loading, role} = useAuth();
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
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header/>
                <main className="flex-1 overflow-y-auto">
                    <ChurchProfile userId={userId}/>
                    {/*<AuthButton></AuthButton>*/}
                    <MainFeed userId={userId} role={role}/>
                </main>
            </div>
            <Toolbar/>
        </div>
    );
}
