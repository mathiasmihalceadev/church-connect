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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui-backup/select"
import {Check, LoaderCircle} from "lucide-react";
import React, {useState} from "react";
import usePostData from "@/hooks/usePostData";
import useServerURL from "@/hooks/useServerURL";

const alphabeticPattern = /^[A-Za-z\s]+$/;
const numericPattern = /^[0-9]+$/;
const websitePattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-./?%&=]*)?$/;

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    handle: z.string()
        .min(6, {message: "Handle must be at least 6 characters."})
        .transform(handle => handle.startsWith('@') ? handle : '@' + handle)
        .refine(handle => handle.indexOf('@') === 0, {message: "Handle must start with '@'."})
        .refine(handle => handle.lastIndexOf('@') === 0, {message: "Handle cannot contain '@'."}),
    denomination: z.string(),
    address: z.string().min(4, {
        message: "Address must be at least 4 characters.",
    }),
    country: z.string().regex(alphabeticPattern, {
        message: "Country must contain only letters and spaces.",
    }),
    region: z.string().regex(alphabeticPattern, {
        message: "Region must contain only letters and spaces.",
    }),
    city: z.string().regex(alphabeticPattern, {
        message: "City must contain only letters and spaces.",
    }),
    postalCode: z.string().regex(numericPattern, {
        message: "Postal code must contain only numbers.",
    }),
    phoneNumber: z.string().regex(numericPattern, {
        message: "Phone number must be a valid format.",
    }),
    email: z.string().email({
        message: "Email must be a valid email address.",
    }),
    website: z.string().url().nullable().optional(),
});

export default function SignupChurchFirstForm({passData}) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            website: null
        },
    });

    const onSubmit = (data) => {
        if (!emailCorrect) {
            form.setError("email", {
                type: "manual",
                message: "Email already in use.",
            })
            return;
        }
        if (!handleCorrect) {
            form.setError("username", {
                type: "manual",
                message: "Handle already exists.",
            })
            return;
        }
        console.log("Form Data: ", data);
        passData(data);
    };

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

    const handleHandleSuccess = (data) => {
        console.log(data.data.exists);
        if (data.data.exists) {
            form.setError("handle", {
                type: "manual",
                message: "Handle already exists.",
            })
            setHandleCorrect(false);
            setHandleLoading(false);
        } else {
            form.clearErrors();
            setHandleLoading(false);
            setHandleCorrect(true);
        }
    }

    const emailMutation = usePostData(`${useServerURL}/api/register-church/check-church`, handleEmailSuccess);
    const handleMutation = usePostData(`${useServerURL}/api/register-church/check-church`, handleHandleSuccess);
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailCorrect, setEmailCorrect] = useState(false);
    const [handleLoading, setHandleLoading] = useState(false);
    const [handleCorrect, setHandleCorrect] = useState(false);

    const handleEmailChange = (value) => {
        form.setValue("email", value);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value)) {
            setEmailLoading(true);
            emailMutation.mutate({data: value, columnName: "church_email"});
        } else {
            setEmailLoading(false)
            setEmailCorrect(false);
        }
    }

    const handleHandleChange = (value) => {
        form.setValue("handle", value);
        if (value.length >= 6) {
            setHandleLoading(true);
            handleMutation.mutate({data: '@' + value, columnName: "church_handle"});
        } else {
            setHandleCorrect(false);
            setHandleLoading(false);
        }
    };

    return (
        <div>
            <div className="flex gap-2 mb-6">
                <div className="h-3 rounded-full bg-royal-blue flex-1"></div>
                <div className="h-3 rounded-full bg-lila-purple flex-1"></div>
                <div className="h-3 rounded-full bg-lila-purple flex-1"></div>
            </div>
            <TitleSubtitle title="Sign up as a church"
                           subtitle="Please complete all the necessary data."></TitleSubtitle>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Church Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="First Apostles Church" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>

                        )}
                    />
                    <FormField
                        control={form.control}
                        name="handle"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Handle</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input placeholder="@FirstApostlesChurch" {...field}
                                               onChange={(e) => handleHandleChange(e.target.value)}/>
                                        {handleLoading &&
                                            <LoaderCircle size={24}
                                                          className="animate-spin absolute top-[9px] right-4"
                                                          strokeWidth={1.5}/>}
                                        {handleCorrect &&
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
                        name="denomination"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Denomination</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a denomination from the list"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Catholic">Catholic</SelectItem>
                                        <SelectItem value="Lutheranism">Lutheranism</SelectItem>
                                        <SelectItem value="Anglicanism">Anglicanism</SelectItem>
                                        <SelectItem value="Calvinism/Reformed">Calvinism/Reformed</SelectItem>
                                        <SelectItem value="Baptist">Baptist</SelectItem>
                                        <SelectItem value="Methodism">Methodism</SelectItem>
                                        <SelectItem value="Presbyterianism">Presbyterianism</SelectItem>
                                        <SelectItem value="Pentecostalism">Pentecostalism</SelectItem>
                                        <SelectItem value="Evangelicalism">Evangelicalism</SelectItem>
                                        <SelectItem value="Eastern Orthodoxy">Eastern Orthodoxy</SelectItem>
                                        <SelectItem value="Oriental Orthodoxy">Oriental Orthodoxy</SelectItem>
                                        <SelectItem value="Latter-Day Saint movement">Latter-Day Saint movement
                                            (Mormonism)</SelectItem>
                                        <SelectItem value="Jehovah's Witnesses">Jehovah's Witnesses</SelectItem>
                                        <SelectItem value="Seventh-day Adventist Church">Seventh-day Adventist
                                            Church</SelectItem>
                                        <SelectItem value="Christian Science">Christian Science</SelectItem>
                                        <SelectItem value="Quakers">Quakers (Religious Society of
                                            Friends)</SelectItem>
                                        <SelectItem value="Others">Others</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Saint Paul Street, Number 12" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>

                        )}
                    />
                    <FormField
                        control={form.control}
                        name="country"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                    <Input placeholder="United States" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>

                        )}
                    />
                    <FormField
                        control={form.control}
                        name="region"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Region</FormLabel>
                                <FormControl>
                                    <Input placeholder="Oklahoma" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>

                        )}
                    />
                    <FormField
                        control={form.control}
                        name="city"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="Oklahoma City" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>

                        )}
                    />
                    <FormField
                        control={form.control}
                        name="postalCode"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="103456" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>

                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="+14056527139" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>

                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input placeholder="contact@firstapostleschurch.com" {...field}
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
                        name="website"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Website (optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="United States" {...field} />
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
