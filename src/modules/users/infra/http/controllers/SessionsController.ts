import { Request, Response } from 'express';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import { container } from 'tsyringe';

export default class SessionsController {
  public async create(request: Request, response: Response):Promise<Response> {
    const { email, password } = request.body;
    const usersRepository = new UsersRepository();

    const authenticateUserService = container.resolve(AuthenticateUserService);

    const { user , token} = await authenticateUserService.execute({
      email,
      password
    });

    delete user.password;
    return response.json({ user, token });
  }
}
