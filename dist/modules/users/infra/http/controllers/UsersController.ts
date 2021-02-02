import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { name, email, password } = request.body;
      const createUserService = container.resolve(CreateUserService);
      const user = await createUserService.execute({
        name,
        email,
        password,
      });
      //Removendo a senha da listagem após gravar no banco de dados
      return response.json(classToClass(user));
    } catch (erro) {
      return response.status(400).json({ error: erro.message });
    }
  }
}
