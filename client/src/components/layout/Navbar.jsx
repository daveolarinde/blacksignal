import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { UserCircle2, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from "../../assets/logo.png";

const navItems = [
  ['Pricing', '#pricing'],
  ['Testimonials', '#testimonials'],
  ['Press', '#press'],
  ['About', '#about'],
  ['Blog', '#faq']
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route/hash navigation
  const handleNavClick = () => setMenuOpen(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-borderSoft bg-black/85 backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 text-xl font-semibold tracking-tight" onClick={handleNavClick}>
          <img src={Logo} alt="Logo" className="w-40" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-9 text-sm text-textSoft lg:flex">
          {navItems.map(([label, href]) => (
            <a key={label} href={href} className="transition hover:text-white">
              {label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <NavLink
                to={user.role === 'admin' ? '/admin' : '/portal'}
                className="btn-secondary gap-2 px-4 py-2.5"
              >
                <UserCircle2 size={18} />
                {user.role === 'admin' ? 'Admin' : 'Portal'}
              </NavLink>
              <button
                className="btn-primary px-4 py-2.5"
                onClick={() => { logout(); navigate('/'); }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary px-5 py-3">
                Login
              </Link>
              <Link to="/recover" className="btn-primary px-5 py-3">
                Recover Wallet
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="flex items-center justify-center rounded-md p-2 text-textSoft transition hover:text-white lg:hidden"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out lg:hidden
          ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <nav className="flex flex-col border-t border-borderSoft bg-black/95 px-6 pb-6 pt-4">
          {navItems.map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={handleNavClick}
              className="border-b border-borderSoft py-4 text-sm text-textSoft transition hover:text-white"
            >
              {label}
            </a>
          ))}

          {/* Mobile CTA */}
          <div className="mt-5 flex flex-col gap-3">
            {user ? (
              <>
                <NavLink
                  to={user.role === 'admin' ? '/admin' : '/portal'}
                  className="btn-secondary flex items-center justify-center gap-2 px-4 py-2.5"
                  onClick={handleNavClick}
                >
                  <UserCircle2 size={18} />
                  {user.role === 'admin' ? 'Admin' : 'Portal'}
                </NavLink>
                <button
                  className="btn-primary px-4 py-2.5"
                  onClick={() => { logout(); navigate('/'); handleNavClick(); }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-secondary px-5 py-3 text-center"
                  onClick={handleNavClick}
                >
                  Login
                </Link>
                <Link
                  to="/recover"
                  className="btn-primary px-5 py-3 text-center"
                  onClick={handleNavClick}
                >
                  Recover Wallet
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}