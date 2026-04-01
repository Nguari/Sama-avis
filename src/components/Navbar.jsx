import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-white shadow-md p-4 mb-6">
    <div className="container mx-auto flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">Sama Avis</Link>
      <div className="space-x-4 font-medium">
        <Link to="/signaler" className="hover:text-blue-500">Signaler</Link>
        <Link to="/carte" className="hover:text-blue-500">Carte</Link>
        <Link to="/suivi" className="hover:text-blue-500">Suivi</Link>
        <Link to="/admin" className="text-red-600">Admin</Link>
      </div>
    </div>
  </nav>
);

export default Navbar;