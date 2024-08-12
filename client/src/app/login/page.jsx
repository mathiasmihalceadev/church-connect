"use client";

import TitleSubtitle from '@/components/TitleSubtitle';
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
import usePostData from "@/hooks/usePostData";
import LoadingScreen from "@/components/LoadingScreen";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import SignupHeader from "@/app/signup/church/components/SignupHeader";
import useAuth from "@/hooks/useAuth.js";
import useServerURL from "@/hooks/useServerURL";
import useRedirectIfAuthenticated from "@/hooks/useRedirectIfAuthenticated";
import {useQueryClient} from "@tanstack/react-query";

const formSchema = z.object({
    identifier: z.string(),
    password: z.string()
});

export default function CreateAdminUser() {
    useRedirectIfAuthenticated();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            identifier: '',
            password: ''
        },
    });

    const queryClient = useQueryClient();

    const router = useRouter();

    const loginMutation = usePostData(`${useServerURL}/api/auth/login`);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = (data) => {
        loginMutation.mutate(data, {
            onError: (error) => {
                console.log(error.response.data);
                setErrorMessage("User not found.");
            },
            onSuccess: (data) => {
                queryClient.invalidateQueries();
                router.push("/");
            }
        });
    };

    return (
        <main className="px-8">
            <SignupHeader/>
            <section className="pt-12 pb-12 text-lead-gray tracking-tight xl:max-w-lg xl:mx-auto">
                <TitleSubtitle title="Log in"/>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email or Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="johndoe@example.com/JohnDoe" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Your Password" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full gap-2 tracking-normal">
                            Log in
                            <ArrowRight size={20}/>
                        </Button>
                    </form>
                </Form>
                {loginMutation.isPending && <LoadingScreen/>}
                {loginMutation.isError && <p className="text-rose-red mt-2">{errorMessage}</p>}
            </section>
        </main>
    );
}