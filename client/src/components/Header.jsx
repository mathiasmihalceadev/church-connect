"use client";

import {Input} from "@/components/ui-backup/input";
import {MagnifyingGlass, User} from "@phosphor-icons/react";
import {DropdownMenuHeader} from "@/components/header/DropdownMenuHeader";
import {Button} from "@/components/ui-backup/button";
import Link from "next/link";
import {useAuth} from "@/hooks/useAuth";
import LoadingScreen from "@/components/LoadingScreen";

export default function Header() {
    const {loading, role} = useAuth();

    if (loading) return <LoadingScreen/>;

    return (
        <header
            className="text-lead-gray tracking-tight flex justify-between gap-4 items-center py-3 px-4 bg-white sticky top-0 z-40">
            <div className="md:hidden text-hyacinth-arbor font-bold">
                <p style={{lineHeight: '0.9'}}>Church <br/></p>
                <p className="text-lg" style={{lineHeight: '0.9'}}>Connect.</p>
            </div>
            <div className="flex-1">
                {/*<div className="relative max-w-[1100px] mx-auto">*/}
                {/*    <MagnifyingGlass size={24} weight="light" className="absolute top-[10px] left-[8px]"/>*/}
                {/*    <Input type="search" placeholder="Search..." className="w-full bg-background pl-10 text-sm"/>*/}
                {/*</div>*/}
                {role === 'admin' &&
                    <Button size="sm" asChild>
                        <Link href="settings/add-post">
                            Add new post
                        </Link>
                    </Button>
                }

                {(role === 'moderator' || role === 'member') &&
                    <Button size="sm" asChild>
                        <Link href="settings/add-prayer">
                            Add new prayer
                        </Link>
                    </Button>
                }
            </div>
            <div>
                <DropdownMenuHeader/>
            </div>
        </header>
    );
}
