import {X} from '@phosphor-icons/react';
import {Button} from "@/components/ui-backup/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription
} from "@/components/ui-backup/dialog";
import {useState} from "react";
import useDeleteData from "@/hooks/useDeleteData";
import {useQueryClient} from "@tanstack/react-query";
import useServerURL from "@/hooks/useServerURL";
import LoadingScreen from "@/components/LoadingScreen";

export default function DeleteTask({taskId, eventId}) {
    const [open, setOpen] = useState(false);
    const serverURL = useServerURL;
    const queryClient = useQueryClient();

    const deleteTaskMutation = useDeleteData(`${serverURL}/api/task/${taskId}`,
        () => {
            setOpen(false);
            queryClient.invalidateQueries(`tasks-${eventId}`);
        }
    );

    const handleDelete = () => {
        deleteTaskMutation.mutate();
    };

    return (
        <>
            <Button size="sm" className='p-1' onClick={() => setOpen(true)}>
                <X weight='bold'></X>
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this task?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {deleteTaskMutation.isLoading && <LoadingScreen/>}
        </>
    );
}
