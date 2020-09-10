import { Router } from 'express';
import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';

const routes = Router();
//Quando eu declaro o  routes.use('/resource',fileRouter)
//Eu estou declarando na aplicação o prefixo do resource da rota
//com isso no meu aquivo appointmentsRouter eu não preciso colocar
//mais o prefixo para as demais rotas
routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);

export default routes;
