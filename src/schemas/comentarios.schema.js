import zod from "zod"

const comentariosSchema = zod.object({
  "contenido": zod
    .string({ message: "El contenido debe ser en texto." })
    .max(100, { error: "La longitud máxima es de 200 caracteres." })
    .min(1, { error: "La longitud debe ser de al menos 1 caracter." }),
})

export function validateComentarios(comentario) {
  return comentariosSchema.safeParse(comentario)
}