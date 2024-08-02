import { cn } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';
import { Button } from './ui/button';

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function SubmitButton({
  isLoading,
  className,
  children,
}: ButtonProps) {
  return (
    <Button
      type='submit'
      disabled={isLoading}
      className={cn('shad-primary-btn w-full', className)}
    >
      {isLoading ? (
        <div className='flex items-center gap-2'>
          <LoaderCircle className='h-6 w-6 animate-spin' />
          Enviando...
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
