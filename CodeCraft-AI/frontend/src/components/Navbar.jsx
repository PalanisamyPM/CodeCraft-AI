import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        <span className="brand-prompt">&gt;_</span>
        <span className="brand-name">CodeCraft</span>
        <span className="brand-badge">AI</span>
      </NavLink>

      <nav className="navbar-links">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/generator" className={linkClass}>
          Generator
        </NavLink>
        <NavLink to="/history" className={linkClass}>
          History
        </NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
