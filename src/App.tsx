import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { APP_ROUTES, DEFAULT_ROUTE } from '@/config/routes';

export default function App() {
  return (
    <div className="App">
      <Routes>
        {APP_ROUTES.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
        <Route path="*" element={<Navigate to={DEFAULT_ROUTE} replace />} />
      </Routes>
    </div>
  );
}
