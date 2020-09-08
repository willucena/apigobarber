import { getRepository , Repository} from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor(){
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }
  
  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email }
    });

    return user;
  }

  // Find appointment by date
  public  async findByDate(date: Date): Promise<User | undefined>{
    const  findUser = await this.ormRepository.findOne({
      where: {
        date: date,
      }
    })
    return findUser || undefined;
  }

  //Create appointment
  public async create({ name, email, password }: ICreateUserDTO): Promise<User>{
    const user = this.ormRepository.create({ name, email, password  });

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User>{
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
