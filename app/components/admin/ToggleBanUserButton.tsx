'use client';

import { useTransition } from 'react';
import { Button } from '../ui/button';
import { banUserAsAdmin, unbanUserAsAdmin } from '@/lib/actions/auth';
import { destructiveToast, successToast } from '@/lib/utils';
import { UserWithRole } from 'better-auth/plugins';
import ScreenSpinner from '../ScreenSpinner';

const ToggleBanUserButton = ({ user }: { user: UserWithRole }) => {
  const [isPending, startTransition] = useTransition();

  const handleBanUser = () => {
    startTransition(async () => {
      const res = await banUserAsAdmin(user.id);

      if (!res.success) {
        destructiveToast(res.message);
        return;
      }

      successToast(res.message);
    });
  };
  const handleUnbanUser = () => {
    startTransition(async () => {
      const res = await unbanUserAsAdmin(user.id);

      if (!res.success) {
        destructiveToast(res.message);
        return;
      }

      successToast(res.message);
    });
  };

  return (
    <>
      {isPending && <ScreenSpinner mutate={true} />}
      {user.banned ? (
        <Button
          className={'bg-blue-500 text-white hover:bg-blue-600'}
          variant={'default'}
          size={'sm'}
          onClick={handleUnbanUser}
        >
          Unban
        </Button>
      ) : (
        <Button
          className={'bg-amber-400 text-white hover:bg-amber-500'}
          variant={'default'}
          size={'sm'}
          onClick={handleBanUser}
        >
          Ban
        </Button>
      )}
    </>
  );
};

export default ToggleBanUserButton;
