// src/App.jsx
import { Link } from 'react-router-dom';
import AppRoutes from './routes';

export default function App() {
  return (
    <div>
      {/* Barre de navigation */}
      <nav className="bg-blue-500 p-4">
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-white hover:text-blue-200">Accueil</Link>
          </li>
          <li>
            <Link to="/about" className="text-white hover:text-blue-200">À propos</Link>
          </li>
          <li>
            <Link to="/contact" className="text-white hover:text-blue-200">Contact</Link>
          </li>
        </ul>
      </nav>

      {/* Contenu des routes */}
      <AppRoutes />
    </div>
  );
}