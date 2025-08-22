import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import NoticeBar from '@/components/NoticeBar';

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
import NotFoundPage from './pages/NotFound';
import PrivacyPolicy from './pages/Privacy';
import TermsOfService from './pages/Terms';
import Donate from './pages/Donate';
import StatusPage from './pages/Status';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
  <BrowserRouter basename={import.meta.env.BASE_URL}>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <NoticeBar />
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
                <Route path="/status" element={<StatusPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFoundPage />} />
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
