import { getRepository, Repository, Raw } from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointimentsRepository';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindInMonthFromProviderDTO from '@modules/appointments/dtos/IFindInMonthFromProviderDTO';
import IFindInDayFromProviderDTO from '@modules/appointments/dtos/IFindInDayFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  // Find appointment by date
  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: {
        date: date,
      },
    });
    return findAppointment || undefined;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    year,
    month,
  }: IFindInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFildName =>
            `to_char(${dateFildName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });
    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const parsedDay = String(day).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFildName =>
            `to_char(${dateFildName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
    });
    return appointments;
  }

  //Create appointment
  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
