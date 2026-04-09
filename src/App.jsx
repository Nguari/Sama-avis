// FRONTEND — App.jsx : Composant racine. Définit toutes les routes de l'application.

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useTrackVisite from './hooks/useTrackVisite';
import Navbar        from './components/Navbar';
import Footer        from './components/Footer';
import ScrollToTop   from './components/ScrollToTop';
import Accueil       from './pages/Accueil';
import Signalement   from './pages/Signalement';
import Carte         from './pages/Carte';
import Suivi         from './pages/Suivi';
import Admin         from './pages/Admin';
import CreateAdmin   from './pages/CreateAdmin';
import Login         from './pages/Login';
import Register      from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword  from './pages/ResetPassword';
import NotFound       from './pages/NotFound';

// Composant interne pour utiliser le hook (doit être dans le Router)
const AppContent = () => {
  useTrackVisite();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/"                element={<Accueil />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />
          <Route path="/signaler" element={<Signalement />} />
          <Route path="/suivi"    element={<Suivi />} />
          <Route path="/admin"              element={<Admin />} />
          <Route path="/admin/create-admin" element={<CreateAdmin />} />
          <Route path="/carte"              element={<Carte />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
