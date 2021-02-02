import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ name, email, password }: IRequest) {
    //validar existencia de um email
    const checkedUsersExists = await this.usersRepository.findByEmail(email);

    if (checkedUsersExists) {
      throw new AppError('Email address already used.');
    }
    // Criando hash da senha
    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    // Limpa o Cache do REDIS toda vez que um novo usuário é criado
    await this.cacheProvider.invalidatePrefix('provider-list');

    return user;
  }
}

export default CreateUserService;
