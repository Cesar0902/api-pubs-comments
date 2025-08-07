import { z } from "zod";

export const UserSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Formato de email inválido"),
  password: z.string("La contraseña es requerida")
    .min(8, "Mínimo 8 caracteres")
    .max(20, "Máximo 20 caracteres")
    .regex(/[A-Z]/, "Requiere al menos una mayúscula")
    .regex(/[0-9]/, "Requiere al menos un número")
    .regex(/[!@#$%^&*]/, "Requiere al menos un carácter especial")
});