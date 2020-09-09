// import User from "@modules/users/infra/typeorm/entities/User";
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from "../repositories/IUsersRepository";
import IUserTokensrepository from '../repositories/IUserTokensRepository';

// import AppError from "@shared/errors/AppError";
import { injectable, inject } from "tsyringe";
import AppError from "@shared/errors/AppError";

interface IRequest {
  email: string,
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensrepository,
    ){};

  public async execute({email}: IRequest): Promise<void>{
    const user = await this.usersRepository.findByEmail(email);

    if(!user){
      throw new AppError("User does not exists");
    }

    await this.userTokensRepository.generate(user.id);

    this.mailProvider.sendEmail(
      email,
      'Pedido de recuperação de senha'
    )
  }
}

export default SendForgotPasswordEmailService;