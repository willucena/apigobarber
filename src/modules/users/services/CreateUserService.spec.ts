import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

/**
 * describe para "categorizar os teste"
 * it = (isso ou isto)
 * expect = O que eu espero como resultado do teste
 */
describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
  });
  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Julia Lima',
      email: 'julia@emailfaker.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('julia@emailfaker.com');
  });

  it('should no be able to create a new user with same email from another', async () => {
    await createUser.execute({
      name: 'Julia Lima',
      email: 'julia@emailfaker.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'Julia Lima',
        email: 'julia@emailfaker.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
