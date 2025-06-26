import {z} from "zod";

export const registerUserSchema = z.object({
    username: z
        .string()
        .trim()
        .min(4, {message: "Minimum length of username should be 3"})
        .max(20, {message: "Maximum length of username is 20"}),
    
    email: z.string()
        .email({message: "Enter correct email"})
        .trim(),

    password: z
        .string()
        .min(8, {message: "Minimum length of password should be 8"})
        .max(13, {message: "Maximum lenght of password is 13"})
});

export const loginUserSchema = z.object({
    email: z.string()
        .email({message: "Enter correct email"})
        .trim(),

    password: z
        .string()
        .min(8, {message: "Minimum length of password should be 8"})
        .max(13, {message: "Maximum lenght of password is 13"})
});