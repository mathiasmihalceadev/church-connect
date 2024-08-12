"use client";

import {useState, useEffect} from "react";
import useGetData from "@/hooks/useGetData";
import Header from "@/components/Header";
import Toolbar from "@/components/Toolbar";
import {Avatar, AvatarFallback} from "@/components/ui-backup/avatar";
import useServerURL from "@/hooks/useServerURL";
import Sidebar from "@/components/Sidebar";
import React from "react";
import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "next/navigation";
import {X} from "@phosphor-icons/react";
import LoadingScreen from "@/components/LoadingScreen";
import {Button} from "@/components/ui-backup/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui-backup/dialog";
import useGetDataOptions from "@/hooks/useGetDataOptions";
import useDeleteData from "@/hooks/useDeleteData";
import {useQueryClient} from "@tanstack/react-query";

const PendingUsersList = () => {
    const {loggedIn, user, userId, loading} = useAuth();
    const router = useRouter();
    const [userToDelete, setUserToDelete] = useState(null);
    const [deleteUserEndpoint, setDeleteUserEndpoint] = useState(null);
    const serverURL = useServerURL;
    const endpoint = userId ? `${serverURL}/api/users/pending/${userId}` : null;
    const queryClient = useQueryClient();

    const {data: pendingUsers, isLoading, error} = useGetDataOptions(endpoint, 'pending', {enabled: !!userId});

    const deleteUserMutation = useDeleteData(deleteUserEndpoint, () => {
        setUserToDelete(null);
        queryClient.invalidateQueries('pending');
    });

    useEffect(() => {
        if (!loading && !loggedIn) {
            router.push("/signup");
        }
    }, [loading, loggedIn, router]);

    if (loading || isLoading) {
        return <LoadingScreen/>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const handleDelete = (id) => {
        console.log("deleteUser");
        const deleteEndpoint = `${serverURL}/api/user/${id}`;
        setDeleteUserEndpoint(deleteEndpoint);
        deleteUserMutation.mutate();
    };

    const users = pendingUsers || [];


    return (
        <div className="flex h-screen bg-background-gray">
            <Sidebar/>
            <div className="flex-1 overflow-hidden bg-white p-0">
                <Header/>
                <main className="overflow-y-auto max-w-[1000px] mx-auto tracking-tight">
                    <div className="px-8 pb-24">
                        <div className="mb-8">
                            <h1 className="text-3xl font-semibold pt-6 tracking-tight mb-2">Pending users</h1>
                            <p className="font-medium">Users that haven't claimed their user accounts.</p>
                        </div>
                        {users.length > 0 ? (
                            <ul className="flex flex-col gap-4 px-4 py-6 rounded-2xl bg-background-gray shadow-sm">
                                {users.map(user => (
                                    <li key={user.validation_code} className="flex items-center gap-4">
                                        <Avatar className="h-14 w-14">
                                            <AvatarFallback>
                                                {user.first_name.trim().charAt(0).toUpperCase()}
                                                {user.last_name.trim().charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-grow leading-none">
                                            <span className="font-semibold leading-tight">
                                                {user.first_name} {user.last_name}
                                            </span>
                                            <br/>
                                            <span className="text-sm leading-none">
                                                {user.validation_code}
                                            </span>
                                            <br/>
                                            <span className="text-xs leading-none text-hyacinth-arbor">
                                                {user.user_role}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button className="p-2 px-4 shadow-none" size="sm">
                                                <p>pending...</p>
                                            </Button>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" className="p-2"
                                                            onClick={() => setUserToDelete(user)}>
                                                        <X size={20} weight="bold"/>
                                                    </Button>
                                                </DialogTrigger>
                                                {userToDelete && (
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Confirm Delete</DialogTitle>
                                                            <DialogDescription>
                                                                Are you sure you want to
                                                                delete {user.first_name} {user.last_name}?
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="mt-4 flex justify-end gap-4">
                                                            <Button variant="outline"
                                                                    onClick={() => setUserToDelete(null)}>Cancel</Button>
                                                            <Button variant="destructive"
                                                                    onClick={() => handleDelete(user.id)}>Delete</Button>
                                                        </div>
                                                    </DialogContent>
                                                )}
                                            </Dialog>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="px-4 py-4 rounded-full bg-background-gray shadow-sm">
                                <p>No pending users for now.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <Toolbar/>
        </div>
    );
};

export default PendingUsersList;
