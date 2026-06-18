'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

// 1. Updated interface to match your login API response structure
interface UserProps {
    id: string;
    email: string;
    name: string;
    role: string;
}

// 2. Added type safety to the Context itself
interface AuthContextType {
    user: UserProps | null;
    setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
    initials: any;

}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProps | null>(null);

    useEffect(() => {
        const savedAdmin = localStorage.getItem('admin');
        if (savedAdmin) {
            try {
                // Parse and set state only if the data exists
                setUser(JSON.parse(savedAdmin));
            } catch (error) {
                console.error("Error parsing auth data:", error);
            }
        }
    }, []); 

    const fullName = user?.name;
    
        const initials = fullName
        ?.split(' ')                  
        ?.map(word => word[0])        
        ?.join('')                    
        ?.toUpperCase(); 

    return (
        <AuthContext.Provider value={{ user, setUser, initials }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthContext");
    }
    
    return context;
}
