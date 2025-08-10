import { v4 as uuidv4 } from "uuid";
import { Comentario } from "../models/comentarios.model.js";
import sanitizarHtml from "../utils/sanitizarHtml.js";

export const comentariosController = {
  listarComentarios: async (req, res, next) => {
    try {
      const { id } = req.params;
      const comentarios = await Comentario.listarPorPublicacion(id);
      res.json(comentarios);
    } catch (err) {
      next(err);
    }
  },

  crearComentario: async (req, res, next) => {
    try {
      const { contenido } = req.body;
      const usuario_id = req.user.id;
      const publicacion_id = req.params.id;

      if (!contenido || contenido.trim() === "") {
        return res
          .status(400)
          .json({ error: "El contenido del comentario es obligatorio" });
      }

      if ( contenido.length > 200 ) {
        return res
          .status(400)
          .json({ error: "El contenido del comentario no puede ser mayor a 200 caracteres." });
      }


      const id = uuidv4();

      const contenidoLimpio = sanitizarHtml(contenido);

      await Comentario.crear({ id, contenido: contenidoLimpio, usuario_id, publicacion_id });

      res.status(201).json({ message: "Comentario creado", id });
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
        return res.status(404).json({ error: "Comentario no encontrado" });

      if (autor.usuario_id !== usuario_id) {
        return res
          .status(403)
          .json({ error: "No tienes permiso para eliminar este comentario" });
      }

      await Comentario.eliminar(id);

      res.json({ message: "Comentario eliminado" });
    } catch (err) {
      next(err);
    }
  },
};
