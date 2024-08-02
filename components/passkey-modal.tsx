'use client';

import { decryptKey, encryptKey } from '@/lib/utils';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';

const PasskeyModal = () => {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const path = usePathname();

  const encryptedKey =
    typeof window !== 'undefined' ? localStorage.getItem('accessKey') : null;

  useEffect(() => {
    const accessKey = encryptedKey && decryptKey(encryptedKey);
    if (path) {
      if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        setOpen(false);
        router.push('/admin');
      } else {
        setOpen(true);
      }
    }
  }, [encryptedKey]);

  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passkey);
      localStorage.setItem('accessKey', encryptedKey);
      setOpen(false);
    } else {
      setError('Código de Admin incorreto');
    }
  };

  const closeModal = () => {
    setOpen(false);
    router.push('/');
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className='shad-alert-dialog'>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-start justify-between'>
            Verificação de acesso de Admin
            <Image
              src='/assets/icons/close.svg'
              alt='close'
              width={20}
              height={20}
              onClick={() => closeModal()}
              className='cursor-pointer'
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            Para acessar a pagina de admin, por favor insira o codigo OTP.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}
          >
            <InputOTPGroup className='shad-otp'>
              <InputOTPSlot className='shad-otp-slot' index={0} />
              <InputOTPSlot className='shad-otp-slot' index={1} />
              <InputOTPSlot className='shad-otp-slot' index={2} />
              <InputOTPSlot className='shad-otp-slot' index={3} />
              <InputOTPSlot className='shad-otp-slot' index={4} />
              <InputOTPSlot className='shad-otp-slot' index={5} />
            </InputOTPGroup>
          </InputOTP>
          {error && (
            <p className='shad-error text-14-regular mt-4 flex justify-center animate-pulse'>
              {error}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validatePasskey(e)}
            className='shad-primary-btn w-full'
          >
            Digite o codigo de Admin
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasskeyModal;
