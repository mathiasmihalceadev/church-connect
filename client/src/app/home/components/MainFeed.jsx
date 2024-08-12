"use client";

import React, {useState} from "react";
import useGetData from "@/hooks/useGetData";
import Post from "@/components/posts/Post";
import {Funnel, HandsPraying, Plus} from "@phosphor-icons/react";
import useServerURL from "@/hooks/useServerURL";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui-backup/dropdown-menu";

export default function MainFeed({userId, role}) {
    const [filter, setFilter] = useState('All post');

    const endpoint = `${useServerURL}/api/posts/${userId}`;

    const {data, isLoading, isError, isSuccess} = useGetData(endpoint, 'posts');

    const handleFilterChange = (filter) => {
        setFilter(filter);
    };

    const filteredPosts = filter === 'All post' ? data?.data : data?.data.filter(post => post.post_type_name === filter);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading posts.</div>;
    }

    return (
        <section className="px-4 mt-4 tracking-tight">
            <div className="lg:max-w-4xl lg:mx-auto">
                <div className="flex items-center justify-between">
                    <div
                        className="bg-white inline-flex px-4 py-2 rounded-xl font-semibold shadow-md border border-light-gray cursor-default">
                        <span>{filter + 's'}</span>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div
                                className="bg-white shadow-md border border-light-gray inline-flex px-4 py-2 rounded-xl font-semibold cursor-pointer hover:bg-lila-purple hover:text-dark-slate duration-200">
                                <Funnel size={24}/>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => handleFilterChange('All post')}>All
                                    posts</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleFilterChange('Event')}>Events</DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleFilterChange('Announcement')}>Announcements</DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleFilterChange('Devotional')}>Devotionals</DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleFilterChange('Sermon')}>Sermons</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleFilterChange('Prayer Request')}>Prayer
                                    Requests</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleFilterChange('Ministry Update')}>Ministry
                                    Updates</DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="pt-4 pb-24 flex flex-col gap-4">
                    {role === "admin" &&
                        <Link href="settings/add-post">
                            <div
                                className="bg-royal-blue py-12 rounded-2xl shadow-sm tracking-tight flex align-center justify-center hover:opacity-95 duration-200">
                                <div className="flex flex-col gap-2 items-center justify-center">
                                    <Plus size={32} weight="bold" className="text-white"/>
                                    <p className="text-white font-medium tracking-tight text-xl">Add a new post</p>
                                </div>
                            </div>
                        </Link>}
                    {(role === "member" || role === "moderator") &&
                        (<Link href="settings/add-prayer">
                            <div
                                className="bg-royal-blue py-6 rounded-2xl shadow-sm tracking-tight flex align-center justify-center hover:opacity-95 duration-200">
                                <div className="flex flex-col gap-2 items-center justify-center">
                                    <HandsPraying size={32} className="text-white"/>
                                    <p className="text-white font-medium tracking-tight text-xl">Add a new prayer
                                        request</p>
                                </div>
                            </div>
                        </Link>)
                    }
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => (
                            <Post key={post.id} post={post} userId={userId} role={role}/>
                        ))
                    ) : (
                        <p className="text-center font-medium mt-8">No posts of this type recently posted.</p>
                    )}
                </div>
            </div>
        </section>
    );
}
