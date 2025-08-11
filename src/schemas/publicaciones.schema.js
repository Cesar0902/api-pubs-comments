import z from "zod";

const publicacionesSchema = z.object({
    "titulo": z
      .string({ message: "El título debe ser en texto." })
      .max(100, { error: "La longitud máxima es de 100 caracteres." })
      .min(1, { error: "La longitud debe ser de al menos 1 caracter." }),
    "contenido": z
      .string({ message: "El contenido debe ser en texto." })
      .max(100, { error: "La longitud máxima es de 500 caracteres." })
      .min(1, { error: "La longitud debe ser de al menos 1 caracter." }),
})

const IdSchema = z.string().uuid({ message: "El id debe ser un UUID válido." });

export function validatePublicaciones(publicacion) {
  return publicacionesSchema.safeParse(publicacion)
}

export function validateId(id) {
  return IdSchema.safeParse(id)
}