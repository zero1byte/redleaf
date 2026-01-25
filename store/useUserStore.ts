// store/useUserStore.ts
import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';
import { loggedUser, StorageAuthUser } from './types';


type UserStore = {
    user: StorageAuthUser | null;
    setUser: (user: StorageAuthUser) => void;
    clearUser: () => void;
};

const useAuthUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user: StorageAuthUser) => set({ user }),
            clearUser: () => set({ user: null }),
            getAuthUser: () => { return useAuthUserStore.getState().user; }
        }),
        {
            name: 'Auth-User-Storage', // unique name for localStorage
        }
    )
);

export default useAuthUserStore;

//User storage using zustand and persist middleware
type loggedUserStore = {
    user: loggedUser | null;
    setUser: (user: loggedUser) => void;
    clearUser: () => void;
};
const useUserStore = create<loggedUserStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user: loggedUser) => set({ user }),
            clearUser: () => set({ user: null }),
        }),
        {
            name: 'loggedUser', // unique name for localStorage
        }
    )
);

export { useUserStore };