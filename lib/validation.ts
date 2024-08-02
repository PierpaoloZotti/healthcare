import { z } from 'zod';

export const UserFormValidation = z.object({
  name: z.string().min(2, { message: 'Precisa inserir o nome completo' }),
  email: z.string().email({ message: 'Email invalido' }),
  phone: z.string().refine((phone) => /^\+\d{10,15}$/.test(phone), {
    message: 'Telefone invalido',
  }),
});

export const PatientFormValidation = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(50, 'O nome deve ter no máximo 50 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), 'Telefone inválido'),
  birthDate: z.coerce.date(),
  gender: z.enum(['Male', 'Female', 'Other']),
  address: z
    .string()
    .min(5, 'Endereço deve ter pelo menos 5 caracteres')
    .max(500, 'Endereço deve ter no máximo 500 caracteres'),
  occupation: z
    .string()
    .min(2, 'Profissão deve ter pelo menos 2 caracteres')
    .max(500, 'Profissão deve ter no máximo 500 caracteres'),
  emergencyContactName: z
    .string()
    .min(2, 'Nome do contato deve ter pelo menos 2 caracteres')
    .max(50, 'Nome do contato deve ter no máximo 50 caracteres'),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      'Telefone de contato de emergência inválido',
    ),
  primaryPhysician: z.string().min(2, 'Selecione pelo menos um médico'),
  insuranceProvider: z
    .string()
    .min(2, 'Plano de saúde deve ter pelo menos 2 caracteres')
    .max(50, 'Plano de saúde deve ter no máximo 50 caracteres'),
  insurancePolicyNumber: z
    .string()
    .min(2, 'Numero da apólice deve ter pelo menos 2 caracteres')
    .max(50, 'Numero da apólice deve ter no máximo 50 caracteres'),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),
  treatmentConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: 'Deve consentir com o tratamento para prosseguir',
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: 'Deve consentir com a divulgação para prosseguir',
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: 'Deve consentir com a privacidade para prosseguir',
    }),
});

export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, 'Selecione pelo menos um médico'),
  schedule: z.coerce.date(),
  reason: z
    .string()
    .min(2, 'Reason must be at least 2 characters')
    .max(500, 'Reason must be at most 500 characters'),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, 'Select at least one doctor'),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, 'Select at least one doctor'),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, 'Reason must be at least 2 characters')
    .max(500, 'Reason must be at most 500 characters'),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case 'create':
      return CreateAppointmentSchema;
    case 'cancel':
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}
