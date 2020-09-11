import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashPovider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('E-mail already in use');
    }

    user.name = name;
    user.email = email;

    if (password) {
      user.password = await this.hashPovider.generateHash(password);
    }

    if (password && !old_password) {
      throw new AppError(
        'You need to inform old password to set a new password',
      );
    }

    if (password && old_password) {
      const checkOldPassoword = await this.hashPovider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassoword) {
        throw new AppError('Old password does not match.');
      }
    }
    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;