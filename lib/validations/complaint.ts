import { z } from "zod";

export const CATEGORIES = [
  "Infrastructure",
  "Billing & Finance",
  "Technical Issue",
  "Customer Support",
  "Harassment / Safety",
  "Other",
] as const;

export const complaintSchema = z.object({
  userName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  userEmail: z.string().email({ message: "Invalid email address format" }),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: "Please select a valid complaint category" }),
  }),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters" })
    .max(150, { message: "Subject cannot exceed 150 characters" }),
  description: z
    .string()
    .min(15, { message: "Detailed description must be at least 15 characters" }),
});

export type ComplaintFormData = z.infer<typeof complaintSchema>;
