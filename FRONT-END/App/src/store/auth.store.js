import AsyncStorage from '@react-native-async-storage/async-storage';
import create from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(persist(
    (set, get) => ({
        jwtToken: null,
        setJwtToken: (token) => set({ jwtToken: token }),
        disconnect: () => set({ jwtToken: null }),
    }),
    {
        name: "auth-storage", // unique name
        getStorage: () => AsyncStorage,
    }
));

export default useAuthStore;
export { useAuthStore };