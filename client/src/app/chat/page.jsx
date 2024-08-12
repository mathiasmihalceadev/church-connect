"use client";

import React, {useEffect, useState} from 'react';
import {StreamChat} from 'stream-chat';
import {Chat, Channel, ChannelHeader, MessageList, MessageInput, Window} from 'stream-chat-react';
// import 'stream-chat-react/dist/css/index.css';
import {useRouter, useSearchParams} from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import 'stream-chat-react/dist/css/v2/index.css';
import './page.css'
import LoadingScreen from "@/components/LoadingScreen";


const ChatPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const streamToken = searchParams.get('streamToken');
    const userId = searchParams.get('userId');
    const username = searchParams.get('username');
    const groupName = searchParams.get('groupName');
    const userAvatar = searchParams.get('userAvatar');

    const [chatClient, setChatClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initChat = async () => {
            if (!streamToken || !userId) {
                router.push('/');
                return;
            }

            try {
                const client = StreamChat.getInstance('hz2xyte2s5ug');

                const avatarUrl = `http://localhost:3000${userAvatar}`;

                await client.connectUser({
                    id: username,
                    name: username,
                    image: avatarUrl
                }, streamToken);

                const channel = client.channel('messaging', groupName.toLowerCase(), {
                    name: groupName,
                });

                // Add the current user to the channel members if not already a member
                const channelState = await channel.watch();
                if (!channelState.members[username]) {
                    await channel.addMembers([username]);
                }

                setChatClient(client);
                setChannel(channel);
                setLoading(false);
            } catch (err) {
                console.error('Error initializing chat:', err);
                setError('Failed to initialize chat');
                setLoading(false);
            }
        };

        initChat();
    }, [streamToken, userId, username, router]);

    if (loading) return <div><LoadingScreen/></div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="flex h-screen bg-background-gray">
            <Sidebar/>
            <div className="flex-1 overflow-hidden bg-white p-0">
                <Header/>
                <main className="overflow-y-auto max-w-[1000px] mx-auto">
                    <div className="px-8 church-connect-chat">
                        <Chat client={chatClient} theme='messaging light'>
                            <Channel channel={channel}>
                                <Window>
                                    <ChannelHeader/>
                                    <MessageList/>
                                    <MessageInput/>
                                </Window>
                            </Channel>
                        </Chat>
                    </div>
                </main>
            </div>
        </div>

    );
};

export default ChatPage;
