import { Router } from "express";
import { comentariosController } from "../controllers/comentarios.controller.js";
import { verifyToken } from "../middlewares/auth_middleware.js";

const router = Router({ mergeParams: true });

router.get("/", comentariosController.listarComentarios);

router.post("/", verifyToken, comentariosController.crearComentario);

export default router;
