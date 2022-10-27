import React, { useEffect, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';

import { LockedStatus } from '@/global/types';
import { APP_ROUTES, DEFAULT_ROUTE } from '@/config/routes';
import PageLayout from '@/components/navigation/PageLayout';
import LockScreen from '@/components/navigation/LockScreen';
import { useUpdateTokenMap } from '@/state/solana/hooks';
import {
  useAuthToken,
  useAuthWallet,
  useUpdateAuthToken,
} from '@/state/application/hooks';

import '@pqina/pintura/pintura.css';
import '@/assets/styles/pintura.scss';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function App() {
  const authToken = useAuthToken();
  const authWallet = useAuthWallet();
  const { publicKey } = useWallet();
  const updateAuthToken = useUpdateAuthToken();

  const lockedStatus: LockedStatus = useMemo(() => {
    if (!publicKey) return 'WALLET_REQUIRED';
    if (!authToken) return 'AUTH_REQUIRED';
    return 'LOGGED_IN';
  }, [authToken, publicKey]);

  useEffect(() => {
    if (publicKey && authWallet !== publicKey.toBase58()) updateAuthToken(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, authWallet]);

  useUpdateTokenMap();

  return (
    <PageLayout>
      <LockScreen status={lockedStatus} />
      <Routes>
        {APP_ROUTES.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
        <Route path="*" element={<Navigate to={DEFAULT_ROUTE} replace />} />
      </Routes>
    </PageLayout>
  );
}
