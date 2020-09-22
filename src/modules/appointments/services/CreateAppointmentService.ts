import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointimentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}
/**
 * @todo
 * Usando injecão de dependencia
 * Ver shared/container local onde esta sendo registrada as injeções de dependencias
 */
@injectable()
class CreateAppointmentService {
  /**
   * @todo
   * Usando DIP (Inversão de dependencia) minha service vai receber extamente o
   * Repository que ele precisa para chamar a persistencia e o mais importante
   */
  constructor(
    //@inject é da lib tsyringe para configurar injeção de dependecias
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    //Compara se data do agendamento é anterior data atual
    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an apointment on past date");
    }

    if (user_id === provider_id) {
      throw new AppError("You can't create an apointment with yourself");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('You can only create appointment between 8AM and 5PM');
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const dateFormat = format(appointmentDate, "d/M/ 'às' HH:mm");
    //Gravar notificação no mongodb
    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormat}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-MM-dd',
      )}`,
    );
    return appointment;
  }
}

export default CreateAppointmentService;
