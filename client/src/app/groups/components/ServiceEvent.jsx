"use client";

import React, {useEffect} from "react";
import {formatDate, formatTime} from "@/utils/utils";
import {CalendarBlank, Paperclip, Plus} from "@phosphor-icons/react";
import Link from "next/link";
import useGetData from "@/hooks/useGetData";
import useServerURL from "@/hooks/useServerURL";
import Task from "@/app/groups/components/TaskList";
import {Button} from "@/components/ui-backup/button";
import AddTask from "@/app/groups/components/AddTask";
import AddResource from "@/app/groups/components/AddResource"

export default function ServiceEvent({event, groupId, userId, role}) {
    const {
        data: tasks,
        isLoading,
        isError
    } = useGetData(`${useServerURL}/api/tasks/post/${event.id}/group/${groupId}`, `tasks-${event.id}`);

    useEffect(() => {
        if (tasks) {
            console.log(event.id);
            console.log("Tasks:", tasks);
        }
    }, [tasks]);

    return (
        <div
            className="text-lead-gray py-6 px-6 duration-200 rounded-xl border shadow-md hover:shadow-none  hover:border-light-gray">
            <div
                className="flex justify-between items-start"
            >
                <div className="mb-6">
                    <Link href={`/posts/${event.id}`}>
                        <h2 className="font-medium text-2xl tracking-tight">{event.title}</h2>
                    </Link>
                    <div className="flex items-center gap-2 mt-2">
                        <p className="font-semibold uppercase text-hyacinth-arbor">{formatDate(event.date_start)}</p>
                        <p className="font-bold text-sm bg-lila-purple py-1 px-3  rounded-full shadow-sm">
                            {formatTime(event.time_start)} - {formatTime(event.time_end)}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" className="p-0">
                        <CalendarBlank size={36} className="p-2 bg-royal-blue text-white rounded-full"/>
                    </Button>
                    {/*<Button size="sm" className="p-0">*/}
                    {/*    <AddResource groupId={groupId} postId={event.id}/>*/}
                    {/*</Button>*/}
                    {role !== "member" &&
                        <AddTask eventId={event.id} groupId={groupId} userId={userId}/>
                    }
                </div>
            </div>
            <div className="tasks flex flex-col gap-4">
                {isLoading && <div>Loading tasks...</div>}
                {isError && <div>Error loading tasks.</div>}
                {tasks && tasks.data.length > 0 ? (
                    tasks.data.map(task => <Task groupId={groupId} userId={userId} eventId={event.id} key={task.id}
                                                 task={task}
                                                 role={role}/>)
                ) : (
                    !isLoading && !isError && <p>No tasks for this event.</p>
                )}
            </div>
        </div>
    );
}