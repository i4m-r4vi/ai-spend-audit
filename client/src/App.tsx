import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AuditFormPage } from './pages/AuditFormPage';
import { ResultsPage } from './pages/ResultsPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen font-sans">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/audit" element={<AuditFormPage />} />
            <Route path="/share/:id" element={<ResultsPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
