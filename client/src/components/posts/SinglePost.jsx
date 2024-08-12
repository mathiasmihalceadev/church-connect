import React, {useState, useEffect} from 'react';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui-backup/avatar';
import {CalendarBlank, PaperPlaneTilt} from '@phosphor-icons/react';
import {Button} from '@/components/ui-backup/button';
import {formatDate, formatTime, timeSince} from '@/utils/utils';
import usePostData from '@/hooks/usePostData';
import useDeleteData from '@/hooks/useDeleteData';
import useGetData from '@/hooks/useGetData';
import {useQueryClient} from '@tanstack/react-query';
import UserInteractions from '@/components/posts/UserInteractions';
import {Textarea} from '@/components/ui-backup/textarea';
import Comments from './Comments';
import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen"; // Add this import

const SinglePost = ({post}) => {
    const {loggedIn, user, userId, loading} = useAuth();
    const router = useRouter();

    if (loading) {
        return <LoadingScreen/>;
    }

    if (!loggedIn) {
        router.push("/signup");
    }

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
    const [commentText, setCommentText] = useState('');

    const interactionSuccess = () => {
        setHasInteracted(true);
        console.log('Add');
        queryClient.invalidateQueries([`interaction-${id}`]);
    };

    const unInteractionSuccess = () => {
        setHasInteracted(false);
        console.log('Delete');
        queryClient.invalidateQueries([`interaction-${id}`]);
    };

    const {mutate: interact} = usePostData('http://localhost:3000/api/interactions', interactionSuccess);
    const {mutate: uninteract} = useDeleteData('http://localhost:3000/api/interactions', unInteractionSuccess);
    const {mutate: postComment} = usePostData(`http://localhost:3000/api/comments/post/${id}`,
        () => {
            queryClient.invalidateQueries([`comments-${id}`]);
            setCommentText('');
            console.log("Hello!");
        });

    const {
        data: interactionData,
        isLoading,
        error
    } = useGetData(`http://localhost:3000/api/interactions/${userId}/${id}`, `interaction-${id}`);

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

    const handleCommentSubmit = () => {
        if (commentText.trim() === '') return;
        postComment({userId, comment_text: commentText});
    };

    const textWithLineBreaks = text.split('\n').map((line, index) => (
        <React.Fragment key={index}>
            {line}
            <br/>
        </React.Fragment>
    ));

    if (isLoading) return <div>Loading...</div>;
    if (error && error.response && error.response.status !== 404) return <div>Error: {error.message}</div>;

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm tracking-tight">
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
            <div className="post-content mt-4 font-medium tracking-tight">
                {textWithLineBreaks}
            </div>
            {post_type_name === 'Event' && (
                <div className="mt-4">
                    <div className="text-hyacinth-arbor font-medium flex items-center gap-2">
                        <CalendarBlank size={24}/>
                        <p>{`${formatDate(date_start)} from ${formatTime(time_start)} to ${formatTime(time_end)}`}</p>
                    </div>
                </div>
            )}
            <div className="mt-4">
                {isLoading ? <div>Loading...</div> :
                    <div className="flex justify-between items-center post-footer">
                        <UserInteractions postId={post.id}/>
                        <Button
                            size="sm"
                            className={`tracking-normal ${hasInteracted ? 'bg-lila-purple text-dark-slate' : 'bg-royal-blue'}`}
                            onClick={handleToggleInteraction}
                        >
                            {hasInteracted ? "I won't be there" : 'I will be there'}
                        </Button>
                    </div>
                }
            </div>
            <div className="mt-8">
                <h2 className="mb-2 text-xl font-semibold">Write a Comment</h2>
                <div className="flex flex-col gap-2 w-full items-end space-x-2">
                    <Textarea
                        className="min-h-[120px]"
                        type="text"
                        placeholder="Write some thoughts on this..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button type="submit" size="sm" onClick={handleCommentSubmit}><PaperPlaneTilt/></Button>
                </div>
                <div><Comments postId={post.id}/></div>
            </div>
        </div>
    );
};

export default SinglePost;
