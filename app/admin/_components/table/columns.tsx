'use client';

import { Doctors } from '@/constants';
import { formatDateTime } from '@/lib/utils';
import { Appointment } from '@/types/appwrite.types';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import AppointmentModal from '../appointment-modal';
import StatusBadge from '../status-badge';

export const columns: ColumnDef<Appointment>[] = [
  {
    header: 'ID',
    cell: ({ row }) => <p className='text-14-medium'>{row.index + 1}</p>,
  },
  {
    accessorKey: 'patient',
    header: 'Nome do Paciente',
    cell: ({ row }) => (
      <p className='text-14-medium'>{row.original.patient.name}</p>
    ),
  },
  {
    accessorKey: 'schedule',
    header: 'Agendamento',
    accessorFn: (row) => formatDateTime(row.schedule).dateTime,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <div className=''>
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    accessorKey: 'primaryPhysician',
    header: 'Medico Primario',
    cell: ({ row }) => {
      const doctor = Doctors.find(
        (dr) => dr.name === row.original.primaryPhysician,
      );
      return (
        <div className='flex items-center gap-2'>
          <Image
            src={doctor?.image!}
            alt={doctor?.name!}
            width={32}
            height={32}
            className='rounded-full'
          />
          <p className='text-14-medium'>{doctor?.name!}</p>
        </div>
      );
    },
  },

  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row: { original: data } }) => {
      return (
        <div className='flex gap-1'>
          <AppointmentModal
            type='schedule'
            patientId={data.patient.$id}
            userId={data.userId}
            appointment={data}
            title='Agendar Consulta'
            description='Por favor, confirme os seguintes detalhes para agendar a consulta'
          />
          <AppointmentModal
            type='cancel'
            patientId={data.patient.$id}
            userId={data.userId}
            appointment={data}
            title='Cancelar Consulta'
            description='Tem certeza que deseja cancelar a consulta?'
          />
        </div>
      );
    },
  },
];
