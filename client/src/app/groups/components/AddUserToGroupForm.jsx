import React, {useState} from "react";
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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui-backup/select";
import usePostData from "@/hooks/usePostData";
import LoadingScreen from "@/components/LoadingScreen";
import useGetData from "@/hooks/useGetData";
import useServerURL from "@/hooks/useServerURL";

import {useQueryClient} from "@tanstack/react-query";

const formSchema = z.object({
    userId: z.string().min(1, {
        message: "Please select a user.",
    }),
});

export default function AddUserToGroupForm({groupId, passData}) {
    const serverURL = useServerURL;
    const queryClient = useQueryClient()

    const {
        data: usersNotInGroup,
        isLoading,
        isError
    } = useGetData(`${serverURL}/api/group/${groupId}/not-in-group`, `users-not-in-group-${groupId}`);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userId: "",
        },
    });

    const {control, handleSubmit, watch} = form;

    const [selectedUser, setSelectedUser] = useState(null);

    const handleAddUserSuccess = () => {
        queryClient.invalidateQueries(`users-group-${groupId}`);
    };

    const addUserMutation = usePostData(
        `${serverURL}/api/group/${groupId}/user`,
        handleAddUserSuccess
    );

    const onSubmit = (data) => {
        console.log(data);
        addUserMutation.mutate(data);
    };

    if (isLoading) {
        return <LoadingScreen/>;
    }

    if (isError) {
        return <p>Error loading users.</p>;
    }

    const handleValueChange = (newValue) => {
        const user = usersNotInGroup?.data.find((user) => user.id === newValue);
        if (user) {
            setSelectedUser(user);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-2">
                <FormField
                    control={control}
                    name="userId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Select User</FormLabel>
                            <Select onValueChange={(value) => {
                                field.onChange(value);
                                handleValueChange(value);
                            }} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue>
                                            {selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name} (@${selectedUser.username})` : "Select a user"}
                                        </SelectValue>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {usersNotInGroup?.data.map((user) => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.first_name} {user.last_name} (@{user.username})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="gap-2 tracking-normal" size="sm">
                    Add User
                    <ArrowRight size={20}/>
                </Button>
                {addUserMutation.isPending && <LoadingScreen/>}
                {addUserMutation.isError && (
                    <p className="mt-2 text-rose-red">
                        Error adding user to group. Try again later.
                    </p>
                )}
            </form>
        </Form>
    );
}
