"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
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
import {Textarea} from "@/components/ui-backup/textarea";

import usePostData from "@/hooks/usePostData";
import LoadingScreen from "@/components/LoadingScreen";
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/useAuth";
import Header from "@/components/Header";
import React from "react";
import Toolbar from "@/components/Toolbar";
import useServerURL from "@/hooks/useServerURL";
import Sidebar from "@/components/Sidebar";

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Post name must be at least 2 characters.",
    }),
    text: z.string().min(10, {
        message: "Post text must be at least 10 characters.",
    }),
});

export default function CreatePrayerRequestForm() {
    const {loggedIn, user, userId, loading} = useAuth();
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            text: "",
        },
    });

    const {control, handleSubmit} = form;
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
        const formattedData = {
            ...data,
            post_type_name: "Prayer Request",
        };

        console.log(formattedData);
        createMutation.mutate(formattedData);
    };

    return (
        <div className="flex h-screen bg-background-gray">
            <Sidebar/>
            <div className="flex-1 flex flex-col overflow-hidden bg-white p-0">
                <Header/>
                <main className="overflow-y-auto flex-1 tracking-tight">
                    <div className="px-8 pb-24 max-w-[1000px] mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-semibold pt-6 tracking-tight mb-2">Create a New Prayer
                                Request</h1>
                            <p className="font-medium">Add a new prayer request on the main feed.</p>
                        </div>
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={control}
                                    name="title"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Prayer Request</FormLabel>
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
                                            <FormLabel>Details about you request.</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter post text" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="gap-2 tracking-normal "
                                >
                                    Create Prayer Request
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
