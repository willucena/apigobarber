import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatar from './UpdateUserAvatarService';
import AppError from '@shared/errors/AppError';

describe('UpdateUserAvatar', () => {
  it('should be able to update avatar', async () => {
    const fakeUserUpdateAvatar = new FakeStorageProvider();
    const fakeUserRepository = new FakeUsersRepository();

    const updateUserAvatar = new UpdateUserAvatar(fakeUserRepository, fakeUserUpdateAvatar);

    const user = await fakeUserRepository.create({
      name: 'Jonh Doe',
      email: 'jonh@doe.com',
      password: '123456'
    })
   await  updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

   expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update from non existing user', async () => {
    const fakeUserUpdateAvatar = new FakeStorageProvider();
    const fakeUserRepository = new FakeUsersRepository();

    const updateUserAvatar = new UpdateUserAvatar(fakeUserRepository, fakeUserUpdateAvatar);

   expect(
    updateUserAvatar.execute({
      user_id: 'non-existings-user',
      avatarFileName: 'avatar.jpg',
    })
   ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeUserRepository = new FakeUsersRepository();

    // spyOn = Espionar se determinada função foi executada
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatar(fakeUserRepository, fakeStorageProvider);

    const user = await fakeUserRepository.create({
      name: 'Jonh Doe',
      email: 'jonh@doe.com',
      password: '123456'
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar2.jpg',
    });

  expect(deleteFile).toHaveBeenCalledWith('avatar.jpg')
   expect(user.avatar).toBe('avatar2.jpg');
  });
})
