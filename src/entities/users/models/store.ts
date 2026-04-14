import { defineStore } from "pinia";
import { getMyProfile } from "../api/profile";

export const useUserStore = defineStore('users', {
    state: () => ({
        myProfile: {}
    }),

    actions: {
        async fetchProfile () {
            this.myProfile = await getMyProfile();
        }
    }
})