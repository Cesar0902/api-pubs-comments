import { ZodError } from "zod";
import { BadRequestError } from "./customErrors.js";

export const validateSchema = (
  schema,
  data,
  errorMessage = "Datos inválidos"
) => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues.map((issue) => ({
        field: issue.path.join(".") || "root",
        message: issue.message,
      }));
      throw new BadRequestError(errorMessage, issues);
    }
    throw new BadRequestError("Error de validación desconocido");
  }
};

export const validateSchemaSafe = (
  schema,
  data,
  errorMessage = "Datos inválidos"
) => {
  try {
    const validatedData = validateSchema(schema, data, errorMessage);
    return { success: true, data: validatedData };
  } catch (error) {
    return { success: false, error };
  }
};
