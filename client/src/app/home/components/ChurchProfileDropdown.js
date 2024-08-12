import {
    User,
    PencilSimple,
    SignOut, Gear, Church, DotsThree
} from "@phosphor-icons/react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui-backup/dropdown-menu"

import usePostData from "@/hooks/usePostData";
import {useRouter} from "next/navigation";

import Link from "next/link";
import useServerURL from "@/hooks/useServerURL";

export default function ChurchProfileDropdown() {
    const logout = usePostData(`${useServerURL}/api/auth/logout`);

    const router = useRouter();

    const handleLogout = () => {
        console.log("logout");
        logout.mutate({onSuccess: router.push('/signup')});
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <DotsThree weight="bold" size={28}
                           className="cursor-pointer absolute top-4 right-8 rounded-full hover:bg-background-gray"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                    <Link href="/settings/edit-profile">
                        <DropdownMenuItem>
                            <Gear size={20} className="mr-2"/>
                            <span>Edit Church Profile</span>
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={handleLogout}>
                        <Church size={20} className="mr-2"/>
                        <span>See profile</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
