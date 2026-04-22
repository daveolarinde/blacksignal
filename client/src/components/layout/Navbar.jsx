import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Shield, UserCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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

  return (
    <header className="sticky top-0 z-50 border-b border-borderSoft bg-black/85 backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3 text-xl font-semibold tracking-tight">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white shadow-glow">
            <Shield size={20} />
          </div>
          <span>Crypto Asset Recovery</span>
        </Link>

        <nav className="hidden items-center gap-9 text-sm text-textSoft lg:flex">
          {navItems.map(([label, href]) => (
            <a key={label} href={href} className="transition hover:text-white">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <NavLink to={user.role === 'admin' ? '/admin' : '/portal'} className="btn-secondary gap-2 px-4 py-2.5">
                <UserCircle2 size={18} />
                {user.role === 'admin' ? 'Admin' : 'Portal'}
              </NavLink>
              <button
                className="btn-primary px-4 py-2.5"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/recover" className="btn-primary px-5 py-3">
              Recover Wallet
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
