'use client';

import { Trash2Icon, TriangleAlertIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { useState } from 'react';
import { successToast, destructiveToast } from '@/lib/utils';
import { useTransition } from 'react';
import { Spinner } from '../ui/spinner';

type DeleteDialogProps = {
  id: string;
  action: (id: string) => Promise<{ success: boolean; message: string }>;
  type: 'order' | 'user' | 'product';
};

const DeleteDialog = ({ id, action, type }: DeleteDialogProps) => {
  const [openModal, setOpenModal] = useState(false);

  const [isPending, startTransition] = useTransition();

  const handleDeleteOrder = () => {
    startTransition(async () => {
      const res = await action(id);
      if (!res.success) {
        destructiveToast(res.message);
        return;
      } else {
        successToast(res.message);
        setOpenModal(false);
      }
    });
  };

  return (
    <>
      <Button
        onClick={() => setOpenModal(!openModal)}
        variant={type === 'order' || type === 'user' ? 'destructive' : 'ghost'}
        size={type === 'order' || type === 'user' ? 'sm' : 'icon'}
      >
        {type === 'order' || type === 'user' ? 'Delete' : <Trash2Icon />}
      </Button>
      <AlertDialog open={openModal} onOpenChange={setOpenModal}>
        <AlertDialogContent>
          <AlertDialogHeader className='items-center'>
            <div className='bg-destructive mx-auto mb-2 flex size-12 items-center justify-center rounded-full'>
              <TriangleAlertIcon className='text-white size-6 mb-0.5' />
            </div>
            <AlertDialogTitle>
              Are you absolutely sure you want to delete it?
            </AlertDialogTitle>
            <AlertDialogDescription className='text-center dark:text-white/80'>
              This action cannot be undone. This will permanently delete it from
              the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              disabled={isPending}
              className='bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive text-white'
              onClick={handleDeleteOrder}
            >
              {isPending ? (
                <>
                  <Spinner className='size-5 text-white' /> Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteDialog;
