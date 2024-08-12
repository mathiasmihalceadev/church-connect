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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui-backup/select"

import {useState} from "react";
import {Textarea} from "@/components/ui-backup/textarea";

// Define the form schema
const formSchema = z.object({
    congregation: z.string(),
    history: z.string()
});

export default function SignupChurchSecondForm({passData}) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            congregation: "",
            history: ""
        },
    });

    const onSubmit = (data) => {
        console.log("Form Data: ", data);
        passData(data);
    };

    return (
        <div>
            <div className="flex gap-2 mb-6">
                <div className="h-3 rounded-full bg-royal-blue flex-1"></div>
                <div className="h-3 rounded-full bg-royal-blue flex-1"></div>
                <div className="h-3 rounded-full bg-lila-purple flex-1"></div>
            </div>
            <TitleSubtitle title="We want to know more about you"
                           subtitle="Please complete all the necessary data."></TitleSubtitle>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="congregation"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Denomination</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="How many people are in your church?"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="50-100">50-100 people</SelectItem>
                                        <SelectItem value="100-200">100-200 people</SelectItem>
                                        <SelectItem value="200-500">200-500 people</SelectItem>
                                        <SelectItem value="500-1000">500-1000 people</SelectItem>
                                        <SelectItem value="1000-2500">1000-2500 people</SelectItem>
                                        <SelectItem value="2500-1000">2500-1000 people</SelectItem>
                                        <SelectItem value="10 000-25 000">10 000-25 000 people</SelectItem>
                                        <SelectItem value="25 000+">25 000+ people</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="history"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>The church vision and history</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us a little bit about this church"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full gap-2 tracking-normal">Sign up<ArrowRight
                        size={20}/></Button>
                </form>
            </Form>
        </div>
    );
}
