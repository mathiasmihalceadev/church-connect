"use client";

import SignupHeader from "@/app/signup/church/components/SignupHeader";
import SignupChurchFirstForm from "@/app/signup/church/components/SignupChurchFirstForm";
import SignupChurchSecondForm from "@/app/signup/church/components/SignupChurchSecondForm";
import {useEffect, useState} from "react";
import usePostData from "@/hooks/usePostData"
import SignupChurchFirstCongratulationsMessage
    from "@/app/signup/church/components/SignupChurchFirstCongratulationsMessage";
import SignupChurchSecondCongratulationsMessage
    from "@/app/signup/church/components/SignupChurchSecondCongratulationsMessage"
import LoadingScreen from "@/components/LoadingScreen";
import CreateAdminUser from "@/app/signup/church/components/CreateAdminUser"
import useGetData from "@/hooks/useGetData";
import useAuth from "@/hooks/useAuth";
import useServerURL from "@/hooks/useServerURL";

export default function ProfileForm() {
    const [currentComponentIndex, setCurrentComponentIndex] = useState(0);
    const [form1Data, setForm1Data] = useState(null);
    const [combinedFormData, setCombinedFormData] = useState(null);
    const [churchId, setChurchId] = useState(1);
    const isAuth = useAuth('Signup');

    const endpoint = `${useServerURL}/api/register-church`;

    const mutation = usePostData(endpoint);

    const handleForm1Submit = (data) => {
        setForm1Data(data);
        setCurrentComponentIndex(1);
    };

    const handleForm2Submit = (data) => {
        const combinedData = {...form1Data, ...data};
        mutation.mutate(combinedData, {
            onSuccess: (response) => {
                const id = response.data.churchId;
                setChurchId(id);
                console.log("ID from response:", id);
                console.log(response);
            }
        });
        setCombinedFormData(combinedData);
    }

    const handleCongratulations1 = (arg) => {
        setCurrentComponentIndex(arg)
    }

    useEffect(() => {
        if (mutation.isSuccess) {
            setCurrentComponentIndex(2);
        }
    }, [mutation.isSuccess]);

    const handleAdminUserCreation = () => {
        setCurrentComponentIndex(4);
    }

    return (
        <main className="px-8">
            <SignupHeader/>
            <section className="pt-12 pb-12 text-lead-gray tracking-tight xl:max-w-lg xl:mx-auto">
                {currentComponentIndex === 0 && (
                    <SignupChurchFirstForm passData={handleForm1Submit}/>
                )}
                {currentComponentIndex === 1 && (
                    <SignupChurchSecondForm passData={handleForm2Submit}/>
                )}
                {currentComponentIndex === 2 && (
                    <SignupChurchFirstCongratulationsMessage passData={handleCongratulations1}/>
                )}
                {currentComponentIndex === 3 &&
                    (<CreateAdminUser churchId={churchId} passData={handleAdminUserCreation}/>)
                }
                {currentComponentIndex === 4 && (<SignupChurchSecondCongratulationsMessage/>)}
                {mutation.isPending && (<LoadingScreen/>)}
                {mutation.isError && <p className="mt-2 text-rose-red">Error posting data. Try again later.</p>}
            </section>
        </main>
    );

}

