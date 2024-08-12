// hooks/useRedirectIfAuthenticated.js
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/hooks/useAuth';

const useRedirectIfAuthenticated = (redirectPath = '/') => {
    const {loggedIn, loading} = useAuth();
    const router = useRouter();
    
    useEffect(() => {
        if (!loading && loggedIn) {
            router.push(redirectPath);
        }
    }, [loggedIn, loading, router, redirectPath]);
};

export default useRedirectIfAuthenticated;
