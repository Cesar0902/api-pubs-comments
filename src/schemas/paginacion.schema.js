import { z } from "zod";

const PaginacionSchema = z.object({
  page: z.preprocess(
    (val) => {
      if (val === undefined || val === null || val === '') return undefined; // para que default funcione
      return parseInt(String(val), 10);
    },
    z
      .number()
      .min(1, "La página debe ser mayor que 0")
      .default(1)
  ),
  limit: z.preprocess(
    (val) => {
      if (val === undefined || val === null || val === '') return undefined;
      return parseInt(String(val), 10);
    },
    z
      .number()
      .min(1, "El límite debe ser mayor que 0")
      .max(100, "No se puede mostrar más de 100 a la vez.")
      .default(10)
  ),
  searchWord: z
    .string("Debe ser un string.")
    .optional()
});

export function validatePaginacion(queryPaginacion) {
  return PaginacionSchema.safeParse(queryPaginacion);
}
