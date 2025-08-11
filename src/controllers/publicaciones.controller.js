import { v4 as uuidv4 } from "uuid";
import { Publicacion } from "../models/publicacion.model.js";
import { validatePaginacion } from "../schemas/paginacion.schema.js";
import sanitizarHtml from "../utils/sanitizarHtml.js";
import { validatePublicaciones } from "../schemas/publicaciones.schema.js";
import ResponseHandler from "../utils/responseHandler.js";

export const publicacionesController = {
  listarPublicaciones: async (req, res, next) => {
    try {
      const query = req.query;

      const { success, error, data: validated } = validatePaginacion(query);
      if (!success) {
        const formattedErrors = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return ResponseHandler.BadRequest(res, "Parámetros de paginación inválidos", formattedErrors);
      }

      const { page, limit, searchWord } = validated;
      const offset = (page - 1) * limit;

      let total, publicaciones;

      if (searchWord && searchWord.trim() !== '') {
        total = await Publicacion.contarPorContenido(searchWord);
        publicaciones = await Publicacion.buscarPorContenido(searchWord, { limit, offset });
      } else {
        total = await Publicacion.contar();
        publicaciones = await Publicacion.listar({ limit, offset });
      }

      return ResponseHandler.ok(res, { page, limit, total, publicaciones });
    } catch (err) {
      next(err);
    }
  },

  verPublicacion: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const publicacion = await Publicacion.buscarPorId(id);
      if (!publicacion) {
        return ResponseHandler.NotFound(res, "Publicación no encontrada");
      }
      return ResponseHandler.ok(res, publicacion);
    } catch (err) {
      next(err);
    }
  },

  crearPublicacion: async (req, res, next) => {
    try {
      const data = req.body;
      const { success, error, data: { titulo, contenido }} = validatePublicaciones(data)
      if (!success) {
        return ResponseHandler.BadRequest(res, "Datos de publicación inválidos", error);
      }

      const usuario_id = req.user.id;

      const id = uuidv4();

      const contenidoLimpio = sanitizarHtml(contenido);

      await Publicacion.crear({
        id,
        titulo,
        contenido: contenidoLimpio,
        usuario_id,
      });

      return ResponseHandler.created(res, { message: "Publicación creada", id });
    } catch (err) {
      next(err);
    }
  },

  editarPublicacion: async (req, res, next) => {
    try {
      const { id } = req.params;
      const usuario_id = req.user.id;
      const data = req.body;

      const { success, error, data: { titulo, contenido }} = validatePublicaciones(data)
      if (!success) {
        return ResponseHandler.BadRequest(res, "Datos de publicación inválidos", error);
      }

      const contenidoLimpio = sanitizarHtml(contenido);

      const autor = await Publicacion.buscarAutorPorId(id);
      if (!autor)
        return ResponseHandler.NotFound(res, "Publicación no encontrada");

      if (autor.usuario_id !== usuario_id) {
        return ResponseHandler.Forbidden(res, "No tienes permiso para editar esta publicación");
      }

      await Publicacion.actualizar(id, { titulo, contenido: contenidoLimpio });

      return ResponseHandler.ok(res, { message: "Publicación actualizada" });
    } catch (err) {
      next(err);
    }
  },

  eliminarPublicacion: async (req, res, next) => {
    try {
      const { id } = req.params;
      const usuario_id = req.user.id;

      const autor = await Publicacion.buscarAutorPorId(id);
      if (!autor)
        return ResponseHandler.NotFound(res, "Publicación no encontrada");

      if (autor.usuario_id !== usuario_id) {
        return ResponseHandler.Forbidden(res, "No tienes permiso para eliminar esta publicación");
      }

      await Publicacion.eliminar(id);

      return ResponseHandler.ok(res, { message: "Publicación eliminada" });
    } catch (err) {
      next(err);
    }
  },
};
