"use client";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui-backup/avatar";
import useGetData from "@/hooks/useGetData";
import {useEffect} from "react";
import LoadingScreen from "@/components/LoadingScreen";
import ChurchProfileDropdown from "@/app/home/components/ChurchProfileDropdown";
import useServerURL from "@/hooks/useServerURL";

export default function ChurchProfile({userId}) {
    const endpoint = `${useServerURL}/api/church/${userId}`;

    const {data, isLoading, isError, isSuccess} = useGetData(endpoint, 'church');

    if (isLoading) {
        return <LoadingScreen/>;
    }

    if (isError) {
        return <div>Error loading church data. Please try again later.</div>;
    }

    const church = data.data.data;

    return (
        <section>
            <div
                className="bg-cover bg-center bg-no-repeat flex items-center justify-center text-lead-gray">
                <div
                    className="w-5/6 relative bg-white rounded-3xl flex flex-col items-center gap-4 my-8 py-4 xl:max-w-4xl tracking-tight">
                    <Avatar className="w-20 h-20">
                        <AvatarImage src={`http://localhost:3000${church.profilePictureUrl}`}/>
                        <AvatarFallback>{church.church_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                        <h1 className="font-semibold text-2xl tracking-tight">{church.church_name}</h1>
                        <p className="font-medium text-hyacinth-arbor">{church.church_handle}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold">{church.members}</p>
                        <p className="text-base">Members</p>
                    </div>
                    <ChurchProfileDropdown/>
                </div>
            </div>
        </section>
    );
}
