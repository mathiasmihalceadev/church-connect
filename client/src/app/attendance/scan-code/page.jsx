"use client";

import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Button} from "@/components/ui-backup/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui-backup/form";
import {Input} from "@/components/ui-backup/input";
import usePostData from "@/hooks/usePostData";
import LoadingScreen from "@/components/LoadingScreen";
import useGetData from "@/hooks/useGetData";
import useServerURL from "@/hooks/useServerURL";
import {useQueryClient} from "@tanstack/react-query";
import {QrReader} from "react-qr-reader";
import {useAuth} from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui-backup/select";
import {useToast} from "@/components/ui/use-toast";

const formSchema = z.object({
    postId: z.string().nonempty("Please select an event."),
    userId: z.string().nonempty("QR data is required."),
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
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            postId: "",
            userId: "",
        },
    });

    const {toast} = useToast();

    const {control, handleSubmit, setValue} = form;
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [QrCode, setQrCode] = useState(false);

    const handleSuccess = () => {
        queryClient.invalidateQueries('attendance');
        toast({
            title: "Attendance recorded successfully.",
            className: "text-xl text-lead-gray font-medium tracking-tight",
        });
        form.reset();
    };

    const postMutation = usePostData(`${useServerURL}/api/attendance/by-user-id`, handleSuccess);

    const onSubmit = (data) => {
        console.log(data);
        setQrCode(false);
        postMutation.mutate(data);
    };

    const handleEventChange = (newValue) => {
        const event = events?.data?.events?.find((event) => event.id === newValue);
        if (event) {
            setSelectedEvent(event);
        }
    };

    const handleScan = (result) => {
        if (result && result.text) {
            const userIdMatch = result.text.match(/user_id:(\d+)/);
            if (userIdMatch) {
                const userId = userIdMatch[1];
                console.log(userId);
                setQrCode(true);
                setValue("userId", userId);
            }
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
                            <p className="font-medium">Select the event and scan the QR code for keeping attendance.</p>
                        </div>
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={control}
                                    name="postId"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Event</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={(value) => {
                                                    field.onChange(value);
                                                    handleEventChange(value);
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
                                    control={control}
                                    name="userId"
                                    render={({field}) => (
                                        <FormItem className="hidden">
                                            <FormLabel>QR Data</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Scan QR code" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <div className="max-w-lg mx-auto border-full">
                                    <QrReader
                                        onResult={(result, error) => {
                                            if (!!result) {
                                                handleScan(result);
                                            }
                                            if (!!error) {
                                                console.info(error);
                                            }
                                        }}
                                        style={{width: '100%', borderRadius: '64px'}}
                                    />

                                </div>
                                {QrCode && <div>User scanned successfully.</div>}
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
