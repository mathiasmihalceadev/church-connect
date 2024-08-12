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
import {LoaderCircle} from "lucide-react";
import {Check} from "lucide-react";
import useServerURL from "@/hooks/useServerURL";

const formSchema = z.object({
    firstName: z.string().min(2, {
        message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    username: z.string().min(5, {
        message: "Last name must be at least 5 characters.",
    }),
    email: z.string().email({
        message: "Email must be a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    })
});


export default function CreateAdminUser({churchId, passData}) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });


    const handleCreateSuccess = () => {
        passData();
    }

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

    const createMutation = usePostData(`${useServerURL}/api/auth/register-admin`, handleCreateSuccess);
    const usernameMutation = usePostData(`${useServerURL}/api/auth/register/check-user`, handleUsernameSuccess);
    const emailMutation = usePostData(`${useServerURL}/api/auth/register/check-user`, handleEmailSuccess);

    const [usernameLoading, setUsernameLoading] = useState(false);
    const [usernameCorrect, setUsernameCorrect] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailCorrect, setEmailCorrect] = useState(false);

    const onSubmit = (data) => {
        if (!emailCorrect) {
            form.setError("email", {
                type: "manual",
                message: "Email already in use.",
            })
            return;
        }
        if (!usernameCorrect) {
            form.setError("username", {
                type: "manual",
                message: "Username already exists.",
            })
            return;
        }
        const role = 'admin';
        const combinedData = {...data, churchId, role};
        createMutation.mutate(combinedData);
    };

    const handleUsernameChange = (value) => {
        form.setValue("username", value);
        if (value.length >= 5) {
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
        if (emailRegex.test(value)) {
            setEmailLoading(true);
            emailMutation.mutate({data: value, columnName: "email"});
        } else {
            setEmailLoading(false);
            setEmailCorrect(false);
        }
    }

    return (
        <div>
            <div className="flex gap-2 mb-6">
                <div className="h-3 rounded-full bg-royal-blue flex-1"></div>
                <div className="h-3 rounded-full bg-royal-blue flex-1"></div>
                <div className="h-3 rounded-full bg-royal-blue flex-1"></div>
            </div>
            <TitleSubtitle title="Create admin user"
                           subtitle="Please complete all the necessary data."></TitleSubtitle>
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
                        name="firstName"
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
                        name="lastName"
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
                                            <LoaderCircle size={24} className="animate-spin absolute top-[9px] right-4"
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
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="strongpassword" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>

                        )}
                    />
                    <Button type="submit" className="w-full gap-2 tracking-normal">Create User<ArrowRight
                        size={20}/></Button>
                    {createMutation.isPending && (<LoadingScreen/>)}
                    {createMutation.isError &&
                        <p className="mt-2 text-rose-red">Error posting data. Try again later.</p>}
                </form>
            </Form>

        </div>
    );
}
