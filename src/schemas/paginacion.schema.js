import { z } from "zod";

const PaginacionSchema = z.object({
  page: z.preprocess(
    // @ts-ignore
    (val) => parseInt(val, 10),
    z
      .number()
      .min(1, "La página debe ser mayor que 0")
  ),
  limit: z.preprocess(
    // @ts-ignore
    (val) => parseInt(val, 10),
    z
      .number()
      .min(1, "El límite debe ser mayor que 0")
      .max(100, "No se puede mostrar más de 100 a la vez.")
  ),
  searchWord: z
    .string("Debe ser un string.")
    .optional()
});

export function validatePaginacion(queryPaginacion) {
  return PaginacionSchema.safeParse(queryPaginacion)
}