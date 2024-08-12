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
import useServerURL from "@/hooks/useServerURL";

const formSchema = z.object({
    validation_code: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
});

export default function SignupChurchFirstForm({passData}) {
    const mutation = usePostData(`${useServerURL}/api/auth/check-validation-code`);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            validation_code: ""
        },
    });

    const onSubmit = (data) => {
        mutation.mutate(data, {
            onSuccess: (response) => {
                passData(response.data.userId);
                console.log(response.data.userId);
            }
        });
    };

    return (
        <div>
            <div className="flex gap-2 mb-6">
                <div className="h-3 rounded-full bg-royal-blue flex-1"></div>
                <div className="h-3 rounded-full bg-lila-purple flex-1"></div>
            </div>
            <TitleSubtitle title="Sign up as a member"
                           subtitle="Enter the validation code to claim your account"></TitleSubtitle>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="validation_code"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Validation Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="h6g%78bds3k9-AdC" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>

                        )}
                    />
                    <Button type="submit" className="w-full gap-2 tracking-normal">Continue<ArrowRight
                        size={20}/></Button>
                </form>
            </Form>
        </div>
    );
}
