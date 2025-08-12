import { v4 as uuidv4 } from "uuid";
import { Comentario } from "../models/comentarios.model.js";
import sanitizarHtml from "../utils/sanitizarHtml.js";
import { validateComentarios } from "../schemas/comentarios.schema.js";
import ResponseHandler from "../utils/responseHandler.js";

export const comentariosController = {
  listarComentarios: async (req, res, next) => {
    try {
      const { id } = req.params;
      const comentarios = await Comentario.listarPorPublicacion(id);
      return ResponseHandler.ok(res, comentarios);
    } catch (err) {
      next(err);
    }
  },

  crearComentario: async (req, res, next) => {
    try {
      const data = req.body;

      const { success, error, data: validatedData } = validateComentarios(data)
      if (!success) {
        const formattedErrors = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return ResponseHandler.BadRequest(res, "Datos de comentario inválidos", formattedErrors);
      }

      const { contenido } = validatedData;

      const usuario_id = req.user.id;
      const publicacion_id = req.params.id;

      const id = uuidv4();
      const contenidoLimpio = sanitizarHtml(contenido);

      await Comentario.crear({ id, contenido: contenidoLimpio, usuario_id, publicacion_id });

      return ResponseHandler.created(res, { message: "Comentario creado", id });
    } catch (err) {
      next(err);
    }
  },

  eliminarComentario: async (req, res, next) => {
    try {
      const { id } = req.params; // ID del comentario
      const usuario_id = req.user.id;

      const autor = await Comentario.buscarAutorPorId(id);
      if (!autor)
        return ResponseHandler.NotFound(res, "Comentario no encontrado");

      if (autor.usuario_id !== usuario_id) {
        return ResponseHandler.Forbidden(res, "No tienes permiso para eliminar este comentario");
      }

      await Comentario.eliminar(id);

      return ResponseHandler.ok(res, { message: "Comentario eliminado" });
    } catch (err) {
      next(err);
    }
  },
};
