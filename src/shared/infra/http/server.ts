import 'reflect-metadata';
import express, { response, Request , Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import routes from '@shared/infra/http/routes';
import uploadConfig from '@config/upload';
import '@shared/infra/typeorm';
import AppError from '@shared/errors/AppError';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

// Middleware para trativa de error em todas as (rotas ou requisições)
//Após criar esse middleware eu não preciso de um try catch nas minhas rotas ou controllers
app.use((err: Error, request: Request , response : Response, next : NextFunction ) => {
  //Tratando errors que ocorream na aplicação
  if(err instanceof AppError){
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    })
  }
  console.error(err);
  // errors que não foram tratados ou que não estava sendo esperado
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
})
app.listen(3333, ()=> {
  console.log('Server start on 3333')
})