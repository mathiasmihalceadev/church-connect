"use client";

import React, {useEffect, useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {FilePond, registerPlugin} from "react-filepond";
import "filepond/dist/filepond.min.css";
import useServerURL from "@/hooks/useServerURL";
import LoadingScreen from "@/components/LoadingScreen";
import useGetData from "@/hooks/useGetData";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui-backup/dialog";
import {Button} from "@/components/ui-backup/button";
import {Paperclip} from "@phosphor-icons/react";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

registerPlugin(FilePondPluginImagePreview);

export default function UploadPdfDialog({postId, groupId}) {
    const [files, setFiles] = useState([]);
    const serverURL = useServerURL;
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Paperclip size={36} className="p-2 bg-royal-blue text-white rounded-full"/>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload PDF</DialogTitle>
                </DialogHeader>
                <div>
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
            </DialogContent>
        </Dialog>
    );
}
