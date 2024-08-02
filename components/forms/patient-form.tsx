'use client';

import { createUser } from '@/lib/actions/patient.action';
import { UserFormValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import CustomFormField from '../custom-form-field';
import SubmitButton from '../submit-button';
import { Form } from '../ui/form';

export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  PHONE_INPUT = 'phoneInput',
  DATE_PICKER = 'datePicker',
  SKELETON = 'skeleton',
}

const PatientForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);
    try {
      const user = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      const newUser = await createUser(user);

      if (newUser) {
        router.push(`/patients/${newUser.$id}/register`);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 flex-1'>
        <section className='mb-12 space-y-4'>
          <h1 className='header'>Bem vindo</h1>
          <p className='text-dark-700'>Agende sua primeira consulta</p>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name='name'
          label='Nome completo'
          placeholder='Digite seu nome...'
          iconSrc='/assets/icons/user.svg'
          iconAlt='user'
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name='email'
          label='Email'
          placeholder='Sua melhor email...'
          iconSrc='/assets/icons/email.svg'
          iconAlt='email'
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.PHONE_INPUT}
          name='phone'
          label='Telefone'
          placeholder='Digite seu telefone com DDD...'
        />

        <SubmitButton isLoading={isLoading}>Enviar</SubmitButton>
      </form>
    </Form>
  );
};

export default PatientForm;
