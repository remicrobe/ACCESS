import create from "zustand";
import $axios from "../plugins/axios";

export const useUserStore = create((set) => ({
    userData: null,
    setUserData: (newData) => set({ userData: newData }),
    getUserData: () => {
        return new Promise((resolve, reject) => {
            $axios.get(`collab/infoCollab`)
                .then((res) => {
                    set({ userData: res.data });
                    resolve(true);
                })
                .catch((err) => {
                    console.error(err);
                    resolve(false);
                });
        });
    },
    userAbsenceData: null,
    setUserAbsenceData: (newData) => set({ userAbsenceData: newData }),
    getUserAbsenceData: () => {
        return new Promise((resolve, reject) => {
            $axios.get(`absence/mesAbsences`)
                .then((res) => {
                    set({ userAbsenceData: res.data });
                    resolve(res.data);
                })
                .catch((err) => {
                    resolve(false);
                });
        });
    }
}));