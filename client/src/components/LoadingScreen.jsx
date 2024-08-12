import {LoaderCircle} from "lucide-react";

export default function LoadingScreen() {
    return (
        <div className="mt-0 z-50 fixed inset-0 bg-loader-background flex items-center justify-center backdrop-blur-sm"
             style={{marginTop: 0 + 'px'}}>
            <LoaderCircle size={48} className="animate-spin text-royal-blue" strokeWidth={1.5}/>
        </div>
    );
}