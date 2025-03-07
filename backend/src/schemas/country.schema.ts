import { z } from "zod";

export const countrySchema = z.object({
  name: z.string().min(3, "Country name must be at least 3 characters long"),
  code: z.string().min(2, "Country code must be at least 2 characters long"),
});

export const updateCountrySchema = z.object({
  name: z.string().min(3, "Country name must be at least 3 characters long"),
  code: z.string().min(2, "Country code must be at least 2 characters long"),
});

export type Country = z.infer<typeof countrySchema>;
export type UpdateCountry = z.infer<typeof updateCountrySchema>;
