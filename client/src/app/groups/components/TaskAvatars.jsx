"use client";

import React, {useState} from 'react';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui-backup/avatar";
import useGetData from "@/hooks/useGetData";
import useServerURL from "@/hooks/useServerURL";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui-backup/dialog";
import {ScrollArea} from "@/components/ui-backup/scroll-area";
import {Button} from "@/components/ui-backup/button";
import {X} from "@phosphor-icons/react";
import useDeleteData from "@/hooks/useDeleteData";
import {useQueryClient} from "@tanstack/react-query";

const TaskAvatars = ({taskId, userId}) => {
    const serverURL = useServerURL;
    const queryClient = useQueryClient();
    const {data, isLoading, error} = useGetData(`${serverURL}/api/tasks/${taskId}/users`, `task-users-${taskId}`);
    const [open, setOpen] = useState(false);
    const [userToUnassign, setUserToUnassign] = useState(null);
    const [deleteEndpoint, setDeleteEndpoint] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleUnassignSuccess = () => {
        setConfirmOpen(false);
        queryClient.invalidateQueries(`task-users-${taskId}`);
    };

    const deleteUserMutation = useDeleteData(deleteEndpoint, handleUnassignSuccess);

    const handleUnassign = (userId) => {
        const deleteEndpoint = `${serverURL}/api/task/${taskId}/user/${userId}`;
        setDeleteEndpoint(deleteEndpoint);
        deleteUserMutation.mutate();
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const users = data?.data.users || [];

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <div className="flex -space-x-2 cursor-pointer">
                        {users.slice(0, 3).map(user => (
                            <Avatar key={user.id} className="w-10 h-10">
                                <AvatarImage src={`${serverURL}${user.profile_picture_url}`}/>
                                <AvatarFallback>{user.username[0]}</AvatarFallback>
                            </Avatar>
                        ))}
                        {users.length > 3 && (
                            <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full">
                                <span className="text-sm text-gray-700">+{users.length - 3}</span>
                            </div>
                        )}
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assigned Users</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-96">
                        <div className="flex flex-col gap-3">
                            {users.map(user => (
                                <div key={user.id} className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={`${serverURL}${user.profile_picture_url}`}/>
                                            <AvatarFallback>{user.username[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="tracking-tight font-semibold">{user.first_name} {user.last_name}</p>
                                            <p className="text-sm leading-none tracking-tight text-hyacinth-arbor">@{user.username}</p>
                                        </div>
                                    </div>
                                    <Button size="sm" className='p-1 mr-4' onClick={() => {
                                        setUserToUnassign(user);
                                        setConfirmOpen(true);
                                    }}>
                                        <X weight='bold'/>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className="mt-4 flex justify-end gap-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
                    </div>
                </DialogContent>
            </Dialog>
            {userToUnassign && (
                <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Unassign</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to unassign {userToUnassign.first_name} {userToUnassign.last_name}?</p>
                        <div className="mt-4 flex justify-end gap-4">
                            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                            <Button variant="destructive"
                                    onClick={() => handleUnassign(userToUnassign.id)}>Unassign</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default TaskAvatars;
