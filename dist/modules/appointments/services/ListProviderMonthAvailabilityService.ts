import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import { getDaysInMonth, getDate, isAfter, endOfDay } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointimentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        year,
        month,
      },
    );
    // pega a quantidade de dias do mês 29 ,30 ou 31 dependendo do mês que é passado
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    // Cria um array com quantidade de dias do mês
    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (value, index) => index + 1,
    );

    const availability = eachDayArray.map(day => {
      // Sempre for trabalhar com mes no JS coloca month - 1 porque o JS começa o mês a partir de 0
      const compareDate = new Date(year, month - 1, day, 23, 59, 59);
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      return {
        day,
        available:
          isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}
export default ListProviderMonthAvailabilityService;
