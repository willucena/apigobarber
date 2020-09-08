import User from "@modules/users/infra/typeorm/entities/User";
import IUsersRepository from "../repositories/IUsersRepository";
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import AppError from "@shared/errors/AppError";
import { injectable, inject } from "tsyringe";

interface IRequest {
  name: string,
  email: string,
  password: string,
}

@injectable()
class CreateUserService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
    ){};

  public async execute({ name, email , password }: IRequest){
    //validar existencia de um email
    const checkedUsersExists = await this.usersRepository.findByEmail(email);

    if(checkedUsersExists){
      throw new AppError('Email address already used.');
    }
    // Criando hash da senha
    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword
    });

   return user;
  }
}

export default CreateUserService;
