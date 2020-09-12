import { startOfHour, isBefore, getHours } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointimentsRepository';
import providersRouter from '../infra/http/routes/providers.routes';

interface IRequestDTO {
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
  ) {}

  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequestDTO): Promise<Appointment> {
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

    return appointment;
  }
}

export default CreateAppointmentService;
