'use server';

import { Appointment } from '@/types/appwrite.types';
import { revalidatePath } from 'next/cache';
import { ID, Query } from 'node-appwrite';
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from '../appwrite.config';
import { formatDateTime, parseStringify } from '../utils';

export const createAppointment = async (
  appointment: CreateAppointmentParams,
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment,
    );
    return parseStringify(newAppointment);
  } catch (error) {
    console.log('createAppointment error:', error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
    );

    return parseStringify(appointment);
  } catch (error: any) {
    console.log('getAppointment error:', error);
  }
};
export type RecentAppointmentsList = {
  totalCount: number;
  scheduledCount: number;
  pendingCount: number;
  cancelledCount: number;
  documents: Appointment[];
};
export const getRecentAppointmentsList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc('$createdAt')],
    );
    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        if (appointment.status === 'agendado') {
          acc.scheduledCount += 1;
        } else if (appointment.status === 'pendente') {
          acc.pendingCount += 1;
        } else if (appointment.status === 'cancelado') {
          acc.cancelledCount += 1;
        }
        return acc;
      },
      initialCounts,
    );
    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };
    revalidatePath('/admin');
    return parseStringify(data);
  } catch (error: any) {
    console.log('getRecentAppointmentsList error:', error);
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment,
    );
    if (!updatedAppointment) {
      throw new Error('Appointment not found');
    }

    const smsMessage = `Olá, aqui é da CarePulse.
    ${
      type === 'schedule'
        ? `Seu agendamento foi confirmado para ${
            formatDateTime(appointment.schedule!).dateTime
          } com o Dr. ${appointment.primaryPhysician}. Notas adicionais: ${
            appointment.note
          }`
        : `Seu agendamento foi cancelado para o seguinte motivo: ${appointment.cancellationReason}`
    }
     `;
    await sendSMSNotificationn(userId, smsMessage);

    revalidatePath('/admin');
    return parseStringify(updatedAppointment);
  } catch (error: any) {
    console.log('updateAppointment error:', error);
  }
};

export const sendSMSNotificationn = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId],
    );
  } catch (error: any) {
    console.log('sendSMSNotification error:', error);
  }
};
