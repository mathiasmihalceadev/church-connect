"use client";

import React from "react";
import useGetData from "@/hooks/useGetData";
import LoadingScreen from "@/components/LoadingScreen";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui-backup/avatar";
import useServerURL from "@/hooks/useServerURL";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui-backup/table";
import {useAuth} from "@/hooks/useAuth";

export default function UsersTable() {
    const serverURL = useServerURL;
    const {userId} = useAuth();
    const endpoint = userId ? `${serverURL}/api/users/${userId}` : null;
    const {data: users, isLoading, error} = useGetData(endpoint, "users-list", {enabled: !!userId});

    if (isLoading) return <LoadingScreen/>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="p-4">
            <Table>
                <TableCaption>A list of all users.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Profile Picture</TableHead>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Username</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users && users.data && users.data.data.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.id}</TableCell>
                            <TableCell>
                                <Avatar className="w-10 h-10">
                                    {user.profile_picture_url ? (
                                        <AvatarImage src={`http://localhost:3000${user.profile_picture_url}`}/>
                                    ) : (
                                        <AvatarFallback>{user.first_name.charAt(0)}{user.last_name.charAt(0)}</AvatarFallback>
                                    )}
                                </Avatar>
                            </TableCell>
                            <TableCell>{user.first_name}</TableCell>
                            <TableCell>{user.last_name}</TableCell>
                            <TableCell>{user.username}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
