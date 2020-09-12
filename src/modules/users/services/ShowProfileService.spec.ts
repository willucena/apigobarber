import ShowProfileService from './ShowProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });
  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonh@doe.com',
      password: '123456',
    });
    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('Jonh Doe');
    expect(profile.email).toBe('jonh@doe.com');
  });

  it('should no be able show the profile from not-existing user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non-existing-user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
