import express, { json } from 'express';
import { authRouter } from './routes/auth.router';
// import {
//   corsMiddleware,
//   errorMiddleware,
// } from "./src/infrastructure/http/index.js";
// import { createProductRouter } from "./src/domains/products/router.js";

export const createApp = ({ authModel }) => {
  const app = express();
  app.use(json());
  // app.use(corsMiddleware());
  app.disable('x-powered-by');

  app.use('/auth', authRouter({ authModel }));

  // app.use(errorMiddleware);

  return app;
};
