'use client';

import AppointmentForm from '@/components/forms/appointment-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Appointment } from '@/types/appwrite.types';
import { useState } from 'react';

interface AppointmentModalProps {
  type: 'schedule' | 'cancel';
  title: string;
  description: string;
  patientId: string;
  userId: string;
  appointment?: Appointment;
}

const AppointmentModal = ({
  type,
  title,
  description,
  patientId,
  userId,
  appointment,
}: AppointmentModalProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={'ghost'}
          size={'sm'}
          className={`capitalize ${type === 'schedule' && 'text-green-500'} ${
            type === 'cancel' && 'text-red-500'
          }`}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className='shad-dialog sm:max-w-md'>
        <DialogHeader className='mb-4 space-y-3'>
          <DialogTitle className='capitalize'>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <AppointmentForm
          type={type}
          userId={userId}
          patientId={patientId}
          appointment={appointment}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
