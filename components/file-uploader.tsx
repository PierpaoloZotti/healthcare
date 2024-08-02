'use client';

import { convertFileToUrl } from '@/lib/utils';
import Image from 'next/image';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
};

export const FileUploader = ({ files, onChange }: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onChange(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className='file-upload'>
      <input {...getInputProps()} />
      {files && files.length > 0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          alt='document image'
          width={1000}
          height={1000}
          className='max-h-[400px] overflow-hidden object-cover'
        />
      ) : (
        <>
          <Image
            src='/assets/icons/upload.svg'
            alt='upload'
            height={40}
            width={40}
          />
          <div className='file-upload_label'>
            <p className='text-14-regular'>
              <span className='text-green-500'>Clique para carregar </span> o
              arraste e solte aqui
            </p>
            <p>SVG, PNG, JPG ou GIF (tamanho max. 800x400)</p>
          </div>
        </>
      )}
    </div>
  );
};
