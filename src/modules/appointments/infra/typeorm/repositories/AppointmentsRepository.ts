import { getRepository , Repository} from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointimentsRepository';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor(){
    this.ormRepository = getRepository(Appointment);
  }

  // Find appointment by date
  public  async findByDate(date: Date): Promise<Appointment | undefined>{
    const  findAppointment = await this.ormRepository.findOne({
      where: {
        date: date,
      }
    })
    return findAppointment || undefined;
  }

  //Create appointment
  public async create({ provider_id, date }: ICreateAppointmentDTO): Promise<Appointment>{
    const appointment = this.ormRepository.create({ provider_id , date });

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
