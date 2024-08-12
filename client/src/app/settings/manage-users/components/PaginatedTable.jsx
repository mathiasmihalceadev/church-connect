"use client";

import React, {useState} from "react";
import usePaginatedData from "@/hooks/usePaginatedData";
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
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui-backup/pagination";
import {useAuth} from "@/hooks/useAuth";
import {Button} from "@/components/ui-backup/button";
import Link from "next/link";

export default function UsersTable() {
    const serverURL = useServerURL;
    const {userId} = useAuth();
    const [page, setPage] = useState(1);
    const limit = 10; // Number of items per page

    const endpoint = userId ? `${serverURL}/api/users/paginated/${userId}` : null;
    const {
        data,
        isLoading,
        error,
        isFetching,
        isPreviousData
    } = usePaginatedData(endpoint, page, limit, {enabled: !!userId});

    if (isLoading) return <LoadingScreen/>;
    if (error) return <div>Error: {error.message}</div>;

    const users = data?.data || [];
    const total = data?.total || 0;
    const totalPages = Math.ceil(total / limit);

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
                        <TableHead>Email</TableHead>
                        <TableHead>Username</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
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
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell><Button size="sm" className="px-4 text-sm" asChild><Link
                                href={`/user/${user.id}`}>Edit
                                user</Link></Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination className="mt-4">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={() => setPage((old) => Math.max(old - 1, 1))}
                            disabled={page === 1}
                        />
                    </PaginationItem>
                    {Array.from({length: totalPages}, (_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink
                                href="#"
                                onClick={() => setPage(index + 1)}
                                isActive={page === index + 1}
                            >
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={() => {
                                if (!isPreviousData && page < totalPages) {
                                    setPage((old) => old + 1);
                                }
                            }}
                            disabled={isPreviousData || page === totalPages}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            {isFetching && <LoadingScreen/>}
        </div>
    );
}

