import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate'; // Esse cara é usado para fazer validações

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();
const appointementsController = new AppointmentsController();
const providerAppointementsController = new ProviderAppointmentsController();

// Usando midlleware nas rotas
appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointementsController.create,
);
appointmentsRouter.get('/me', providerAppointementsController.index);

export default appointmentsRouter;
