import { getRepository } from "typeorm";
import { hash } from 'bcryptjs';
import User from "@modules/users/infra/typeorm/entities/User";

interface Request {
  name: string,
  email: string,
  password: string,
}
class CreateUserService {
  public async execute({ name, email , password }: Request){
    const usersRepository = getRepository(User);

    //validar existencia de um email
    const checkedUsersExists = await usersRepository.findOne({
      where: {email},
    });

    if(checkedUsersExists){
      throw new Error('Email address already used.');
    }
    // Criando hash da senha
    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword
    });

   await usersRepository.save(user);

   return user;
  }
}

export default CreateUserService;
