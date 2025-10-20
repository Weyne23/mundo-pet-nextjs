'use server';
import { Appointment } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import z from 'zod';

const appointmentSchema = z.object({
  tutorName: z.string(),
  petName: z.string(),
  phone: z.string(),
  description: z.string(),
  scheduleAt: z.date(),
});

type AppointmentData = z.infer<typeof appointmentSchema>;

export async function createAppointment(data: AppointmentData) {
  try {
    const parsedData = appointmentSchema.parse(data);

    const { scheduleAt } = parsedData;
    const hour = scheduleAt.getHours();

    const isMorning = hour >= 9 && hour < 12;
    const isAfternoon = hour >= 13 && hour < 18;
    const isEvening = hour >= 19 && hour < 21;

    if (!isMorning && !isAfternoon && !isEvening) {
      return {
        error:
          'Agendamentos só podem ser feitos entre 9h e 12h, 12h e 18h ou 18h e 21h.',
      };
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        scheduleAt,
      },
    });

    if (existingAppointment) {
      return {
        error: 'Este horário já está reservado!',
      };
    }

    await prisma.appointment.create({
      data: {
        ...parsedData,
      },
    });

    revalidatePath('/'); //Recarrega a pagina em questão
  } catch (error) {
    console.log(error);

    return {
      error: 'Erro ao criar agendamento! Tente novamente.'
    }
  }
}

export async function updateAppointment(id: string, data: AppointmentData) {
  try {
    const parsedData = appointmentSchema.parse(data);

    const { scheduleAt } = parsedData;
    const hour = scheduleAt.getHours();

    const isMorning = hour >= 9 && hour < 12;
    const isAfternoon = hour >= 13 && hour < 18;
    const isEvening = hour >= 19 && hour < 21;

    if (!isMorning && !isAfternoon && !isEvening) {
      return {
        error:
          'Agendamentos só podem ser feitos entre 9h e 12h, 12h e 18h ou 18h e 21h.',
      };
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        scheduleAt,
        id: {
          not: id
        }
      },
    });

    if (existingAppointment) {
      return {
        error: 'Este horário já está reservado!',
      };
    };

    await prisma.appointment.update({
      where: {
        id,
      },
      data: {
        ...parsedData,
      }
    })

    revalidatePath('/');

  } catch (error) {
    console.log(error);

    return {
      error: 'Erro ao editar o agendamento! Tente novamente.'
    }
  }
}

export async function deleteAppointment(id: string) {
  try{
    await prisma.appointment.delete({
      where: {
        id
      }
    })
    revalidatePath('/')
  }
  catch(error){
    console.log(error);

    return {
      error: 'Erro ao deletar o agendamento! Tente novamente.'
    }
  }
}