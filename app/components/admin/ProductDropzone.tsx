'use client';

import {
  AlertCircleIcon,
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  Trash2Icon,
  UploadIcon,
  VideoIcon,
  XIcon,
} from 'lucide-react';

import { formatBytes, useFileUpload } from '@/app/hooks/use-file-upload';
import { Button } from '@/app/components/ui/button';
import { Dispatch, SetStateAction, useEffect } from 'react';

const getFileIcon = (file: { file: File | { type: string; name: string } }) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;

  const iconMap = {
    archive: {
      conditions: (type: string, name: string) =>
        type.includes('zip') ||
        type.includes('archive') ||
        name.endsWith('.zip') ||
        name.endsWith('.rar'),
      icon: FileArchiveIcon,
    },
    audio: {
      conditions: (type: string) => type.includes('audio/'),
      icon: HeadphonesIcon,
    },
    excel: {
      conditions: (type: string, name: string) =>
        type.includes('excel') ||
        name.endsWith('.xls') ||
        name.endsWith('.xlsx'),
      icon: FileSpreadsheetIcon,
    },
    image: {
      conditions: (type: string) => type.startsWith('image/'),
      icon: ImageIcon,
    },
    pdf: {
      conditions: (type: string, name: string) =>
        type.includes('pdf') ||
        name.endsWith('.pdf') ||
        type.includes('word') ||
        name.endsWith('.doc') ||
        name.endsWith('.docx'),
      icon: FileTextIcon,
    },
    video: {
      conditions: (type: string) => type.includes('video/'),
      icon: VideoIcon,
    },
  };

  for (const { icon: Icon, conditions } of Object.values(iconMap)) {
    if (conditions(fileType, fileName)) {
      return <Icon className='size-5 opacity-60' />;
    }
  }

  return <FileIcon className='size-5 opacity-60' />;
};

const getFilePreview = (file: {
  file: File | { type: string; name: string; url?: string };
}) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;

  const renderImage = (src: string) => (
    <img
      alt={fileName}
      className='size-full rounded-t-[inherit] object-cover'
      src={src}
    />
  );

  return (
    <div className='flex aspect-square items-center justify-center overflow-hidden rounded-t-[inherit] bg-accent'>
      {fileType.startsWith('image/') ? (
        file.file instanceof File ? (
          (() => {
            const previewUrl = URL.createObjectURL(file.file);
            return renderImage(previewUrl);
          })()
        ) : file.file.url ? (
          renderImage(file.file.url)
        ) : (
          <ImageIcon className='size-5 opacity-60' />
        )
      ) : (
        getFileIcon(file)
      )}
    </div>
  );
};

const ProductDropzone = ({
  setFiles,
}: {
  setFiles: Dispatch<SetStateAction<File[]>>;
}) => {
  const maxSizeMB = 8;
  const maxSize = maxSizeMB * 1024 * 1024; // 8MB default
  const maxFiles = 4;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    multiple: true,
  });

  useEffect(() => {
    if (files.length > 0) {
      setFiles(files.map((f) => f.file as File));
    } else {
      setFiles([]);
    }
  }, [files]);

  return (
    <div className='flex flex-col gap-2'>
      {/* Drop area */}
      <div
        className='relative flex min-h-52 flex-col items-center not-data-[files]:justify-center overflow-hidden rounded-xl border border-black dark:border-white  p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50'
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          {...getInputProps()}
          aria-label='Upload image file'
          className='sr-only'
        />
        {files.length > 0 ? (
          <div className='flex w-full flex-col gap-3'>
            <div className='flex items-center justify-between gap-2'>
              <h3 className='truncate font-medium text-sm'>
                Files ({files.length})
              </h3>
              <div className='flex gap-2'>
                <Button
                  className='dark:border-white border-black'
                  onClick={openFileDialog}
                  size='sm'
                  variant='outline'
                  type='button'
                >
                  <UploadIcon
                    aria-hidden='true'
                    className='-ms-0.5 size-3.5 '
                  />
                  Add files
                </Button>
                <Button
                  className='dark:border-white border-black'
                  onClick={clearFiles}
                  size='sm'
                  variant='outline'
                  type='button'
                >
                  <Trash2Icon
                    aria-hidden='true'
                    className='-ms-0.5 size-3.5 '
                  />
                  Remove all
                </Button>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
              {files.map((file) => (
                <div
                  className='relative flex flex-col rounded-md border bg-background'
                  key={file.id}
                >
                  {getFilePreview(file)}
                  <Button
                    aria-label='Remove image'
                    className='-top-2 -right-2 absolute size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background'
                    onClick={() => removeFile(file.id)}
                    size='icon'
                    type='button'
                  >
                    <XIcon className='size-3.5' />
                  </Button>
                  <div className='flex min-w-0 flex-col gap-0.5 border-t p-3'>
                    <p className='truncate font-medium text-[13px]'>
                      {file.file.name}
                    </p>
                    <p className='truncate text-muted-foreground text-xs'>
                      {formatBytes(file.file.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center px-4 py-3 text-center'>
            <div
              aria-hidden='true'
              className='mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border border-black dark:border-white bg-background'
            >
              <ImageIcon className='size-5 ' />
            </div>
            <p className='mb-1.5 font-medium text-sm'>Drop your files here</p>
            <p className='text-muted-foreground text-xs'>
              Max {maxFiles} files ∙ Up to {maxSizeMB}MB
            </p>
            <Button
              className='mt-4 border-black dark:border-white'
              onClick={openFileDialog}
              type='button'
              variant='outline'
            >
              <UploadIcon aria-hidden='true' className='-ms-1' />
              Select images
            </Button>
          </div>
        )}
      </div>
      {errors.length > 0 && (
        <div
          className='flex items-center gap-1 text-destructive text-xs'
          role='alert'
        >
          <AlertCircleIcon className='size-3 shrink-0' />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
};

export default ProductDropzone;
