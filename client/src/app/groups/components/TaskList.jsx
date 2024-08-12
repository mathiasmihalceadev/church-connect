"use client";

import React, {useEffect, useState} from "react";
import {CalendarBlank} from "@phosphor-icons/react";
import {format} from "date-fns";
import TaskAvatars from "@/app/groups/components/TaskAvatars";
import DeleteTask from "@/app/groups/components/DeleteTask";
import {useAuth} from "@/hooks/useAuth";
import LoadingScreen from "@/components/LoadingScreen";
import useGetData from "@/hooks/useGetData";
import usePatchData from "@/hooks/usePatchData";
import useServerURL from "@/hooks/useServerURL";
import {useQueryClient} from "@tanstack/react-query";
import useDeleteData from "@/hooks/useDeleteData";
import usePostData from "@/hooks/usePostData";
import AddUsersToTask from "@/app/groups/components/AddUsersToTask";

const Task = ({task, eventId, userId, groupId}) => {
    const serverURL = useServerURL;
    const {role, loading} = useAuth();
    const queryClient = useQueryClient();
    const [hasSeen, setHasSeen] = useState(false);

    if (loading) {
        return <LoadingScreen/>;
    }

    const {data, isLoading, error} = useGetData(
        `${serverURL}/api/task/${task.id}/user/${userId}/seen`,
        `task-user-seen-${task.id}-${userId}`
    );

    const patchEndpoint = `${serverURL}/api/task/${task.id}/user/${userId}/seen`;
    const patchSeenMutation = usePostData(patchEndpoint, () => {
        queryClient.invalidateQueries(`task-user-seen-${task.id}-${userId}`);
    });

    const handleSeen = () => {
        patchSeenMutation.mutate({has_seen: 1});
    };

    useEffect(() => {
        if (data && data.data && data.data.isAssigned === true) {
            setHasSeen(false);
        } else {
            setHasSeen(true);
        }
    }, [data]);

    if (isLoading) {
        return <LoadingScreen/>;
    }

    if (error) {
        console.error(error);
        return null;
    }

    console.log(role);

    return (
        <div
            key={task.id}
            className="bg-background-gray px-6 py-2 rounded-full shadow-md flex items-center justify-between relative"
        >
            {!hasSeen && (
                <div
                    className="church-connect-notification w-3 h-3 rounded-full bg-royal-blue absolute top-0 left-3"></div>
            )}
            <div>
                <div className="flex items-center justify-between">
                    <h4 className="font-medium text-lg tracking-tight">{task.name}</h4>
                </div>
                <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">
                        Created by @{task.username}
                    </p>
                    <p className="font-medium text-sm">
                        {format(new Date(task.created_at), 'PPpp')}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div onClick={handleSeen}>
                    <TaskAvatars userId={userId} taskId={task.id}/>
                </div>
                {(role === "moderator" || role === "admin") && (
                    <DeleteTask eventId={eventId} taskId={task.id}/>
                )}
                {(role === "moderator" || role === "admin") && (
                    <AddUsersToTask groupId={groupId} taskId={task.id} userId/>
                )}
            </div>
        </div>
    );
};

export default Task;
