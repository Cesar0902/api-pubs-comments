import { Router } from "express";
import { verifyToken } from "../middlewares/auth_middleware.js";
import { publicacionesController } from "../controllers/publicaciones.controller.js";

const router = Router();

router.get("/", publicacionesController.listarPublicaciones); // pública
router.get("/:id", publicacionesController.verPublicacion); // pública

// protegidas - solo usuario autenticado
router.post("/", verifyToken, publicacionesController.crearPublicacion);
router.put("/:id", verifyToken, publicacionesController.editarPublicacion);
router.delete("/:id", verifyToken, publicacionesController.eliminarPublicacion);

export default router;
