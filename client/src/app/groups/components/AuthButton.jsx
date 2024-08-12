import React, {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/hooks/useAuth';
import {ChatsCircle} from "@phosphor-icons/react";

const AuthButton = ({name}) => {
    const {loggedIn, loading, userId, streamToken, username, userAvatar} = useAuth();
    const router = useRouter();

    const handleClick = () => {
        if (loggedIn) {
            router.push(`/chat?streamToken=${streamToken}&userId=${userId}&username=${username}&groupName=${name}&userAvatar=${userAvatar}`);
        } else {
            router.push('/signup');
        }
    };

    useEffect(() => {
        console.log(streamToken);
    }, [streamToken]);

    if (loading) {
        return <button disabled>Loading...</button>;
    }

    return (
        <div
            className="bg-royal-blue px-6 py-4 flex items-center justify-between rounded-full shadow-md mb-12 hover:shadow-none cursor-pointer"
            onClick={handleClick}>
            <p className="text-xl tracking-tight text-white font-semibold">Chat</p>
            <ChatsCircle size={28} className="text-white"/>
        </div>
    );
};

export default AuthButton;
