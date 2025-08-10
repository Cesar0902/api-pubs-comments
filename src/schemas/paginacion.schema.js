import { z } from "zod";

export const PaginacionSchema = z.object({
  page: z.preprocess(
    (val) => parseInt(string, 10),
    z.number().min(1, "La página debe ser mayor que 0")
  ),
  limit: z.preprocess(
    (val) => parseInt(val, 10),
    z.number().min(1, "El límite debe ser mayor que 0")
  ),
});
