import { startOfHour } from 'date-fns/fp';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointimentsRepository';

interface IRequestDTO{
  provider_id: string;
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
    @inject('AppontmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ){}

  public async execute({ date , provider_id }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate);

    if(findAppointmentInSameDate){
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate
    });

    return appointment;

  }
}

export default CreateAppointmentService;
