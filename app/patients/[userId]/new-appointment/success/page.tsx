import { Button } from '@/components/ui/button';
import { Doctors } from '@/constants';
import { getAppointment } from '@/lib/actions/appointment.action';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

const SuccessPage = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || '';
  const appointment = await getAppointment(appointmentId);
  const doctor = Doctors.find(
    (doc) => doc.name === appointment.primaryPhysician,
  );
  return (
    <div className='flex h-screen max-h-screen px-[5%]'>
      <div className='success-img'>
        <Link href='/'>
          <Image
            src='/assets/icons/logo-full.svg'
            height={1000}
            width={1000}
            alt='logo'
            className='h-10 w-fit'
          />
        </Link>
        <section className='flex flex-col items-center'>
          <Image
            src='/assets/gifs/success.gif'
            height={300}
            width={280}
            alt='success'
          />
          <h2 className='header mb-6 max-w-[600px] text-center'>
            A sua <span className='text-green-500'>consulta</span> foi agendada
            com successo!
          </h2>
          <p className='text-dark-700 text-center'>
            Você receberá uma mensagem de confirmação com os detalhes da
            consulta.
          </p>
        </section>
        <section className='request-details'>
          <p className=''>Detalhes do agendamento:</p>
          <div className='flex items-center gap-3'>
            <Image
              src={doctor?.image!}
              height={100}
              width={100}
              className='size-6 rounded-full'
              alt='doctor'
            />
            <p className='whitespace-nowrap'>Dr. {doctor?.name}</p>
          </div>
          <div className='flex gap-2'>
            <Image
              src='/assets/icons/calendar.svg'
              height={24}
              width={24}
              alt='calendar'
            />
            <p>{formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>
        <Button asChild variant={'outline'} className='shad-primary-btn'>
          <Link href={`/patients/${userId}/new-appointment`}>
            Agendar outra consulta
          </Link>
        </Button>
        <p className='copyright my-12'>©2024 CarePulse</p>
      </div>
    </div>
  );
};

export default SuccessPage;
