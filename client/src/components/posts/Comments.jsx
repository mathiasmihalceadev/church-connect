import React from 'react';
import useGetData from '@/hooks/useGetData';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui-backup/avatar';
import {formatTime, formatDate, timeSince} from '@/utils/utils';
import useServerURL from '@/hooks/useServerURL';

const Comments = ({postId}) => {
    const endpoint = `${useServerURL}/api/comments/post/${postId}`;

    const {data, isLoading, isError} = useGetData(endpoint, `comments-${postId}`);

    if (isLoading) return <div>Loading comments...</div>;
    if (isError) return <div>Error loading comments.</div>;

    return (
        <div className="comments-section mt-4">
            <h3 className="text-lg font-medium mb-2">Latest Comments</h3>
            {data.data && data.data.length > 0 ? (
                data.data.map((comment) => (
                    <div key={comment.id}
                         className="comment py-2 px-4 flex gap-2 mb-4 bg-background-gray rounded-full shadow-md">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={`http://localhost:3000${comment.profile_picture_url}`}/>
                            <AvatarFallback>{comment.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className="comment-content flex flex-col">
                            <div className="comment-header flex items-center gap-2 mb-1">
                                <p className="font-semibold text-sm">@{comment.username}</p>
                                <p className="text-sm text-gray-500">{timeSince(comment.created_at)}</p>
                            </div>
                            <p className="leading-none">{comment.comment_text}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-sm text-gray-500">No comments yet.</p>
            )}
        </div>
    );
};

export default Comments;
