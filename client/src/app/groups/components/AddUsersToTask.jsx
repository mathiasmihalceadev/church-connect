"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
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
import usePostData from "@/hooks/usePostData";
import LoadingScreen from "@/components/LoadingScreen";
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
import useServerURL from "@/hooks/useServerURL";
import {Plus} from "@phosphor-icons/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui-backup/dialog";
import {ScrollArea} from "@/components/ui-backup/scroll-area";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui-backup/avatar";

const formSchema = z.object({
    usernames: z.array(z.string()).nonempty({
        message: "Select at least one user.",
    }),
});

export default function AddUsersToTask({taskId, groupId}) {
    const serverURL = useServerURL;
    const router = useRouter();
    const {
        data,
        isLoading
    } = useGetData(`${serverURL}/api/group/${groupId}/task/${taskId}/unassigned-users`, `unassigned-users-${taskId}-${groupId}`);
    const queryClient = useQueryClient();

    const [isOpen, setIsOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            usernames: [],
        },
    });

    const {reset} = form;

    const handleCreateSuccess = () => {
        queryClient.invalidateQueries(`task-users-${taskId}`);
        reset();
        setIsOpen(false);
    };

    const createMutation = usePostData(
        `${serverURL}/api/task/${taskId}/users-by-username`,
        handleCreateSuccess
    );

    const onSubmit = (data) => {
        const combinedData = {
            usernames: data.usernames
        };
        createMutation.mutate(combinedData);
    };

    if (isLoading) return (<div><LoadingScreen/></div>);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} className="tracking-tight">
            <DialogTrigger asChild>
                <div className="flex items-center gap-1 cursor-pointer">
                    <div className="flex -space-x-2">
                        <Button size="sm" className="p-1 rounded-full">
                            <Plus weight="bold"/>
                        </Button>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Users to Task</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-96">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-2">
                            <FormField
                                control={form.control}
                                name="usernames"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Assign Users</FormLabel>
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
                                                        placeholder="Select one or more users"
                                                    />
                                                </MultiSelectorTrigger>
                                                <MultiSelectorContent>
                                                    <MultiSelectorList>
                                                        {data.data.users.map((user, i) => (
                                                            <MultiSelectorItem key={i} value={user.username}>
                                                                <div className="flex items-center gap-1">
                                                                    <Avatar className="w-8 h-8 mr-2">
                                                                        {user.profile_picture_url ? (
                                                                            <AvatarImage
                                                                                src={`http://localhost:3000${user.profile_picture_url}`}
                                                                            />
                                                                        ) : (
                                                                            <AvatarFallback>{user.first_name.charAt(0)}{user.last_name.charAt(0)}</AvatarFallback>
                                                                        )}
                                                                    </Avatar>
                                                                    {user.first_name} {user.last_name} (@{user.username})
                                                                </div>
                                                            </MultiSelectorItem>
                                                        ))}
                                                    </MultiSelectorList>
                                                </MultiSelectorContent>
                                            </MultiSelector>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                size="sm"
                                disabled={createMutation.isLoading}
                            >
                                {createMutation.isLoading ? (
                                    <>
                                        <LoaderCircle size={20} className="animate-spin"/>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        Add Users
                                        <ArrowRight size={20}/>
                                    </>
                                )}
                            </Button>
                            {createMutation.isLoading && <LoadingScreen/>}
                            {createMutation.isError && (
                                <p className="mt-2 text-rose-red">
                                    Error posting data. Try again later.
                                </p>
                            )}
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
