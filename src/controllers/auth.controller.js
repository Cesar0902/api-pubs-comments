import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/auth.model.js";

export const authController = {
  async register(req, res, next) {
    try {
      const { nombre, email, password } = req.body;

      if (!nombre || !email || !password) {
        return res
          .status(400)
          .json({ error: "Todos los campos son obligatorios" });
      }

      const existente = await Usuario.buscarPorEmail(email);
      if (existente) {
        return res.status(400).json({ error: "El correo ya está registrado" });
      }

      const { v4: uuidv4 } = await import("uuid");
      const id = uuidv4();
      const hash = await bcrypt.hash(password, 10);

      const usuario = await Usuario.crear({
        id,
        nombre,
        email,
        contraseña_hash: hash,
      });

      res
        .status(201)
        .json({ message: "Usuario registrado correctamente", usuario });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña requeridos" });
      }

      const usuario = await Usuario.buscarPorEmail(email);
      if (!usuario) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      const coincide = await bcrypt.compare(password, usuario.contraseña_hash);
      if (!coincide) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      res.json({
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async obtenerUsuarioPorId(req, res, next) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.buscarPorId(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(usuario);
    } catch (err) {
      next(err);
    }
  },
};
