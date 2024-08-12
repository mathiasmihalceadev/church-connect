import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import React from "react";
import UsersTable from "@/app/settings/manage-users/components/UsersTable";
import PaginatedTable from "@/app/settings/manage-users/components/PaginatedTable";

export default function UsersPage() {
    return (
        <div className="flex h-screen bg-white">
            <Sidebar/>
            <div className="flex-1 flex flex-col bg-white p-0 overflow-hidden">
                <Header/>
                <main className="flex-1 overflow-y-auto pb-24">
                    <div className="max-w-[1200px] mx-auto px-4">
                        <PaginatedTable/>
                    </div>
                </main>
            </div>
        </div>
    )
}