import {useState, useEffect} from 'react';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui-backup/avatar";
import {CalendarBlank, HandsPraying, X} from "@phosphor-icons/react";
import {Button} from "@/components/ui-backup/button";
import {formatDate, formatTime, timeSince} from "@/utils/utils";
import usePostData from "@/hooks/usePostData";
import useDeleteData from "@/hooks/useDeleteData";
import useGetData from "@/hooks/useGetData";
import {useQueryClient} from '@tanstack/react-query';
import UserInteractions from "@/components/posts/UserInteractions";
import Link from "next/link";

export default function Post({post, userId, role}) {


    const {
        id,
        profile_picture_url,
        post_type_name,
        title,
        username,
        text,
        date_start,
        date_end,
        created_at,
        time_start,
        time_end
    } = post;

    const queryClient = useQueryClient();
    const [hasInteracted, setHasInteracted] = useState(false);

    const interactionSuccess = () => {
        setHasInteracted(true);
        queryClient.invalidateQueries([`interaction-${id}`]);
    };

    const unInteractionSuccess = () => {
        setHasInteracted(false);
        queryClient.invalidateQueries([`interaction-${id}`]);
    };

    const {mutate: interact} = usePostData('http://localhost:3000/api/interactions', interactionSuccess);
    const {mutate: uninteract} = useDeleteData('http://localhost:3000/api/interactions', unInteractionSuccess);

    const {
        data: interactionData,
        isLoading,
        error
    } = useGetData(`http://localhost:3000/api/interactions/${userId}/${id}`, `interaction-${id}`);

    const deleteSuccess = () => {
        queryClient.invalidateQueries('posts');
    };

    const {mutate: deletePost} = useDeleteData(`http://localhost:3000/api/posts/${id}`, deleteSuccess);

    useEffect(() => {
        if (interactionData && interactionData.data) {
            setHasInteracted(true);
        } else {
            setHasInteracted(false);
        }
    }, [interactionData]);

    const handleToggleInteraction = () => {
        if (hasInteracted) {
            uninteract({
                userId: userId,
                postId: id,
                interactionType: 'like'
            });
        } else {
            interact({
                userId: userId,
                postId: id,
                interactionType: 'like'
            });
        }
    };

    const handleDelete = () => {
        deletePost();
    };

    if (isLoading) return <div>Loading...</div>;
    if (error && error.response && error.response.status !== 404) return <div>Error: {error.message}</div>;

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-light-gray tracking-tight">
            <div className="flex items-start justify-between">
                <div className="flex gap-2 post-header">
                    <div>
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={`http://localhost:3000${profile_picture_url}`}/>
                            <AvatarFallback>{username[0]}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <p className="font-medium leading-tight py-1 px-2 bg-royal-blue text-white rounded-full inline-flex text-sm">{post_type_name}</p>
                        <h3 className="text-2xl font-semibold mt-1 tracking-tight">{title}</h3>
                        <p className="text-sm leading-tight text-hyacinth-arbor tracking-tight">Posted {timeSince(created_at)} by <span
                            className="font-bold">@{username}</span></p>
                    </div>
                </div>
                {role === "admin" &&
                    <div>
                        <Button size="sm" className="p-1" onClick={handleDelete}><X/></Button>
                    </div>
                }
            </div>
            <div className="post-content mt-4 font-medium tracking-tight cursor-pointer">
                <Link href={`posts/${id}`}>
                    <p>
                        {text.split(' ').length > 60
                            ? text.split(' ').slice(0, 60).join(' ') + '...'
                            : text}
                    </p>
                </Link>
            </div>
            {post_type_name === 'Event' &&
                <div className="mt-4">
                    <div className="text-hyacinth-arbor font-medium flex items-center gap-2">
                        <CalendarBlank size={24}/>
                        <p>{`${formatDate(date_start)} from ${formatTime(time_start)} to ${formatTime(time_end)}`}</p>
                    </div>
                </div>
            }
            <div className="mt-4">
                {isLoading ? <div>Loading...</div> :
                    <div className="flex justify-between items-center post-footer">
                        <UserInteractions postId={post.id}/>
                        {(post.post_type_name === 'Event' || post.post_type_name === 'Service') &&
                            <Button
                                size="sm"
                                className={`tracking-normal ${hasInteracted ? 'bg-lila-purple text-dark-slate' : 'bg-royal-blue'}`}
                                onClick={handleToggleInteraction}
                            >
                                {hasInteracted ? "I won't be there" : 'I will be there'}
                            </Button>}
                        {(post.post_type_name === 'Prayer Request' || post.post_type_name === 'Announcement' || post.post_type_name === 'Devotional') &&
                            <HandsPraying size={56}
                                          className={`cursor-pointer rounded-full p-2 ${hasInteracted ? 'bg-lila-purple text-dark-slate' : 'text-royal-blue hover:bg-background-gray'}`}
                                          onClick={handleToggleInteraction}/>}
                    </div>
                }
            </div>
        </div>
    );
}
