import {useEffect, useState} from 'react';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui-backup/avatar";
import useGetData from "@/hooks/useGetData";
import {ScrollArea} from "@/components/ui-backup/scroll-area";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui-backup/drawer";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui-backup/dialog";
import {Button} from "@/components/ui-backup/button";
import useIsMobile from "@/hooks/useIsMobile"


export default function UserInteractions({postId}) {
    const {
        data: usersData,
        isLoading,
        error
    } = useGetData(`http://localhost:3000/api/interactions-users/${postId}`, `users-interaction-${postId}`);

    const isMobile = useIsMobile();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const firstThreeUsers = usersData?.data.slice(0, 3) || [];
    const remainingUsersCount = (usersData?.data.length || 0) - firstThreeUsers.length;

    return (
        <div>
            {isMobile ? (
                <Drawer>
                    <DrawerTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <div className="flex -space-x-4">
                                {firstThreeUsers.map((user, index) => (
                                    <Avatar key={user.id} className="w-12 h-12">
                                        <AvatarImage src={`http://localhost:3000${user.profile_picture_url}`}/>
                                        <AvatarFallback className="w-12 h-12">{user.username[0]}</AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                            {remainingUsersCount > 0 && <p>+{remainingUsersCount} more</p>}
                        </div>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Interactions</DrawerTitle>
                            <DrawerDescription></DrawerDescription>
                        </DrawerHeader>
                        <ScrollArea className="h-96">
                            <div>
                                {usersData?.data.map((user) => (
                                    <div key={user.id} className="flex items-center gap-3 mb-4">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={`http://localhost:3000${user.profile_picture_url}`}/>
                                            <AvatarFallback>{user.username[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="tracking-tight font-semibold">{user.first_name} {user.last_name}</p>
                                            <p className="text-sm leading-none tracking-tight text-hyacinth-arbor">@{user.username}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <DrawerFooter>
                            <DrawerClose>
                                <Button variant="select">Close</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            ) : (
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <div className="flex -space-x-4">
                                {firstThreeUsers.map((user, index) => (
                                    <Avatar key={user.id} className="w-12 h-12">
                                        <AvatarImage src={`http://localhost:3000${user.profile_picture_url}`}/>
                                        <AvatarFallback className="w-12 h-12">{user.username[0]}</AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                            {remainingUsersCount > 0 && <p>+{remainingUsersCount} more</p>}
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Interactions</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-96">
                            <div>
                                {usersData?.data.map((user) => (
                                    <div key={user.id} className="flex items-center gap-3 mb-4">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={`http://localhost:3000${user.profile_picture_url}`}/>
                                            <AvatarFallback>{user.username[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="tracking-tight font-semibold">{user.first_name} {user.last_name}</p>
                                            <p className="text-sm leading-none tracking-tight text-hyacinth-arbor">@{user.username}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
