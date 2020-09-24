import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';
import ListProviderAppointmentService from '@modules/appointments/services/ListProviderAppointmentService';
import { classToClass } from 'class-transformer';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { day, month, year } = request.query;
    /**
     * @todo(Usando o container para fazer a injeção de dependencia no service)
     */
    const listAppointment = container.resolve(ListProviderAppointmentService);

    const appointments = await listAppointment.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.json(classToClass(appointments));
  }
}
