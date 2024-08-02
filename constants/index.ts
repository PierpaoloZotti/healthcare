export const GenderOptions = [
  {
    value: 'Male',
    label: 'M',
  },
  {
    value: 'Female',
    label: 'F',
  },
  {
    value: 'Other',
    label: 'Outro',
  },
] as const;

export const PatientFormDefaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: new Date(Date.now()),
  gender: 'Male' as Gender,
  address: '',
  occupation: '',
  emergencyContactName: '',
  emergencyContactNumber: '',
  primaryPhysician: '',
  insuranceProvider: '',
  insurancePolicyNumber: '',
  allergies: '',
  currentMedication: '',
  familyMedicalHistory: '',
  pastMedicalHistory: '',
  identificationType: 'Carteira de Identidade',
  identificationNumber: '',
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  'Certificado de Nascimento',
  'CNH',
  'Carteira do Plano de Saúde',
  'Carteira de Identidade',
  'Passaporte',
  'Outro',
];

export const Doctors = [
  {
    image: '/assets/images/dr-green.png',
    name: 'John Green',
  },
  {
    image: '/assets/images/dr-cameron.png',
    name: 'Leila Cameron',
  },
  {
    image: '/assets/images/dr-livingston.png',
    name: 'David Livingston',
  },
  {
    image: '/assets/images/dr-peter.png',
    name: 'Evan Peter',
  },
  {
    image: '/assets/images/dr-powell.png',
    name: 'Jane Powell',
  },
  {
    image: '/assets/images/dr-remirez.png',
    name: 'Alex Ramirez',
  },
  {
    image: '/assets/images/dr-lee.png',
    name: 'Jasmine Lee',
  },
  {
    image: '/assets/images/dr-cruz.png',
    name: 'Alyana Cruz',
  },
  {
    image: '/assets/images/dr-sharma.png',
    name: 'Hardik Sharma',
  },
];

export const StatusIcon = {
  agendado: '/assets/icons/check.svg',
  pendente: '/assets/icons/pending.svg',
  cancelado: '/assets/icons/cancelled.svg',
};
