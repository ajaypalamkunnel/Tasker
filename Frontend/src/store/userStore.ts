import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
    _id: string;
    name: string;
    email: string;
};

type AuthState = {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    tempEmail?: string | null;
};

type AuthActions = {
    login: (user: User, accessToken?: string) => void;
    logout: () => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    updateUser: (user: Partial<User>) => void;
    updateTokens: (accessToken: string) => void;
    setTempEmail: (email: string) => void
    clearTempEmail: () => void;
};

const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set) => ({
            // Initial state
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: (user, accessToken) => {
                set({
                    user,
                    accessToken,
                    isAuthenticated: true,
                    error: null,
                });
            },
            setTempEmail: (email) => set({ tempEmail: email }),
            clearTempEmail: () => set({ tempEmail: null }),
            logout: () => {
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                });
            },
            setLoading: (isLoading) => set({ isLoading }),

            setError: (error) => set({ error }),

            updateUser: (user) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...user } : null,
                }));
            },
            updateTokens: (accessToken) =>
                set(() => ({
                    accessToken,
                })),
        }),
        {
            name: "auth-storage",

            partialize: (state) => ({
                // Only persist these items
                user: state.user,
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);


export default useAuthStore