import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { UserCircle2, Menu, X, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../store/SocketContext';
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
  const { notifications, unreadCount, markAllRead } = useSocket();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);

  const handleNavClick = () => setMenuOpen(false);

  const handleBellClick = () => {
    setBellOpen(prev => !prev);
    markAllRead();
  };

  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const NotificationBell = () => (
    <div className="relative" ref={bellRef}>
      <button
        onClick={handleBellClick}
        className="relative flex items-center justify-center rounded-md p-2 text-textSoft transition hover:text-white"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {bellOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-borderSoft bg-black/95 shadow-2xl z-50 overflow-hidden">
          <div className="border-b border-borderSoft px-4 py-3 text-sm font-semibold text-white">
            Notifications
          </div>
          <ul className="max-h-72 overflow-y-auto divide-y divide-borderSoft">
            {notifications.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-textSoft">
                No notifications yet
              </li>
            ) : (
              notifications.map((n, i) => (
                <li
                  key={i}
                  onClick={() => {
                    navigate(user.role === 'admin' ? '/admin' : '/portal');
                    setBellOpen(false);
                  }}
                  className="cursor-pointer px-4 py-3 transition hover:bg-white/5"
                >
                  <p className="text-sm font-medium text-white">{n.senderName}</p>
                  <p className="truncate text-sm text-textSoft">{n.preview}</p>
                  <p className="mt-1 text-xs text-textSoft/60">
                    {new Date(n.timestamp).toLocaleTimeString()}
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-borderSoft bg-black/85 backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center justify-between gap-6">

        <Link to="/" className="flex items-center gap-3 text-xl font-semibold tracking-tight" onClick={handleNavClick}>
          <img src={Logo} alt="Logo" className="w-40" />
        </Link>

        <nav className="hidden items-center gap-9 text-sm text-textSoft lg:flex">
          {navItems.map(([label, href]) => (
            <a key={label} href={href} className="transition hover:text-white">
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <NotificationBell />
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
              <Link to="/login" className="btn-secondary px-5 py-3">Login</Link>
              <Link to="/recover" className="btn-primary px-5 py-3">Recover Wallet</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {user && <NotificationBell />}
          <button
            className="flex items-center justify-center rounded-md p-2 text-textSoft transition hover:text-white"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
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
                <Link to="/login" className="btn-secondary px-5 py-3 text-center" onClick={handleNavClick}>
                  Login
                </Link>
                <Link to="/recover" className="btn-primary px-5 py-3 text-center" onClick={handleNavClick}>
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