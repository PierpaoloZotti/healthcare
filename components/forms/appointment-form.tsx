'use client';

import { Doctors } from '@/constants';
import {
  createAppointment,
  updateAppointment,
} from '@/lib/actions/appointment.action';
import { getAppointmentSchema } from '@/lib/validation';
import { Appointment } from '@/types/appwrite.types';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import CustomFormField from '../custom-form-field';
import SubmitButton from '../submit-button';
import { Form } from '../ui/form';
import { SelectItem } from '../ui/select';
import { FormFieldType } from './register-form';

const AppointmentForm = ({
  userId,
  patientId,
  type,
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: 'create' | 'cancel' | 'schedule';
  appointment?: Appointment;
  setOpen: (open: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const formValidation = getAppointmentSchema(type);
  const router = useRouter();

  let buttonLabel;
  let subtitle;

  switch (type) {
    case 'cancel':
      buttonLabel = 'Cancelar Agendamento';
      subtitle = 'Tem certeza que deseja cancelar o agendamento';
      break;
    case 'create':
      buttonLabel = 'Agendar';
      subtitle = 'Agende sua consulta em 10 segundos';
      break;
    case 'schedule':
      buttonLabel = 'Reagendar';
      subtitle = 'Reagende sua consulta em um piscar de olhos';
      break;
    default:
      break;
  }

  const form = useForm<z.infer<typeof formValidation>>({
    resolver: zodResolver(formValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : '',
      schedule: appointment
        ? new Date(appointment.schedule)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : '',
      note: appointment?.note || '',
      cancellationReason: appointment?.cancellationReason || '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formValidation>) {
    setIsLoading(true);
    console.log('Im here:', { type });

    let status;
    switch (type) {
      case 'schedule':
        status = 'agendado';
        break;
      case 'cancel':
        status = 'cancelado';
        break;
      default:
        status = 'pendente';
        break;
    }
    try {
      if (type === 'create' && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          status: status as Status,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason || 'Consulta médica',
          note: values.note,
        };
        const appointement = await createAppointment(appointmentData);

        if (appointement) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointement.$id}`,
          );
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values?.primaryPhysician,
            schedule: new Date(values?.schedule),
            cancellationReason: values?.cancellationReason,
            note: values?.note,
            status: status as Status,
          },
          type,
        };
        const updatedAppointment = await updateAppointment(appointmentToUpdate);
        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error: any) {
      console.log('Creata Appointment Error:', error);
    }

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-12 flex-1'
      >
        {type === 'create' && (
          <section className='mb-12 space-y-4'>
            <h1 className='header'>Olá, </h1>
            <p className='text-dark-700'>{subtitle}</p>
          </section>
        )}

        {type !== 'cancel' && (
          <>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name='primaryPhysician'
              label='Dotor(a)'
              placeholder='Selecione um médico...'
            >
              {Doctors.map((doctor, i) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className='flex cursor-pointer items-center gap-2'>
                    <Image
                      src={doctor.image}
                      alt='doctor'
                      width={32}
                      height={32}
                      className='rounded-full border border-dark-500'
                    />
                    {doctor.name}
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <div className='flex flex-col gap-6 xl:flex-row'>
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name='reason'
                label='Motivos do agendaento'
                placeholder='ex: Check-up anual'
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name='note'
                label='Notas adicionais'
                placeholder='ex: Preferencia parte da tarde'
              />
            </div>

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name='schedule'
              label='Selecionar data e hora'
              showTimeSelect
              dateFormat='dd/MM/yyyy - HH:mm'
            />
          </>
        )}
        {type === 'cancel' && (
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name='cancellationReason'
            label='Motivo do cancelamento'
            placeholder='Digite um motivo para o cancelamento do agendamento'
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'
          }`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
