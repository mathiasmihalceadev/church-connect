import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui-backup/avatar";
import {useEffect, useState} from "react";
import useGetData from "@/hooks/useGetData";
import {useQueryClient} from "@tanstack/react-query";
import LoadingScreen from "@/components/LoadingScreen";
import {FilePond, registerPlugin} from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import useServerURL from "@/hooks/useServerURL";

registerPlugin(FilePondPluginImagePreview);

export default function EditProfilePicture({userId}) {
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);

    const {data, error, isLoading} = useGetData(`${useServerURL}/api/user/${userId}`, "userProfile");
    const queryClient = useQueryClient();

    useEffect(() => {
        if (data) {
            console.log(data);
            setProfilePictureUrl(data.data.profilePictureUrl);
        }
    }, [data]);

    if (isLoading) {
        return <LoadingScreen/>;
    }

    const qrCodeSrc = data.data.qr_code

    return (
        <div>
            <div className="flex lg:gap-12">
                <div className="flex-1 lg:flex-none">
                    <Avatar className="h-24 w-24">
                        {profilePictureUrl !== null ? (
                            <AvatarImage src={`http://localhost:3000${profilePictureUrl}`}/>
                        ) : (
                            <AvatarFallback>
                                {data.data.first_name.trim().charAt(0).toUpperCase()}
                                {data.data.last_name.trim().charAt(0).toUpperCase()}
                            </AvatarFallback>
                        )}
                    </Avatar>
                </div>
                <div className="flex-1">
                    <div className="w-24 h-24 ">
                        <FilePond
                            name="file"
                            maxFiles={1}
                            labelIdle={`<span class="filepond--label-action">Browse</span>`}
                            stylePanelLayout={"compact circle"}
                            className="filepond-circular"
                            styleLoadIndicatorPosition='center bottom'
                            styleProgressIndicatorPosition='right bottom'
                            styleButtonRemoveItemPosition='left bottom'
                            styleButtonProcessItemPosition='right bottom'
                            server={{
                                url: "http://localhost:3000",
                                process: {
                                    url: "/api/upload/profile-picture",
                                    method: "POST",
                                    withCredentials: false,
                                    headers: {},
                                    onload: (response) => {
                                        console.log(response);
                                        queryClient.invalidateQueries("userProfile");
                                    },
                                    onerror: (response) => {
                                        console.error(response);
                                    },
                                    ondata: (formData) => {
                                        formData.append("userId", userId); // Append the user ID
                                        return formData;
                                    },
                                },
                                revert: "/hooks/upload/revert",
                                restore: "/hooks/upload/restore",
                                load: "/hooks/upload/load",
                                fetch: "/hooks/upload/fetch",
                            }}
                        />
                    </div>
                </div>
                <img src={qrCodeSrc} alt="QR Code" className="max-w-48"/>
            </div>
        </div>
    )
}