import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';
/**
 * describe para "categorizar os teste"
 * it = (isso ou isto)
 * expect = O que eu espero como resultado do teste
 */
describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider= new FakeHashProvider();
    const createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);

    const user =  await  createUser.execute({
      name: "Julia Lima",
      email: 'julia@emailfaker.com',
      password: '123456'
    });

   expect(user).toHaveProperty('id');
   expect(user.email).toBe('julia@emailfaker.com');
  });

  it('should no be able to create a new user with same email from another', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider= new FakeHashProvider();
    const createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);

    await  createUser.execute({
      name: "Julia Lima",
      email: 'julia@emailfaker.com',
      password: '123456'
    });

   expect(
    createUser.execute({
      name: "Julia Lima",
      email: 'julia@emailfaker.com',
      password: '123456'
     })
   ).rejects.toBeInstanceOf(AppError);
  });
})
