import React from 'react';
import CollectionsSharpIcon from '@mui/icons-material/CollectionsSharp';
import DashboardSharpIcon from '@mui/icons-material/DashboardSharp';
import ArchitectureSharpIcon from '@mui/icons-material/ArchitectureSharp';
import HelpSharpIcon from '@mui/icons-material/HelpSharp';

import { RouteType } from '@/config/types';
import GalleryPage from '@/pages/Gallery';
import EditorPage from '@/pages/Editor';

export const APP_ROUTES: RouteType[] = [
  {
    path: '/gallery',
    component: <GalleryPage />,
    title: 'Projects',
    Icon: CollectionsSharpIcon,
    isMenuLinked: true,
    isDisabled: false,
  },
  {
    path: '/gallery#Dashboard',
    component: <GalleryPage />,
    title: 'Dashboard',
    Icon: DashboardSharpIcon,
    isMenuLinked: true,
    isDisabled: true,
  },
  {
    path: '/editor',
    component: <EditorPage />,
    title: 'Canvas',
    Icon: ArchitectureSharpIcon,
    isMenuLinked: true,
    isDisabled: false,
  },
  {
    path: '/gallery#Support',
    component: <GalleryPage />,
    title: 'Support',
    Icon: HelpSharpIcon,
    isMenuLinked: true,
    isDisabled: true,
  },
];

export const DEFAULT_ROUTE = '/gallery';
