import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from './ConfirmModal';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Cerrar dropdown al hacer click fuera del mismo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPortalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Scrollspy: marca como activa la sección visible debajo del header sticky.
    const ids = ['institucion', 'niveles', 'servicios', 'noticias', 'idiomas'];

    const handleScroll = () => {
      const header = document.querySelector('.topbar');
      const offset = (header ? header.offsetHeight : 72) + 20;

      // Si estamos arriba de todo, la categoría activa es "Inicio" ('').
      if (window.scrollY < 80) {
        setActiveSection('');
        return;
      }

      // Desde la sección Preinscripción hacia abajo marcamos "Contacto"
      const preins = document.getElementById('preinscripcion');
      if (preins && window.scrollY >= preins.offsetTop - offset) {
        setActiveSection('contacto');
        return;
      }

      let current = '';
      let maxTop = -Infinity;
      ids.forEach((id) => {
        const sec = document.getElementById(id);
        if (sec && window.scrollY >= sec.offsetTop - offset && sec.offsetTop > maxTop) {
          current = id;
          maxTop = sec.offsetTop;
        }
      });
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleLogout = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsOpen(false);
    setPortalOpen(false);
    setLogoutConfirmOpen(true);
  };

  const confirmarLogout = () => {
    setLogoutConfirmOpen(false);
    logout();
    navigate('/');
  };

  return (
    <>
    <header className="topbar">
      <div className="topbar-inner">
        {/* Logo */}
        <a href="/" className="logo">
          <div className="logo-icon">
            <img src="/img/logo.png" alt="Logo Educar" />
          </div>
          <div className="logo-text">
            <span className="title">EDUCAR</span>
            <span className="subtitle">Para Transformar</span>
          </div>
        </a>

        {/* Nav Desktop (Centro) */}
        <nav className="nav-desktop">
          <a href="/" className={activeSection === '' ? 'active' : ''}>Inicio</a>
          <a href="#institucion" className={activeSection === 'institucion' ? 'active' : ''}>Nosotros</a>
          <a href="#niveles" className={activeSection === 'niveles' ? 'active' : ''}>Niveles</a>
          <a href="#servicios" className={activeSection === 'servicios' ? 'active' : ''}>Servicios</a>
          <a href="#noticias" className={activeSection === 'noticias' ? 'active' : ''}>Actividades</a>
          <a href="#idiomas" className={activeSection === 'idiomas' ? 'active' : ''}>Idiomas</a>
          <a href="#contacto" className={activeSection === 'contacto' ? 'active' : ''}>Contacto</a>
        </nav>

        {/* Buttons / Portal Dropdown (Derecha) */}
        <div className="topbar-btns">
          {!user ? (
            <div className="portal-dropdown-container portal-dropdown-wrapper" ref={dropdownRef}>
              <button
                type="button"
                className={`portal-trigger-btn ${portalOpen ? 'open' : ''}`}
                onClick={() => setPortalOpen(!portalOpen)}
                aria-expanded={portalOpen}
                aria-label="Menú de acceso a portales institucionales"
              >
                <span>Portal Institucional</span>
                <span className="chevron">▾</span>
              </button>

              {portalOpen && (
                <div className="portal-dropdown-menu">
                  <Link
                    to="/login?role=padre"
                    className="portal-dropdown-item pdi-item-padre"
                    onClick={() => setPortalOpen(false)}
                  >
                    <div className="portal-dropdown-icon pdi-padre">👨‍👩‍👧</div>
                    <div className="portal-dropdown-text">
                      <span className="portal-dropdown-title">Portal Familias</span>
                      <span className="portal-dropdown-desc">Seguimiento, pagos y boletines</span>
                    </div>
                  </Link>

                  <Link
                    to="/login?role=alumno"
                    className="portal-dropdown-item pdi-item-alumno"
                    onClick={() => setPortalOpen(false)}
                  >
                    <div className="portal-dropdown-icon pdi-alumno">🎒</div>
                    <div className="portal-dropdown-text">
                      <span className="portal-dropdown-title">Portal Alumnos</span>
                      <span className="portal-dropdown-desc">Clases, notas y actividades</span>
                    </div>
                  </Link>

                  <Link
                    to="/login?role=docente"
                    className="portal-dropdown-item pdi-item-docente"
                    onClick={() => setPortalOpen(false)}
                  >
                    <div className="portal-dropdown-icon pdi-docente">👨‍🏫</div>
                    <div className="portal-dropdown-text">
                      <span className="portal-dropdown-title">Portal Docentes</span>
                      <span className="portal-dropdown-desc">Asistencia y calificaciones</span>
                    </div>
                  </Link>

                  <div className="portal-dropdown-divider"></div>

                  <Link
                    to="/login?role=admin"
                    className="portal-dropdown-item pdi-item-admin"
                    onClick={() => setPortalOpen(false)}
                  >
                    <div className="portal-dropdown-icon pdi-admin">🛡️</div>
                    <div className="portal-dropdown-text">
                      <span className="portal-dropdown-title">Administración</span>
                      <span className="portal-dropdown-desc">Gestión escolar e informes</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="user-badge-container">
              <span className="user-greeting">Hola, {user.nombre}</span>
              <Link to={`/${user.rol}`} className="btn-panel">Mi Panel</Link>
              <button type="button" onClick={handleLogout} className="btn-logout">Salir</button>
            </div>
          )}

          {/* Botón menú móvil */}
          <button 
            type="button" 
            className="hamburger" 
            id="menuBtn" 
            onClick={toggleMenu}
            aria-label="Abrir menú de navegación"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <nav className={`mobile-nav ${isOpen ? 'open' : ''}`} id="mobileNav">
        <a href="/" onClick={() => setIsOpen(false)}>Inicio</a>
        <a href="#institucion" onClick={() => setIsOpen(false)}>Nosotros</a>
        <a href="#niveles" onClick={() => setIsOpen(false)}>Niveles Educativos</a>
        <a href="#servicios" onClick={() => setIsOpen(false)}>Servicios</a>
        <a href="#noticias" onClick={() => setIsOpen(false)}>Actividades</a>
        <a href="#idiomas" onClick={() => setIsOpen(false)}>Idiomas</a>
        <a href="#contacto" onClick={() => setIsOpen(false)}>Contacto</a>
        
        {!user ? (
          <div className="mobile-portales-section">
            <span className="mobile-portales-title">Portales Institucionales</span>
            <Link to="/login?role=padre" className="mobile-portal-link" onClick={() => setIsOpen(false)}>
              <span>👨‍👩‍👧</span> <span>Portal Familias</span>
            </Link>
            <Link to="/login?role=alumno" className="mobile-portal-link" onClick={() => setIsOpen(false)}>
              <span>🎒</span> <span>Portal Alumnos</span>
            </Link>
            <Link to="/login?role=docente" className="mobile-portal-link" onClick={() => setIsOpen(false)}>
              <span>👨‍🏫</span> <span>Portal Docentes</span>
            </Link>
            <Link to="/login?role=admin" className="mobile-portal-link" onClick={() => setIsOpen(false)}>
              <span>🛡️</span> <span>Portal Administración</span>
            </Link>
          </div>
        ) : (
          <div className="mobile-portales-section">
            <Link to={`/${user.rol}`} onClick={() => setIsOpen(false)} style={{ color: 'var(--blue)', fontWeight: 'bold' }}>
              Ir a Mi Panel ({user.nombre})
            </Link>
            <a href="#" onClick={handleLogout} style={{ color: '#dc2626' }}>Cerrar Sesión</a>
          </div>
        )}
      </nav>
    </header>

    {/* Modal de confirmación de cierre de sesión (RNF08) */}
    {logoutConfirmOpen && (
      <ConfirmModal
        title="Cerrar sesión"
        message="¿Estás seguro de que deseas cerrar la sesión?"
        confirmLabel="Sí, cerrar sesión"
        onCancel={() => setLogoutConfirmOpen(false)}
        onConfirm={confirmarLogout}
      />
    )}
    </>
  );
};

export default Navbar;
