import "dotenv/config";
import { createDbConnection } from "./config/connection.js";
import { createApp } from "./app.js";
import { AuthModel } from "./models/auth.model.js";

const db = await createDbConnection();

const authModel = new AuthModel({ db });

const app = createApp({ authModel });

const BASE_URL = process.env.BASE_URL ?? `http://localhost:3000`;

app.listen(3000, () => {
  console.log(`Servidor escuchando en ${BASE_URL}`);
});
