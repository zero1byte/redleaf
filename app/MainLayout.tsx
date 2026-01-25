'use client';
import useAuthUserStore, { useUserStore } from '@/store/useUserStore';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface MainLayoutProps {
    children: React.ReactNode;
}
export const MainLayout = ({ children }: MainLayoutProps) => {
    //check user is logged 
    const { user: AuthUser } = useAuthUserStore();
    const { user: loggedUser } = useUserStore();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const route = useRouter();
    useEffect(() => {
        if(!AuthUser&& !loggedUser)return;
        if (AuthUser) {
            setIsUserLoggedIn(true);
        }
        //if user is logged and username is null
        if (AuthUser && loggedUser && loggedUser.username == null) {
            route.push('/onboarding');
        }
    }, [AuthUser, loggedUser]);

    return (
        <div className="min-h-screen">
            <div>
                {children}
            </div>
        </div>
    );
}