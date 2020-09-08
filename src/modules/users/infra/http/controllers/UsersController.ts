import { Request, Response } from 'express';
import CreateUserService from '@modules/users/services/CreateUserService';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

export default class UsersController {
  public async create(request: Request, response: Response):Promise<Response> {
    const usersRepository = new UsersRepository();

    try{
      const { name, email, password } = request.body;
      const createUserService = new CreateUserService(usersRepository);
      const user = await createUserService.execute({
        name,
        email,
        password
      });
      //Removendo a senha da listagem após gravar no banco de dados
      delete user.password;
      return response.json(user);
    }catch(erro){
      return response.status(400).json({error: erro.message})
    }
  }
}
