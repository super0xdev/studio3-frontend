/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx';
import React, { FC, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PuffLoader } from 'react-spinners';

import styles from './index.module.scss';

import { LockedStatus } from '@/global/types';
import {
  useIsAuthLoading,
  useUpdateWalletModal,
  useWalletModalOpened,
} from '@/state/solana/hooks';
import useLogin from '@/hooks/useLogin';
import { useAuthToken, useAuthWallet } from '@/state/application/hooks';

interface ILockScreen {
  status: LockedStatus;
}

const LockScreen: FC<ILockScreen> = ({ status }) => {
  const { publicKey } = useWallet();
  const walletModalOpened = useWalletModalOpened();
  const updateWalletModal = useUpdateWalletModal();
  const authToken = useAuthToken();
  const authWallet = useAuthWallet();
  const login = useLogin();
  const isAuthLoading = useIsAuthLoading();

  useEffect(() => {
    if (
      status === 'WALLET_REQUIRED' &&
      !publicKey &&
      !walletModalOpened &&
      !authWallet
    ) {
      updateWalletModal(true);
      return;
    }
  }, [status, publicKey, authWallet, walletModalOpened]);

  useEffect(() => {
    if (status === 'AUTH_REQUIRED' && !authToken && !isAuthLoading) {
      login();
    }
  }, [status, authToken, isAuthLoading]);

  return (
    <div
      className={clsx(styles.screen, {
        [styles.locked]: status !== 'LOGGED_IN',
      })}
      onClick={login}
    >
      <PuffLoader color="#fff" />
      Authenticating ...
    </div>
  );
};

export default LockScreen;
