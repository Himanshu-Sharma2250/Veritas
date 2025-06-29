import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: false,

    checkAuth: async () => {
        set({isCheckingAuth: true});

        try {
            const res = await axiosInstance.get("/user/profile");
            console.log("Res Data : ", res.data);

            set({authUser: res.data.user});
        } catch (error) {
            console.error("Error checking auth: ", error);
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false})
        }
    },

    signup: async (data) => {
        set({isSigningUp: true});

        try {
            const res = await axiosInstance.post("/user/register", data);
            set({authUser: res.data.user});
            toast.success(res.data.message);
        } catch (error) {
            console.error("Error registering user: ", error);
            toast.error("Error in signing up")
        } finally {
            set({isSigningUp: false})
        }
    },

    verifyUser: async (token) => {
        try {
            const res = await axiosInstance.post(`/user/verify/${token}`,);
            toast.success(res.data.message);
            return true;
        } catch (error) {
            console.error("Error in Email Verification : ", error);
            toast.error("Verification failed");
            return false;
        }
    },

    login: async (data) => {
        set({isLoggingIn: true});

        try {
            const res = await axiosInstance.post("/user/login", data);
            set({authUser: res.data.user});
            toast.success(res.data.message);
        } catch (error) {
            console.error("Error in logging in ", error)
            toast.error("Error logging in")
        } finally {
            set({isLoggingIn: false});
        }
    },

    logout: async () => {
        try {
            await axiosInstance.get("/user/logout");
            set({authUser:null});
            toast.success("Logout successful")
        } catch (error) {
            console.error("Error logging out", error)
            toast.error("Error logging out")
        }
    },

    forgotPassword: async (data) => {
        try {
            const res = await axiosInstance.post("/user/forgotPassword", data);
            toast.success("Email is Send");
        } catch (error) {
            console.error("Error in forgot password: ", error);
            toast.error("try again");
        }
    },

    resetPassword: async (token, passwords) => {
        try {
            const res = await axiosInstance.post(`/user/resetPassword/${token}`, passwords);
            toast.success("Password reset Successfully");
        } catch (error) {
            console.error("Error in reseting password: ", error);
            toast.error("Reset Password failed")
        }
    }
}))