import { z } from "zod";

export const UserSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string(),
});

export const QuestionSchema = z.object({
    text: z.string().nonempty({ message: "No Empty Question" }),
})

export const ChoiceSchema = z.object({
    content: z.string().nonempty({ message: "No Empty Choice" })
})
