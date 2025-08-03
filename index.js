import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import publicacionesRoutes from "./src/routes/publicaciones.routes.js";
import authRoutes from "./src/routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "API de Blog funcionando ✅" });
});

app.use("/auth", authRoutes);
app.use("/publicaciones", publicacionesRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
