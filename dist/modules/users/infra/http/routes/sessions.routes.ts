import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate'; // Esse cara é usado para fazer validações

import SessionsController from '../controllers/SessionsController';
const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

export default sessionsRouter;
