// components/RecordAttendance.js
"use client";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import React, {useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {Button} from "@/components/ui-backup/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui-backup/form";
import {Input} from "@/components/ui-backup/input";
import usePostData from "@/hooks/usePostData";
import LoadingScreen from "@/components/LoadingScreen";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui-backup/select";
import {ScrollArea} from "@/components/ui-backup/scroll-area";
import {useAuth} from "@/hooks/useAuth";
import useGetData from "@/hooks/useGetData";
import useServerURL from "@/hooks/useServerURL";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {useToast} from "@/components/ui/use-toast"; // Import the useToast hook

const formSchema = z.object({
    postId: z.string().nonempty("Please select an event."),
    userValidationCode: z.string().min(5, "Validation code must be at least 5 characters."),
});

const useGetEvents = () => {
    const serverURL = useServerURL;
    const {userId} = useAuth();
    const endpoint = userId ? `${serverURL}/api/events/${userId}` : null;
    return useGetData(endpoint, `events-${userId}`, {enabled: !!userId});
};

export default function RecordAttendance() {
    const {data: events, isLoading} = useGetEvents();
    const queryClient = useQueryClient();
    const {toast} = useToast(); // Initialize the useToast hook
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            postId: "",
            userValidationCode: "",
        },
    });

    const {control, handleSubmit, watch} = form;
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleSuccess = () => {
        queryClient.invalidateQueries('attendance');
        form.reset();
        toast({
            title: "Attendance recorded successfully.",
            className: "text-xl text-lead-gray font-medium tracking-tight",
        });
        form.reset();
    };

    const postMutation = usePostData(`${useServerURL}/api/attendance`, handleSuccess);

    const onSubmit = (data) => {
        postMutation.mutate(data);
    };

    const handleValueChange = (newValue) => {
        const event = events?.data?.events?.find((event) => event.id === newValue);
        if (event) {
            setSelectedEvent(event);
        }
    };

    if (isLoading) return <LoadingScreen/>;

    return (
        <div className="flex h-screen bg-background-gray">
            <Sidebar/>
            <div className="flex-1 flex flex-col overflow-hidden bg-white p-0">
                <Header/>
                <main className="overflow-y-auto flex-1 tracking-tight">
                    <div className="px-8 pb-24 max-w-[1000px] mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-semibold pt-6 tracking-tight mb-2">Keep attendance here</h1>
                            <p className="font-medium">Select the user and enter the validation code for keeping
                                attendance.</p>
                        </div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="postId"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Event</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={(value) => {
                                                    field.onChange(value);
                                                    handleValueChange(value);
                                                }} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue>
                                                            {selectedEvent ? `${selectedEvent.title} (${new Date(selectedEvent.date_start).toLocaleDateString()})` : "Select an event"}
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {events?.data?.events?.map((event) => (
                                                            <SelectItem key={event.id} value={event.id}>
                                                                {event.title} ({new Date(event.date_start).toLocaleDateString()})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="userValidationCode"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Validation Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter validation code" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={postMutation.isLoading}>
                                    {postMutation.isLoading ? "Submitting..." : "Record Attendance"}
                                </Button>
                                {postMutation.isError && (
                                    <p className="mt-2 text-red-600">Error recording attendance. Try again later.</p>
                                )}
                            </form>
                        </Form>
                    </div>
                </main>
            </div>
        </div>
    );
}
