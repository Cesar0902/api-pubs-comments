import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/auth.model.js";
import { UserSchema, validateUser } from "../schemas/auth.schema.js";
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} from "../utils/customErrors.js";
import ResponseHandler from "../utils/responseHandler.js";

export const authController = {
  async register(req, res, next) {
    try {
      const parsed = validateUser(req.body);

      if (!parsed.success) {
        // Formateamos los errores de Zod
        const details = parsed.error.issues.map(i => ({
          field: i.path.join('.'),
          code: i.code,
          message: i.message,
        }));

        return ResponseHandler.BadRequest(
          res,
          'Datos inválidos en la solicitud',
          details
        );
      }

      const { nombre, email, password } = parsed.data;

      const existente = await Usuario.buscarPorEmail(email);
      if (existente) {
        return ResponseHandler.Conflict(res, "El correo ya está registrado");
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

      return ResponseHandler.created(res, {
        message: "Usuario registrado correctamente",
        usuario,
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new BadRequestError("Email y contraseña requeridos");
      }

      const usuario = await Usuario.buscarPorEmail(email);
      if (!usuario) throw new UnauthorizedError("Credenciales inválidas");

      const coincide = await bcrypt.compare(password, usuario.contraseña_hash);
      if (!coincide) throw new UnauthorizedError("Credenciales inválidas");

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET no está configurado");
      }

      const jwtSecret = process.env.JWT_SECRET;
      const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "24h";

      // @ts-ignore
      const token = jwt.sign({ id: usuario.id }, jwtSecret, {
        expiresIn: jwtExpiresIn,
      });

      return ResponseHandler.ok(res, {
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
      if (!usuario) throw new NotFoundError("Usuario no encontrado");
      return ResponseHandler.ok(res, usuario);
    } catch (err) {
      next(err);
    }
  },
};
