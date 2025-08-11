import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/auth.model.js";
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} from "../utils/customErrors.js";
import { validateUsuario } from "../schemas/auth.schema.js";

export const authController = {
  async register(req, res, next) {
    try {
      const data = req.body;

      const { success, error, data: {nombre, email, password} } = validateUsuario(data)
      if (!success) {
        res.status(400).json(error)
      }

      const existente = await Usuario.buscarPorEmail(email);
      if (existente) {
        throw new ConflictError("El correo ya está registrado");
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

      // Validar que se proporcionaron email y password
      if (!email || !password) {
        throw new BadRequestError("Email y contraseña requeridos");
      }

      // Buscar usuario
      const usuario = await Usuario.buscarPorEmail(email);
      if (!usuario) {
        throw new UnauthorizedError("Credenciales inválidas");
      }

      // Verificar contraseña
      const coincide = await bcrypt.compare(password, usuario.contraseña_hash);
      if (!coincide) {
        throw new UnauthorizedError("Credenciales inválidas");
      }

      // Generar token
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET no está configurado");
      }

      const jwtSecret = process.env.JWT_SECRET;
      const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "24h";

      // @ts-ignore
      const token = jwt.sign({ id: usuario.id }, jwtSecret, {
        expiresIn: jwtExpiresIn,
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
        throw new NotFoundError("Usuario no encontrado");
      }
      res.json(usuario);
    } catch (err) {
      next(err);
    }
  },
};
