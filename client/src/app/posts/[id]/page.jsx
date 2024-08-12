"use client";

import React from 'react';
import {useParams} from 'next/navigation';
import useGetData from '@/hooks/useGetData';
import SinglePost from '@/components/posts/SinglePost';
import useServerURL from '@/hooks/useServerURL';
import LoadingScreen from "@/components/LoadingScreen";
import Header from "@/components/Header";
import Toolbar from "@/components/Toolbar";
import Sidebar from "@/components/Sidebar";

const SinglePostPage = () => {
    const {id} = useParams(); // Get the post ID from the URL
    const endpoint = `${useServerURL}/api/post/${id}`;

    const {data, isLoading, isError} = useGetData(endpoint, `post-${id}`);

    if (isLoading) {
        return <div><LoadingScreen/></div>;
    }

    if (isError) {
        return <div>Error loading post.</div>;
    }

    return (
        <div className="flex h-screen bg-white">
            <Sidebar/>
            <div className="flex-1 flex flex-col bg-white p-0 overflow-hidden">
                <Header/>
                <main className="flex-1 overflow-y-auto pb-24">
                    <div className="max-w-[800px] mx-auto px-4">
                        {data ? (
                            <SinglePost post={data.data}/>
                        ) : (
                            <p className="text-center text-gray-500 mt-8">Post not found.</p>
                        )}
                    </div>
                </main>
            </div>
            <Toolbar/>
        </div>
    );
};

export default SinglePostPage;
