import zod from "zod";

const publicacionesSchema = zod.object({
    "titulo": zod
      .string({ message: "El título debe ser en texto." })
      .max(100, { error: "La longitud máxima es de 100 caracteres." })
      .min(1, { error: "La longitud debe ser de al menos 1 caracter." }),
    "contenido": zod
      .string({ message: "El contenido debe ser en texto." })
      .max(100, { error: "La longitud máxima es de 500 caracteres." })
      .min(1, { error: "La longitud debe ser de al menos 1 caracter." }),
})

export function validatePublicaciones(publicacion) {
  return publicacionesSchema.safeParse(publicacion)
}