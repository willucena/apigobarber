import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';
import AppError from '@shared/errors/AppError';
/**
 * describe para "categorizar os teste"
 * it = (isso ou isto)
 * expect = O que eu espero como resultado do teste
 */
describe('CreateAppointment', () => {
  it('should be able to create a new appointmet', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

  const appointment =  await  createAppointment.execute({
    date: new Date(),
    provider_id: '125632',
   });

   expect(appointment).toHaveProperty('id');
   expect(appointment.provider_id).toBe('125632');

  });

  it('should not be able to create tow appointmets on the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

      const appointmentDate = new Date();
      await createAppointment.execute({
      date: appointmentDate,
      provider_id: '125632',
    });

    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '125632',
      })
    ).rejects.toBeInstanceOf(AppError);

  });

})
