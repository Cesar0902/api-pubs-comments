import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/auth.model.js";
import ResponseHandler from "../utils/responseHandler.js";
import { validateUsuario } from "../schemas/auth.schema.js";

export const authController = {
  async register(req, res, next) {
    try {
      const data = req.body;

      const { success, error, data: validatedData } = validateUsuario(data)
      if (!success) {
        const formattedErrors = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return ResponseHandler.BadRequest(res, "Datos de usuario inválidos", formattedErrors);
      }

      const { nombre, email, password } = validatedData;

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
      ResponseHandler.Internal(res, "Error al registrar usuario");
      next();
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return ResponseHandler.BadRequest(
          res,
          "Email y contraseña son requeridos"
        );
      }

      const usuario = await Usuario.buscarPorEmail(email);
      if (!usuario) return ResponseHandler.Unauthorized(
        res,
        "Credenciales inválidas"
      );

      const coincide = await bcrypt.compare(password, usuario.contraseña_hash);
      if (!coincide) return ResponseHandler.Unauthorized(
        res,
        "Credenciales inválidas"
      );

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
      ResponseHandler.Internal(res, "Error al iniciar sesión");
      next();
    }
  },

  async obtenerUsuarioPorId(req, res, next) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.buscarPorId(id);
      if (!usuario) return ResponseHandler.NotFound(
        res,
        "Usuario no encontrado"
      );
      return ResponseHandler.ok(res, usuario);
    } catch (err) {
      ResponseHandler.Internal(res, "Error al obtener usuario");
      next();
    }
  },
};
