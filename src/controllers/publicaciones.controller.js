import { v4 as uuidv4 } from "uuid";
import { Publicacion } from "../models/publicacion.model.js";
import { validatePaginacion } from "../schemas/paginacion.schema.js";
import sanitizarHtml from "../utils/sanitizarHtml.js";
import { validatePublicaciones } from "../schemas/publicaciones.schema.js";

export const publicacionesController = {
  listarPublicaciones: async (req, res, next) => {
    try {
      const data = req.query

      const { success, error, data: { page, limit, searchWord }} = validatePaginacion(data)
      if (!success) {
        res.status(400).json(error)
      }
 
      const offset = (page - 1) * limit;

      const total = await Publicacion.contar();
      let publicaciones = await Publicacion.listar({ limit, offset });

      if (searchWord !== undefined) {
        publicaciones = await Publicacion.buscarPorContenido(searchWord);
      }

      res.json({ page, limit, total, publicaciones });
    } catch (err) {
      next(err);
    }
  },

  verPublicacion: async (req, res, next) => {
    try {
      const { id } = req.params;
      const publicacion = await Publicacion.buscarPorId(id);
      if (!publicacion) {
        return res.status(404).json({ error: "Publicación no encontrada" });
      }
      res.json(publicacion);
    } catch (err) {
      next(err);
    }
  },

  crearPublicacion: async (req, res, next) => {
    try {
      const data = req.body;
      const { success, error, data: { titulo, contenido }} = validatePublicaciones(data)
      if (!success) {
        res.status(400).json(error)
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

      res.status(201).json({ message: "Publicación creada", id });
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
        res.status(400).json(error)
      }

      const contenidoLimpio = sanitizarHtml(contenido);

      const autor = await Publicacion.buscarAutorPorId(id);
      if (!autor)
        return res.status(404).json({ error: "Publicación no encontrada" });

      if (autor.usuario_id !== usuario_id) {
        return res
          .status(403)
          .json({ error: "No tienes permiso para editar esta publicación" });
      }

      await Publicacion.actualizar(id, { titulo, contenido: contenidoLimpio });

      res.json({ message: "Publicación actualizada" });
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
        return res.status(404).json({ error: "Publicación no encontrada" });

      if (autor.usuario_id !== usuario_id) {
        return res
          .status(403)
          .json({ error: "No tienes permiso para eliminar esta publicación" });
      }

      await Publicacion.eliminar(id);

      res.json({ message: "Publicación eliminada" });
    } catch (err) {
      next(err);
    }
  },
};
