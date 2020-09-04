import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { getCustomRepository } from 'typeorm';
import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository';
import { startOfHour } from 'date-fns/fp';

interface RequestDTO{
  provider_id: string;
  date: Date;
}
class CreateAppointmentService{
  public async execute({ date , provider_id }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(appointmentDate);

    if(findAppointmentInSameDate){
      throw new Error('This appointment is already booked');
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate
    });

    await appointmentsRepository.save(appointment);

    return appointment;

  }
}

export default CreateAppointmentService;
