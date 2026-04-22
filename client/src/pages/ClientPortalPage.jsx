import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock3, ShieldCheck, MessageSquareMore } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import ChatWidget from '../components/chat/ChatWidget';

export default function ClientPortalPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);

  useEffect(() => {
    api.get('/cases/my-cases').then((res) => setCases(res.data.cases)).catch(() => undefined);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-borderSoft bg-black/70 backdrop-blur-xl">
        <div className="section-shell flex h-16 items-center justify-between gap-4 sm:h-20">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.24em] text-primaryLight sm:text-sm">Client Portal</p>
            <h1 className="mt-1 truncate text-xl font-bold sm:text-2xl lg:text-3xl">
              Welcome, {user?.name}
            </h1>
          </div>
          <div className="flex shrink-0 gap-2 sm:gap-3">
            <Link to="/recover" className="btn-primary text-sm sm:text-base">New Request</Link>
            <Link to="/" className="btn-secondary text-sm sm:text-base">Home</Link>
          </div>
        </div>
      </header>

      <main className="section-shell py-8 sm:py-10">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {[
            ['Active Cases', String(cases.length), FileText],
            ['Avg Review Window', '24–48 hrs', Clock3],
            ['Security Policy', 'No seed phrases', ShieldCheck],
            ['Private Chat', 'Enabled', MessageSquareMore]
          ].map(([label, value, Icon]) => (
            <article key={label} className="panel p-4 sm:p-6">
              <Icon className="text-primaryLight" size={20} />
              <p className="mt-4 text-xs text-textSoft sm:mt-6 sm:text-sm">{label}</p>
              <p className="mt-1 text-xl font-bold sm:text-2xl lg:text-3xl">{value}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 sm:mt-10">
          <section className="panel p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xl font-bold sm:text-2xl">My Recovery Requests</p>
                <p className="mt-1 text-sm text-textSoft sm:text-base">Track every request you have submitted.</p>
              </div>
            </div>
            <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
              {cases.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-borderSoft p-6 text-center text-sm text-textSoft sm:p-8 sm:text-base">
                  No cases yet. Submit your first recovery request.
                </div>
              ) : (
                cases.map((item) => (
                  <Link to={`/case/${item._id}`} key={item._id}>
                    <article className="rounded-[18px] border border-borderSoft bg-black/40 p-5 transition hover:border-primary/50 sm:rounded-[22px] sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-base font-semibold sm:text-xl">{item.recoveryType}</p>
                          <p className="mt-1 text-xs text-textSoft sm:text-sm">
                            {item.walletType} • {item.cryptoType} • {item.estimatedValue}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primaryLight sm:px-4">
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm text-textSoft sm:mt-4 sm:text-base">
                        {item.issueDescription}
                      </p>
                    </article>
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}