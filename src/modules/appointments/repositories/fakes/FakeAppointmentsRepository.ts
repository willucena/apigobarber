import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointimentsRepository';
import Appointment from '../../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];
  // Find appointment by date
  public  async findByDate(date: Date): Promise<Appointment | undefined>{
    const findAppointment = this.appointments.find(
      appointment => isEqual(appointment.date , date),
    );

    return findAppointment;
  }

  //Create appointment
  public async create({ provider_id, date }: ICreateAppointmentDTO): Promise<Appointment>{
      const appointment = new Appointment();

      // appointment.id =  uuid();
      // appointment.date = date;
      // appointment.provider_id = provider_id;
      Object.assign(appointment, {id: uuid(), date, provider_id});

      this.appointments.push(appointment);

      return appointment;
  }
}

export default AppointmentsRepository;
