// src/app/App.tsx
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ScoreProvider } from './contexts/ScoreContext';

function AppContent() {
  return (
    <ScoreProvider>
      <RouterProvider router={router} />
    </ScoreProvider>
  );
}

export default function App() {
  return <AppContent />;
}