import { Router } from 'express';

import  ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointementsController = new AppointmentsController();

// Usando midlleware nas rotas
appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post('/', appointementsController.create);

export default appointmentsRouter;
