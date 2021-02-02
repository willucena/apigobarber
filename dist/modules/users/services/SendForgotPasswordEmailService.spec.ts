import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

import SendForgotPasswordEmail from './SendForgotPasswordEmailService';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmail;

describe('SendForgotPasswordEmail', () => {
  // beforeEach - Tudo que esta aqui dentro vai ser excutado antes dos its
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokenRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmail(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokenRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendEmail = jest.spyOn(fakeMailProvider, 'sendEmail');

    await fakeUserRepository.create({
      name: 'Julia Lima',
      email: 'julia@emailfaker.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'julia@emailfaker.com',
    });

    // VErifica se a função sendEmail foi executada
    expect(sendEmail).toHaveBeenCalled();
  });

  it('should no be able to recover non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'julia@emailfaker.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

    const user = await fakeUserRepository.create({
      name: 'Julia Lima',
      email: 'julia@emailfaker.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'julia@emailfaker.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
