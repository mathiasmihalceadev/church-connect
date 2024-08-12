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
    DialogTrigger
} from "@/components/ui-backup/dialog";
import {ScrollArea} from "@/components/ui-backup/scroll-area";
import {Button} from "@/components/ui-backup/button";
import {X} from "@phosphor-icons/react";
import useDeleteData from "@/hooks/useDeleteData";
import {useQueryClient} from "@tanstack/react-query";
import {Plus} from "@phosphor-icons/react";
import AddUserToGroupForm from "@/app/groups/components/AddUserToGroupForm";

const GroupUsers = ({groupId, role}) => {
    const serverURL = useServerURL;
    const queryClient = useQueryClient();
    const {
        data: usersData,
        isLoading,
        error
    } = useGetData(`${serverURL}/api/group/${groupId}/users`, `users-group-${groupId}`);
    const [open, setOpen] = useState(false);
    const [userToRemove, setUserToRemove] = useState(null);
    const [deleteEndpoint, setDeleteEndpoint] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleRemoveSuccess = () => {
        setConfirmOpen(false);
        queryClient.invalidateQueries(`users-group-${groupId}`);
    };

    const deleteUserMutation = useDeleteData(deleteEndpoint, handleRemoveSuccess);

    const handleRemove = (userId) => {
        const deleteEndpoint = `${serverURL}/api/group/${groupId}/user/${userId}`;
        setDeleteEndpoint(deleteEndpoint);
        deleteUserMutation.mutate();
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const firstThreeUsers = usersData?.data.slice(0, 3) || [];

    return (
        <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <div className="flex items-center gap-1 cursor-pointer">
                        <div className="flex -space-x-2">
                            {firstThreeUsers.map((user) => (
                                <Avatar key={user.id} className="w-10 h-10">
                                    <AvatarImage src={`${serverURL}${user.profile_picture_url}`}/>
                                    <AvatarFallback className="w-10 h-10">{user.username[0]}</AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Group Users</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-96">
                        <div>
                            {usersData?.data.map((user) => (
                                <div key={user.id} className="flex items-center justify-between gap-3 mb-4">
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
                                    <div>

                                        {(role === "admin" || role === "moderator") && (
                                            <Button size="sm" className='p-1 mr-4' onClick={() => {
                                                setUserToRemove(user);
                                                setConfirmOpen(true);
                                            }}>
                                                <X weight='bold'/>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className="mt-4 flex justify-end gap-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
                    </div>
                </DialogContent>
            </Dialog>
            {userToRemove && (
                <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Remove</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to remove {userToRemove.first_name} {userToRemove.last_name}?</p>
                        <div className="mt-4 flex justify-end gap-4">
                            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={() => handleRemove(userToRemove.id)}>Remove</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            <Dialog>
                <DialogTrigger asChild>
                    {(role === "admin" || role === "moderator") && (
                        <div
                            className="flex items-center justify-center w-11 h-11 bg-royal-blue text-white bg-opacity-70 shadow-sm backdrop-blur-sm rounded-full cursor-pointer ml-[-20px] z-10">
                            <Plus size={20} weight="bold"/>
                        </div>
                    )}
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add User to Group</DialogTitle>
                    </DialogHeader>
                    <ScrollArea>
                        <AddUserToGroupForm groupId={groupId}/>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default GroupUsers;
