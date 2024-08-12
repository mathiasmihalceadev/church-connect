import React, {createContext, useState, useEffect, useContext} from 'react';
import axios from 'axios';
import useServerURL from "@/hooks/useServerURL";

const AuthContext = createContext("");

const AuthProvider = ({children}) => {
    const [authState, setAuthState] = useState({
        loggedIn: false,
        user: null,
        userId: null,
        streamToken: null,
        role: null,
        userAvatar: null,
        loading: true
    });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${useServerURL}/api/auth/auth-check`, {withCredentials: true});
                console.log(response.data);
                if (response.data.loggedIn) {
                    setAuthState({
                        loggedIn: true,
                        user: response.data.user,
                        userId: response.data.user.id,
                        streamToken: response.data.streamToken,
                        username: response.data.username,
                        userAvatar: response.data.userAvatar,
                        role: response.data.role,
                        loading: false
                    });
                } else {
                    setAuthState({
                        loggedIn: false,
                        user: null,
                        userId: null,
                        streamToken: null,
                        role: null,
                        userAvatar: null,
                        loading: false
                    });
                }
            } catch (error) {
                setAuthState({
                    loggedIn: false,
                    user: null,
                    userId: null,
                    streamToken: null,
                    role: null,
                    userAvatar: null,
                    loading: false
                });
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={authState}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
