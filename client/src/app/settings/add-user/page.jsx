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
import usePostData from "@/hooks/usePostData";
import LoadingScreen from "@/components/LoadingScreen";
import React, {useState} from "react";
import {LoaderCircle, Check} from "lucide-react";
import Header from "@/components/Header";
import Toolbar from "@/components/Toolbar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui-backup/select";

import {
    MultiSelector,
    MultiSelectorTrigger,
    MultiSelectorInput,
    MultiSelectorContent,
    MultiSelectorList,
    MultiSelectorItem,
} from "@/components/ui-backup/multiselect";
import useGetData from "@/hooks/useGetData";
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/useAuth"
import useServerURL from "@/hooks/useServerURL";
import {generateString} from "@/utils/utils";
import Sidebar from "@/components/Sidebar";

const formSchema = z.object({
    first_name: z.string().min(2, {
        message: "First name must be at least 2 characters.",
    }),
    last_name: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    validation_code: z.string().min(5, {
        message: "Last name must be at least 5 characters.",
    }),
    user_role: z.string(),
    groups: z.array(z.string())
});


export default function CreateAdminUser({churchId, passData}) {
    const {loggedIn, user, userId, loading} = useAuth();
    const router = useRouter();

    if (loading) {
        return <LoadingScreen/>;
    }

    if (!loggedIn) {
        router.push("/signup");
    }

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            groups: [],
            validation_code: ""
        },
    });


    const handleCreateSuccess = () => {
        router.push("/settings");
    };

    const handleValidationSuccess = (data) => {
        if (data.data.exists) {
            form.setError("validation_code", {
                type: "manual",
                message: "Code already in use.",
            });
            setValidationCorrect(false);
            setValidationLoading(false);
        } else {
            form.clearErrors();
            setValidationLoading(false);
            setValidationCorrect(true);
        }
    };

    const createMutation = usePostData(
        `${useServerURL}/api/user`,
        handleCreateSuccess
    );
    const validationMutation = usePostData(
        `${useServerURL}/api/auth/register/check-user`,
        handleValidationSuccess
    );

    const groupsData = useGetData(`${useServerURL}/api/groups/${userId}`);

    const [validationLoading, setValidationLoading] = useState(false);
    const [validationCorrect, setValidationCorrect] = useState(false);

    const onSubmit = (data) => {
        data.validation_code = data.validation_code.replace(/\s+/g, '');
        if (validationCorrect) {
            form.setError("", {
                type: "manual",
                message: "Email already in use.",
            });
            return;
        }
        const combinedData = {...data, admin_id: userId};
        createMutation.mutate(combinedData);
    };

    const setValidationCode = () => {
        const code = generateString(23);
        form.setValue("validation_code", code);
    }

    const handleValidationChange = (value) => {
        form.setValue("validation_code", value);
        if (value.length >= 5) {
            setValidationLoading(true);
            setValidationCorrect(true);
            validationMutation.mutate({data: value, columnName: "validation_code"});
        } else {
            setValidationLoading(false);
            setValidationCorrect(false);
        }
    };

    console.log(groupsData.data);

    return (
        <div className="flex h-screen bg-background-gray">
            <Sidebar/>
            <div className="flex-1 overflow-hidden bg-white p-0">
                <Header/>
                <main className="overflow-y-auto tracking-tight max-w-[1000px] mx-auto">
                    <div className="px-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-semibold pt-6 tracking-tight mb-2">Add a new user</h1>
                            <p className="font-medium">Note that the user won't be active, until
                                he claims his account.</p>
                        </div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="validation_code"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Validation code</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="John_Doe"
                                                        {...field}
                                                        onChange={(e) =>
                                                            handleValidationChange(e.target.value)
                                                        }
                                                    />
                                                    {validationLoading && (
                                                        <LoaderCircle
                                                            size={24}
                                                            className="animate-spin absolute top-[9px] right-4"
                                                            strokeWidth={1.5}
                                                        />
                                                    )}
                                                    {validationCorrect && (
                                                        <Check
                                                            size={24}
                                                            className="animate-pulse absolute top-[9px] right-4"
                                                            strokeWidth={1.5}
                                                        />
                                                    )}
                                                </div>
                                            </FormControl>
                                            <Button type='button' onClick={setValidationCode} variant="link" size="xs">Generate
                                                strong
                                                code</Button>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                {groupsData.isLoading ? (<div>Is loading...</div>) :
                                    (<FormField
                                        control={form.control}
                                        name="groups"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Groups</FormLabel>
                                                <FormControl>
                                                    <MultiSelector
                                                        values={field.value}
                                                        onValuesChange={(selectedValues) => {
                                                            field.onChange(selectedValues);
                                                        }}
                                                        loop={false}
                                                    >
                                                        <MultiSelectorTrigger>
                                                            <MultiSelectorInput
                                                                placeholder="Select one or more groups"/>
                                                        </MultiSelectorTrigger>
                                                        <MultiSelectorContent>
                                                            <MultiSelectorList>
                                                                {groupsData.data.data.groups.map((group, i) => (
                                                                    <MultiSelectorItem key={i} value={group.name}>
                                                                        {group.name}
                                                                    </MultiSelectorItem>
                                                                ))}
                                                            </MultiSelectorList>
                                                        </MultiSelectorContent>
                                                    </MultiSelector>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />)
                                }
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
                                    name="user_role"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Role</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose the user role"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                    <SelectItem value="moderator">Moderator</SelectItem>
                                                    <SelectItem value="member">Member</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-48 gap-2 tracking-normal"
                                >
                                    Create User
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
