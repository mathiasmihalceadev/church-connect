"use client";

import AuthProvider from "@/hooks/useAuth";
import Home from "@/app/home/page";

const App = () => {
    return (
        <AuthProvider>
            <Home/>
        </AuthProvider>
    );
}

export default App;
