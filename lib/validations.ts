import { z } from "zod";

export const leadSchema = z.object({
  name: z
    .string()
    .min(1, "Введите имя")
    .max(100, "Максимум 100 символов"),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]{7,18}$/, "Введите корректный номер телефона"),
  email: z.string().email("Некорректный email").optional().or(z.literal("")),
  company: z.string().max(200).optional().or(z.literal("")),
  carId: z.string().optional(),
  message: z.string().max(1000).optional().or(z.literal("")),
  calcTerm: z.number().int().min(1).optional(),
  calcDown: z.number().int().min(0).max(100).optional(),
  calcPayment: z.number().int().min(0).optional(),
  source: z
    .enum(["WEBSITE", "CALLBACK", "EXIT_POPUP", "CALCULATOR", "TESTDRIVE", "REFERRAL", "OTHER"])
    .default("WEBSITE"),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
