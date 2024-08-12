"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm, useWatch} from "react-hook-form";
import {z} from "zod";
import {ArrowRight} from "@phosphor-icons/react";

import {Button} from "@/components/ui-backup/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui-backup/form";
import {Input} from "@/components/ui-backup/input";
import {Textarea} from "@/components/ui-backup/textarea"; // Assuming there is a Textarea component
import {Calendar} from "@/components/ui-backup/calendar"; // Assuming there is a Calendar component
import TimePicker from "@/components/ui-backup/time-picker"; // Assuming there is a TimePicker component

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui-backup/select";
import usePostData from "@/hooks/usePostData";
import LoadingScreen from "@/components/LoadingScreen";
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/useAuth";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui-backup/popover";
import {CalendarBlank} from "@phosphor-icons/react";
import {format} from "date-fns";
import {cn} from "@/lib/utils";
import Header from "@/components/Header";
import React from "react";
import Toolbar from "@/components/Toolbar";
import {format as formatDateFns} from 'date-fns';
import useServerURL from "@/hooks/useServerURL";
import Sidebar from "@/components/Sidebar";

const formSchema = z.object({
    post_type_name: z.string(),
    title: z.string().min(2, {
        message: "Post name must be at least 2 characters.",
    }),
    text: z.string().min(10, {
        message: "Post text must be at least 10 characters.",
    }),
    date_start: z.date().optional(),
    date_end: z.date().optional(),
    time_start: z.string().optional(),
    time_end: z.string().optional(),
});

export default function CreatePostForm() {
    const {loggedIn, user, userId, loading} = useAuth();
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            post_type_name: "",
            title: "",
            text: "",
        },
    });

    const {control, handleSubmit} = form;
    const postType = useWatch({control, name: "post_type_name"});
    const handleCreateSuccess = () => {
        router.push("/home");
    };
    const createMutation = usePostData(
        `${useServerURL}/api/posts/${userId}`,
        handleCreateSuccess
    );

    if (loading) {
        return <LoadingScreen/>;
    }

    if (!loggedIn) {
        router.push("/signup");
    }


    const onSubmit = (data) => {
        const formatDate = (date) => formatDateFns(date, 'yyyy-MM-dd');
        const formatTime = (time) => {
            const [timeString, period] = time.split(' ');
            let [hours, minutes] = timeString.split(':').map(Number);

            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
        };

        const formattedData = {
            ...data,
            date_start: data.date_start ? formatDate(data.date_start) : null,
            date_end: data.date_end ? formatDate(data.date_end) : null,
            time_start: data.time_start ? formatTime(data.time_start) : null,
            time_end: data.time_end ? formatTime(data.time_end) : null,
        };

        console.log(formattedData);
        createMutation.mutate(data);
    };

    return (
        <div className="flex h-screen bg-background-gray">
            <Sidebar/>
            <div className="flex-1 flex flex-col overflow-hidden bg-white p-0">
                <Header/>
                <main className="overflow-y-auto flex-1 tracking-tight">
                    <div className="px-8 pb-24 max-w-[1000px] mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-semibold pt-6 tracking-tight mb-2">Create a New Post</h1>
                            <p className="font-medium">Add a new post on the main feed.</p>
                        </div>
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={control}
                                    name="post_type_name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Post Type</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select post type"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Event">Event</SelectItem>
                                                    <SelectItem value="Announcement">Announcement</SelectItem>
                                                    <SelectItem value="Post">Post</SelectItem>
                                                    <SelectItem value="Devotional">Devotional</SelectItem>
                                                    <SelectItem value="Sermon">Sermons</SelectItem>
                                                    <SelectItem value="Prayer Requests">Prayer Requests</SelectItem>
                                                    <SelectItem value="Ministry Update">Ministry Update</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="title"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Post Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter post name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="text"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Post Text</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter post text" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                {(postType === "Event" || postType === "Announcement" || postType === "Sermon") && (
                                    <FormField
                                        control={control}
                                        name="time_start"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Start Time</FormLabel>
                                                <FormControl>
                                                    <TimePicker {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                )}
                                {(postType === "Event" || postType === "Announcement") && (
                                    <FormField
                                        control={control}
                                        name="time_end"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>End Time</FormLabel>
                                                <FormControl>
                                                    <TimePicker {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                )}
                                {(postType === "Event" || postType === "Announcement") && (
                                    <FormField
                                        control={control}
                                        name="date_end"
                                        render={({field}) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Start Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                size={"md"}
                                                                className={cn(
                                                                    "w-[240px] pl-3 text-left",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarBlank className="ml-auto h-4 w-4"/>
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                )}
                                {(postType === "Event" || postType === "Announcement" || postType === "Sermon") && (
                                    <FormField
                                        control={control}
                                        name="date_start"
                                        render={({field}) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>End Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                size={"md"}
                                                                className={cn(
                                                                    "w-[240px] pl-3 text-left",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarBlank className="ml-auto h-4 w-4"/>
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                )}
                                <Button
                                    type="submit"
                                    className="gap-2 tracking-normal w-44"
                                >
                                    Create Post
                                    <ArrowRight size={20}/>
                                </Button>
                                {createMutation.isPending && <LoadingScreen/>}
                                {createMutation.isError && (
                                    <p className="mt-2 text-rose-red">
                                        Error posting data. Try again later.
                                    </p>
                                )}
                            </form>
                        </Form>
                    </div>
                </main>
            </div>
            <Toolbar/>
        </div>
    );
}
