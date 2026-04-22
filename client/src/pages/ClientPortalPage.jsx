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
        <div className="section-shell flex h-20 items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primaryLight">Client Portal</p>
            <h1 className="mt-1 text-3xl font-bold">Welcome, {user?.name}</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/recover" className="btn-primary">New Request</Link>
            <Link to="/" className="btn-secondary">Home</Link>
          </div>
        </div>
      </header>

      <main className="section-shell py-10">
        <div className="grid gap-6 md:grid-cols-4">
          {[
            ['Active Cases', String(cases.length), FileText],
            ['Avg Review Window', '24–48 hrs', Clock3],
            ['Security Policy', 'No seed phrases', ShieldCheck],
            ['Private Chat', 'Enabled', MessageSquareMore]
          ].map(([label, value, Icon]) => (
            <article key={label} className="panel p-6">
              <Icon className="text-primaryLight" size={24} />
              <p className="mt-6 text-sm text-textSoft">{label}</p>
              <p className="mt-1 text-3xl font-bold">{value}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[0.64fr_0.36fr]">
          <section className="panel p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">My Recovery Requests</p>
                <p className="mt-1 text-textSoft">Track every request you have submitted.</p>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              {cases.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-borderSoft p-8 text-center text-textSoft">No cases yet. Submit your first recovery request.</div>
              ) : (
               // Replace the cases.map(...) block inside ClientPortalPage with this:
cases.map((item) => (
  <Link to={`/case/${item._id}`} key={item._id}>
    <article className="rounded-[22px] border border-borderSoft bg-black/40 p-6 transition hover:border-primary/50">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xl font-semibold">{item.recoveryType}</p>
          <p className="mt-1 text-sm text-textSoft">
            {item.walletType} • {item.cryptoType} • {item.estimatedValue}
          </p>
        </div>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primaryLight">
          {item.status}
        </span>
      </div>
      <p className="mt-4 line-clamp-2 text-textSoft">{item.issueDescription}</p>
    </article>
  </Link>
))
              )}
            </div>
          </section>

          <aside className="panel p-8">
            <p className="text-2xl font-bold">Private Support</p>
            <p className="mt-3 leading-8 text-textSoft">The support chat is intentionally hidden from public pages. Only authenticated users and admins can access it.</p>
            <div className="mt-8 rounded-[22px] border border-primary/30 bg-primary/10 p-6">
              <p className="font-semibold">Security Reminder</p>
              <p className="mt-2 text-sm leading-7 text-textSoft">Do not send your seed phrase, full private key, or exchange password in chat. Use the request form for structured information only.</p>
            </div>
          </aside>
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}
