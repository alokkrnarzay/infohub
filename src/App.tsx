import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Education from './pages/Education';
import Events from './pages/Events';
import Scholarships from './pages/Scholarships';
import Resources from './pages/Resources';
import Support from './pages/Support';
import Login from './pages/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/Privacy';
import TermsOfService from './pages/Terms';
import Donate from './pages/Donate';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/education" element={<Education />} />
                <Route path="/events" element={<Events />} />
                <Route path="/scholarships" element={<Scholarships />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/support" element={<Support />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
