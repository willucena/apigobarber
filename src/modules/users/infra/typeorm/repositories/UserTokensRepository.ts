import { getRepository , Repository} from 'typeorm';

import UserToken from '../entities/UserToken';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

class UserTokensRepository
 implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor(){
    this.ormRepository = getRepository(UserToken);
  }

  public async generate(user_id: string): Promise<UserToken> {
  }

}

export default UserTokensRepository
;
