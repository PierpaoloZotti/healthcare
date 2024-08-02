'use client';

import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from '@/constants';
import { registerPatient } from '@/lib/actions/patient.action';
import { PatientFormValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import CustomFormField from '../custom-form-field';
import { FileUploader } from '../file-uploader';
import SubmitButton from '../submit-button';
import { Form, FormControl } from '../ui/form';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { SelectItem } from '../ui/select';

export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  PHONE_INPUT = 'phoneInput',
  DATE_PICKER = 'datePicker',
  SKELETON = 'skeleton',
}

const RegisterForm = ({ user }: { user: User }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: '',
      email: '',
      phone: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);
    let formData;

    if (
      values.identificationDocument &&
      values.identificationDocument.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });
      formData = new FormData();
      formData.append('blobFile', blobFile);
      formData.append('fileName', values.identificationDocument[0].name);
    }
    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      };
      //@ts-ignore
      const patient = await registerPatient(patientData);
      if (patient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-12 flex-1'
      >
        <section className='mb-12 space-y-4'>
          <h1 className='header'>Bem vindo, {user.name.split(' ')[0]}</h1>
          <p className='text-dark-700'>Gostariamos saber mais sobre você.</p>
        </section>
        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Informações Pessoais</h2>
          </div>
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
        <div className='flex flex-col gap-6 xl:flex-row'>
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
        </div>
        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.DATE_PICKER}
            name='birthDate'
            label='Data de Nascimento'
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SKELETON}
            name='gender'
            label='Sexo'
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className='flex h-11 gap-6 xl:justify-between'
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((option) => (
                    <div key={option.value} className='radio-group'>
                      <RadioGroupItem id={option.value} value={option.value} />
                      <Label htmlFor={option.value} className='cursor-pointer'>
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name='address'
            label='Endereço'
            placeholder='Avenida Paulista, 123...'
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name='occupation'
            label='Profissão'
            placeholder='Software Engineer...'
          />
        </div>
        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name='emergencyContactName'
            label='Contato de Emergência'
            placeholder='Nome contato de emergencia...'
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.PHONE_INPUT}
            name='emergencyContactNumber'
            label='Telefone Contato de Emergência'
            placeholder='Telefone com DDD...'
          />
        </div>
        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Informações Medicas</h2>
          </div>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.SELECT}
          name='primaryPhysician'
          label='Médico primário'
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
            fieldType={FormFieldType.INPUT}
            name='insuranceProvider'
            label='Plano de Saude'
            placeholder='Bradesco Seguros'
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name='insurancePolicyNumber'
            label='Numero Carteira Plano de Saude'
            placeholder='xx34567890'
          />
        </div>
        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name='allergies'
            label='Alergias conhecidas (se houver)'
            placeholder='Alergia a penicilina...'
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name='currentMedication'
            label='Medicamentos atuais (se houver)'
            placeholder='IbuProfeno, 600mg...'
          />
        </div>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name='familyMedicalHistory'
            label='Historico Médico Familiar'
            placeholder='Mae: Diabetes, Pai: Hipertensão...'
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name='pastMedicalHistory'
            label='Historico Médico Pessoal'
            placeholder='Apendicite, 2010...'
          />
        </div>
        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Verifica Identidade</h2>
          </div>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.SELECT}
          name='identificationType'
          label='Tipo de documento'
          placeholder='Selecione um documento para anexar...'
        >
          {IdentificationTypes.map((identificantion) => (
            <SelectItem key={identificantion} value={identificantion}>
              {identificantion}
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name='identificationNumber'
          label='Numero de identificação'
          placeholder='1234567890'
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.SKELETON}
          name='identificationDocument'
          label='Carregar documento de identificação'
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader onChange={field.onChange} files={field.value} />
            </FormControl>
          )}
        />

        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Consentimento de privacidade</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name='treatmentConsent'
          label='Eu concordo com o tratamento'
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name='disclosureConsent'
          label='Eu concordo com a divulgação de informações médicas'
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name='privacyConsent'
          label='Eu concordo com a politica de privacidade'
        />

        <SubmitButton isLoading={isLoading}>Enviar</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
