import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatar from './UpdateUserAvatarService';
import AppError from '@shared/errors/AppError';

let fakeUserUpdateAvatar: FakeStorageProvider;
let fakeUserRepository: FakeUsersRepository;
let updateUserAvatar: UpdateUserAvatar;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUserUpdateAvatar = new FakeStorageProvider();
    fakeUserRepository = new FakeUsersRepository();
    updateUserAvatar = new UpdateUserAvatar(
      fakeUserRepository,
      fakeUserUpdateAvatar,
    );
  });
  it('should be able to update avatar', async () => {
    const user = await fakeUserRepository.create({
      name: 'Jonh Doe',
      email: 'jonh@doe.com',
      password: '123456',
    });
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update from non existing user', async () => {
    expect(
      updateUserAvatar.execute({
        user_id: 'non-existings-user',
        avatarFileName: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    // spyOn = Espionar se determinada função foi executada
    const deleteFile = jest.spyOn(fakeUserUpdateAvatar, 'deleteFile');

    const user = await fakeUserRepository.create({
      name: 'Jonh Doe',
      email: 'jonh@doe.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
