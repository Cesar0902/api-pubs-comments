import { AuthController } from '../controllers/auth.controller';
import { Router } from 'express';

export const authRouter = ({ authModel }) => {
  const authRouter = Router();
  const authController = new AuthController({ authModel });

  authRouter.post('/login', authController.login);
  authRouter.post('/register', authController.createUser);
  authRouter.patch('/set-password', authController.setPassword);

  return authRouter;
};
