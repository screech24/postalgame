import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import LoadingScreen from './components/UI/LoadingScreen';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./components/Game/HomePage'));
const GamePage = lazy(() => import('./components/Game/GamePage'));
const SettingsPage = lazy(() => import('./components/UI/SettingsPage'));
const NotFoundPage = lazy(() => import('./components/UI/NotFoundPage'));

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

function App() {
  return (
    <AppContainer>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppContainer>
  );
}

export default App; 