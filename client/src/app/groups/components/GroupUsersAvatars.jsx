import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui-backup/avatar";
import useServerURL from "@/hooks/useServerURL";
import useGetData from "@/hooks/useGetData";

export default function GroupUsersAvatars({groupId}) {
    const {
        data: usersData,
        isLoading,
        error
    } = useGetData(`${useServerURL}/api/group/${groupId}/users`, `users-group-${groupId}`);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const firstThreeUsers = usersData?.data.slice(0, 3) || [];
    const remainingUsersCount = (usersData?.data.length || 0) - firstThreeUsers.length;

    return (
        <div className="flex items-center gap-1">
            <div className="flex -space-x-2">
                {firstThreeUsers.map((user) => (
                    <Avatar key={user.id} className="w-10 h-10">
                        <AvatarImage src={`http://localhost:3000${user.profile_picture_url}`}/>
                        <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                ))}
            </div>
            {remainingUsersCount > 0 && <p className="text-sm text-gray-500">+{remainingUsersCount} more</p>}
        </div>
    );
}