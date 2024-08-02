import {
  getRecentAppointmentsList,
  RecentAppointmentsList,
} from '@/lib/actions/appointment.action';
import Image from 'next/image';
import Link from 'next/link';
import StatCard from './_components/stat-card';
import { columns } from './_components/table/columns';
import { DataTable } from './_components/table/data-table';

const AdminDashboard = async () => {
  const appointments: RecentAppointmentsList =
    await getRecentAppointmentsList();
  const {
    totalCount,
    cancelledCount,
    documents,
    pendingCount,
    scheduledCount,
  } = appointments;
  console.log('appointments:', appointments);

  return (
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
      <header className='admin-header'>
        <Link href='/' className='cursor-pointer'>
          <Image
            src='/assets/icons/logo-full.svg'
            alt='logo'
            width={1000}
            height={1000}
            className='h-10 w-fit'
          />
        </Link>
        <p className='text-16-semibold'>Admin Dashboard</p>
      </header>
      <main className='admin-main'>
        <section className='w-full space-y-4'>
          <h1 className='header'>Bem vindo</h1>
          <p className='text-dark-700'>
            Aqui pode gerenciar todos os agendamento da clinica
          </p>
        </section>
        <section className='admin-stat'>
          <StatCard
            type='appointment'
            count={scheduledCount}
            label='Consultas agendadas'
            icon='/assets/icons/appointments.svg'
          />
          <StatCard
            type='pending'
            count={pendingCount}
            label='Consultas pendentes'
            icon='/assets/icons/pendente.svg'
          />
          <StatCard
            type='cancelled'
            count={cancelledCount}
            label='Consultas canceladas'
            icon='/assets/icons/cancelado.svg'
          />
        </section>
        <DataTable data={documents} columns={columns} />
      </main>
    </div>
  );
};

export default AdminDashboard;
