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
import useGetData from "@/hooks/useGetData";
import LoadingScreen from "@/components/LoadingScreen";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import useUpdateData from "@/hooks/useUpdateData";
import usePostData from "@/hooks/usePostData";
import {Check, LoaderCircle} from "lucide-react";
import useServerURL from "@/hooks/useServerURL";

const formSchema = z.object({
    email: z.string().email(),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    username: z.string().min(1, "Username is required"),
});

export default function UpdateUserForm({userId}) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            first_name: '',
            last_name: '',
            username: '',
            role: ''
        },
    });

    const handleUsernameSuccess = (data) => {
        console.log(data.data.exists);
        if (data.data.exists) {
            form.setError("username", {
                type: "manual",
                message: "Username already exists.",
            })
            setUsernameLoading(false);
            setUsernameCorrect(false);
        } else {
            form.clearErrors();
            setUsernameLoading(false);
            setUsernameCorrect(true);
        }
    }

    const handleEmailSuccess = (data) => {
        console.log(data.data.exists);
        if (data.data.exists) {
            form.setError("email", {
                type: "manual",
                message: "Email already exists.",
            })
            setEmailCorrect(false);
            setEmailLoading(false);
        } else {
            form.clearErrors();
            setEmailLoading(false);
            setEmailCorrect(true);
        }
    }

    const userData = useGetData(`${useServerURL}/api/user/${userId}`, 'userProfile');
    const updateMutation = useUpdateData(`${useServerURL}/api/user/${userId}`);
    const [errorMessage, setErrorMessage] = useState("");
    const usernameMutation = usePostData(`${useServerURL}/api/auth/register/check-user`, handleUsernameSuccess);
    const emailMutation = usePostData(`${useServerURL}/api/auth/register/check-user`, handleEmailSuccess);

    const [usernameLoading, setUsernameLoading] = useState(false);
    const [usernameCorrect, setUsernameCorrect] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailCorrect, setEmailCorrect] = useState(false);


    useEffect(() => {
        console.log(userData.data);
        if (userData.data) {
            form.reset({
                email: userData.data.data.email,
                first_name: userData.data.data.first_name,
                last_name: userData.data.data.last_name,
                username: userData.data.data.username,
                role: userData.data.data.role,
            });
        }
    }, [userData.data, form]);

    const onSubmit = (data) => {
        if (!emailCorrect && data.email !== userData.data.data.email) {
            form.setError("email", {
                type: "manual",
                message: "Email already in use.",
            })
            return;
        }

        if (!usernameCorrect && data.username !== userData.data.data.username) {
            form.setError("username", {
                type: "manual",
                message: "Username already exists.",
            })
            return;
        }

        updateMutation.mutate(data, {
            onError: (error) => {
                console.log(error.response.data);
                setErrorMessage("Failed to update user.");
                queryClient.invalidateQueries('userProfile');
            },
            onSuccess: (data) => {
                console.log(data);
            }
        });
    };

    const handleUsernameChange = (value) => {
        form.setValue("username", value);
        if (value.length >= 5 && value !== userData.data.data.username) {
            setUsernameLoading(true);
            usernameMutation.mutate({data: value, columnName: "username"});
        } else {
            setUsernameLoading(false);
            setUsernameCorrect(false);
        }
    };

    const handleEmailChange = (value) => {
        form.setValue("email", value);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value) && value !== userData.data.data.email) {
            setEmailLoading(true);
            emailMutation.mutate({data: value, columnName: "email"});
        } else {
            setEmailLoading(false);
            setEmailCorrect(false);
        }
    }

    if (userData.isLoading) {
        return <LoadingScreen/>;
    }

    if (userData.isError) {
        return <p>Error loading user data</p>;
    }

    return (
        <main>
            <section className="text-lead-gray tracking-tight">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder="John_Doe" {...field}
                                                   onChange={(e) => handleEmailChange(e.target.value)}/>
                                            {emailLoading &&
                                                <LoaderCircle size={24}
                                                              className="animate-spin absolute top-[9px] right-4"
                                                              strokeWidth={1.5}/>}
                                            {emailCorrect &&
                                                <Check size={24} className="animate-pulse absolute top-[9px] right-4"
                                                       strokeWidth={1.5}/>}
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="last_name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder="John_Doe" {...field}
                                                   onChange={(e) => handleUsernameChange(e.target.value)}/>
                                            {usernameLoading &&
                                                <LoaderCircle size={24}
                                                              className="animate-spin absolute top-[9px] right-4"
                                                              strokeWidth={1.5}/>}
                                            {usernameCorrect &&
                                                <Check size={24} className="animate-pulse absolute top-[9px] right-4"
                                                       strokeWidth={1.5}/>}
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>

                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <Input disabled placeholder="JohnDoe" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-48 gap-2 tracking-normal">
                            Update
                            <ArrowRight size={20}/>
                        </Button>
                    </form>
                </Form>
                {updateMutation.isPending && <LoadingScreen/>}
                {updateMutation.isError && <p className="text-rose-red mt-2">{errorMessage}</p>}
            </section>
        </main>
    );
}
