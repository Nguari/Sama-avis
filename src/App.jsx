import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Accueil from './pages/Accueil';
import Signalement from './pages/Signalement';
import Carte from './pages/Carte';
import Suivi from './pages/Suivi';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        {/* La barre de navigation reste visible sur toutes les pages */}
        <Navbar /> 
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* On définit quel composant afficher selon l'URL */}
            <Route path="/" element={<Accueil />} />
            <Route path="/signaler" element={<Signalement />} />
            <Route path="/carte" element={<Carte />} />
            <Route path="/suivi" element={<Suivi />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;