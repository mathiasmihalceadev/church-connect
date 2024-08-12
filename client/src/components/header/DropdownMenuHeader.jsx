import React from "react";
import {User, PencilSimple, SignOut} from "@phosphor-icons/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui-backup/dropdown-menu";
import usePostData from "@/hooks/usePostData";
import useGetData from "@/hooks/useGetData";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui-backup/avatar";
import useServerURL from "@/hooks/useServerURL";
import LoadingScreen from "@/components/LoadingScreen";
import {useAuth} from "@/hooks/useAuth";

export function DropdownMenuHeader() {
    const serverURL = useServerURL;
    const {userId} = useAuth();

    const userEndpoint = userId ? `${serverURL}/api/user/${userId}` : null;
    const {data: userData, isLoading, error} = useGetData(userEndpoint, `user-${userId}`, {enabled: !!userId});

    const logout = usePostData(`${serverURL}/api/auth/logout`);

    const router = useRouter();

    const handleLogout = () => {
        console.log("logout");
        logout.mutate(null, {
            onSuccess: () => router.push('http://localhost:3002/')
        });
    };

    console.log(userData);

    if (isLoading) return <LoadingScreen/>;
    if (error) return <div>Error loading user data</div>;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {userData ? (
                    userData.data.profilePictureUrl ? (
                        <Avatar className="cursor-pointer">
                            <AvatarImage src={`http://localhost:3000${userData.data.profilePictureUrl}`}/>
                            <AvatarFallback>{userData.data.first_name.charAt(0)}{userData.data.last_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    ) : (
                        <Avatar className="cursor-pointer">
                            <AvatarFallback>{userData.data.first_name.charAt(0)}{userData.data.last_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    )
                ) : (
                    <User size={28} className="cursor-pointer"/>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                    <Link href="/settings/edit-profile">
                        <DropdownMenuItem>
                            <PencilSimple size={20} className="mr-2"/>
                            <span>Edit Profile</span>
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={handleLogout}>
                        <SignOut size={20} className="mr-2"/>
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
