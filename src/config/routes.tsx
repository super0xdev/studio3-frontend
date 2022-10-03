import React from 'react';

import { RouteType } from '@/config/types';
import HomePage from '@/pages/Home';

export const APP_ROUTES: RouteType[] = [
  {
    path: '/home',
    component: <HomePage />,
    title: 'Home',
  },
];

export const DEFAULT_ROUTE = '/home';
