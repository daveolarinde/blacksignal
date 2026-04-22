import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Users, Inbox, ShieldCheck, MessageSquareMore, SendHorizontal, ChevronDown, X } from 'lucide-react';
import { io } from 'socket.io-client';
import api, { SOCKET_URL } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const STATUS_OPTIONS = ['submitted', 'reviewing', 'in-progress', 'resolved'];

const STATUS_STYLES = {
  submitted:    'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
  reviewing:    'border-blue-500/30   bg-blue-500/10   text-blue-400',
  'in-progress':'border-primary/30    bg-primary/10    text-primaryLight',
  resolved:     'border-green-500/30  bg-green-500/10  text-green-400'
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [cases, setCases]   = useState([]);
  const [stats, setStats]   = useState({ totalUsers: 0, totalCases: 0, openCases: 0, totalMessages: 0 });
  const [selected, setSelected] = useState(null); // active case object
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId]     = useState(null);
  const [input, setInput]       = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const socketRef = useRef(null);
  const endRef    = useRef(null);

  // ── Load stats + cases ────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const [casesRes, statsRes] = await Promise.all([
        api.get('/admin/cases'),
        api.get('/admin/stats')
      ]);
      setCases(casesRes.data.cases);
      setStats(statsRes.data.stats);
    };
    load().catch(() => undefined);
  }, []);

  // ── Socket — join admin room once ─────────────────────────────────────────
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_room', { role: 'admin' });
    });

    socket.on('receive_message', (msg) => {
      // Only append if it's for the currently open case
      setSelected((prev) => {
        if (prev && String(msg.caseId) === String(prev._id)) {
          setMessages((m) => [...m, msg]);
        }
        return prev;
      });
    });

    return () => socket.disconnect();
  }, []);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Open a case — load its chat thread ───────────────────────────────────
  const openCase = async (item) => {
    setSelected(item);
    setMessages([]);
    setRoomId(null);
    setInput('');
    try {
      const { data } = await api.get(`/chat/thread?caseId=${item._id}`);
      setRoomId(data.roomId);
      setMessages(data.messages);
      // Rejoin socket room for new case
      socketRef.current?.emit('join_room', { caseId: item._id, role: 'admin' });
    } catch {
      // no chat room yet — will be created on first message
    }
  };

  const closeCase = () => {
    setSelected(null);
    setMessages([]);
    setRoomId(null);
  };

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !roomId) return;
    try {
      const { data } = await api.post('/chat/message', { roomId, message: input.trim() });
      socketRef.current?.emit('send_message', data.message);
      setMessages((prev) => [...prev, data.message]);
      setInput('');
    } catch {
      // silent
    }
  };

  // ── Update case status ────────────────────────────────────────────────────
  const updateStatus = async (caseId, status) => {
    setUpdatingStatus(true);
    try {
      const { data } = await api.patch(`/admin/cases/${caseId}/status`, { status });
      // Update in list
      setCases((prev) => prev.map((c) => c._id === caseId ? { ...c, status } : c));
      // Update in selected panel
      setSelected((prev) => prev ? { ...prev, status } : prev);
    } catch {
      // silent
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <header className="border-b border-borderSoft bg-black/70 backdrop-blur-xl">
        <div className="section-shell flex h-20 items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primaryLight">Superadmin Command Desk</p>
            <h1 className="mt-1 text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/portal" className="btn-secondary">Client View</Link>
            <Link to="/" className="btn-primary">Website</Link>
          </div>
        </div>
      </header>

      <main className="section-shell py-10">
        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          {[
            ['Users', stats.totalUsers, Users],
            ['Case Submissions', stats.totalCases, Inbox],
            ['Open Cases', stats.openCases, ShieldCheck],
            ['Chat Messages', stats.totalMessages, MessageSquareMore]
          ].map(([label, value, Icon]) => (
            <article key={label} className="panel p-6">
              <Icon className="text-primaryLight" size={24} />
              <p className="mt-6 text-sm text-textSoft">{label}</p>
              <p className="mt-1 text-3xl font-bold">{value}</p>
            </article>
          ))}
        </div>

        {/* Cases + detail panel side by side */}
        <div className="mt-10 grid gap-6 xl:grid-cols-[1fr_420px]">

          {/* ── Cases table ───────────────────────────────────────────────── */}
          <section className="panel p-8">
            <div>
              <p className="text-2xl font-bold">Client Intake Requests</p>
              <p className="mt-1 text-textSoft">Click a row to view details and chat with the client.</p>
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-borderSoft text-textSoft">
                  <tr>
                    <th className="pb-4 pr-4">Client</th>
                    <th className="pb-4 pr-4">Recovery Type</th>
                    <th className="pb-4 pr-4">Wallet</th>
                    <th className="pb-4 pr-4">Value</th>
                    <th className="pb-4 pr-4">Status</th>
                    <th className="pb-4" />
                  </tr>
                </thead>
                <tbody>
                  {cases.map((item) => (
                    <tr
                      key={item._id}
                      onClick={() => openCase(item)}
                      className={`cursor-pointer border-b border-white/5 align-top transition hover:bg-white/3 ${selected?._id === item._id ? 'bg-white/5' : ''}`}
                    >
                      <td className="py-5 pr-4">
                        <p className="font-semibold">{item.fullName || item.user?.name}</p>
                        <p className="text-xs text-textSoft">{item.user?.email}</p>
                      </td>
                      <td className="py-5 pr-4 text-textSoft">{item.recoveryType}</td>
                      <td className="py-5 pr-4 text-textSoft">
                        <p>{item.walletType}</p>
                        <p className="text-xs">{item.cryptoType}</p>
                      </td>
                      <td className="py-5 pr-4 text-textSoft">{item.estimatedValue}</td>
                      <td className="py-5 pr-4">
                        <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] ${STATUS_STYLES[item.status] ?? STATUS_STYLES.submitted}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-5 text-textSoft">
                        <ChevronDown size={14} className={`transition ${selected?._id === item._id ? 'rotate-180' : ''}`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {cases.length === 0 && (
                <p className="py-10 text-center text-textSoft">No cases yet.</p>
              )}
            </div>
          </section>

          {/* ── Case detail + chat panel ──────────────────────────────────── */}
          {selected ? (
            <aside className="panel flex flex-col overflow-hidden p-0">
              {/* Panel header */}
              <div className="flex items-center justify-between border-b border-borderSoft px-6 py-4">
                <div>
                  <p className="font-semibold">{selected.fullName || selected.user?.name}</p>
                  <p className="text-xs text-textSoft">{selected.recoveryType}</p>
                </div>
                <button onClick={closeCase} className="rounded-lg p-1 text-textSoft hover:bg-white/5 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto">

                {/* Case details */}
                <div className="space-y-4 border-b border-borderSoft px-6 py-5 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-textSoft">Email</p>
                      <p className="mt-1">{selected.email}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-textSoft">Phone</p>
                      <p className="mt-1">{selected.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-textSoft">Wallet</p>
                      <p className="mt-1">{selected.walletType}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-textSoft">Crypto</p>
                      <p className="mt-1">{selected.cryptoType}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs uppercase tracking-[0.18em] text-textSoft">Est. Value</p>
                      <p className="mt-1">{selected.estimatedValue}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-textSoft">Issue</p>
                    <p className="mt-1 leading-6 text-textSoft">{selected.issueDescription || '—'}</p>
                  </div>

                  {selected.partialInfo && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-textSoft">Partial Info</p>
                      <p className="mt-1 leading-6 text-textSoft">{selected.partialInfo}</p>
                    </div>
                  )}

                  {selected.proofDocumentUrl && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-textSoft">Proof Document</p>
                      <a
                        href={`${SOCKET_URL}${selected.proofDocumentUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-primaryLight underline"
                      >
                        View uploaded file
                      </a>
                    </div>
                  )}

                  {/* Status updater */}
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-textSoft">Update Status</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {STATUS_OPTIONS.map((s) => (
                        <button
                          key={s}
                          disabled={updatingStatus || selected.status === s}
                          onClick={() => updateStatus(selected._id, s)}
                          className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] transition
                            ${selected.status === s
                              ? (STATUS_STYLES[s] ?? STATUS_STYLES.submitted) + ' cursor-default'
                              : 'border-borderSoft text-textSoft hover:border-primary/50 hover:text-white'
                            }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="space-y-3 px-6 py-4" style={{ minHeight: '200px' }}>
                  <p className="text-xs uppercase tracking-[0.18em] text-textSoft">Case Chat</p>
                  {messages.length === 0 ? (
                    <p className="text-sm text-textSoft">No messages yet.</p>
                  ) : (
                    messages.map((msg) => {
                      const mine = msg.sender?._id === user?._id;
                      return (
                        <div key={msg._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${mine ? 'bg-primary text-white' : 'bg-white/7 text-textSoft'}`}>
                            <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-primaryLight">
                              {mine ? 'You (Admin)' : (msg.sender?.name || 'Client')}
                            </p>
                            {msg.content}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={endRef} />
                </div>
              </div>

              {/* Reply box — pinned to bottom */}
              <form onSubmit={sendMessage} className="border-t border-borderSoft p-4">
                {!roomId && (
                  <p className="mb-2 text-xs text-textSoft">No chat room yet — client hasn't opened chat for this case.</p>
                )}
                <div className="flex items-center gap-2 rounded-2xl border border-borderSoft bg-black/70 px-3 py-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={roomId ? 'Reply to client…' : 'Waiting for client to initiate chat…'}
                    disabled={!roomId}
                    className="h-10 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-textSoft disabled:opacity-40"
                  />
                  <button
                    type="submit"
                    disabled={!roomId || !input.trim()}
                    className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white disabled:opacity-40"
                  >
                    <SendHorizontal size={18} />
                  </button>
                </div>
              </form>
            </aside>
          ) : (
            <aside className="panel flex items-center justify-center p-8 text-center text-textSoft">
              <div>
                <MessageSquareMore className="mx-auto mb-4 text-primaryLight" size={32} />
                <p className="font-semibold text-white">Select a case</p>
                <p className="mt-1 text-sm">Click any row to view details and reply to the client.</p>
              </div>
            </aside>
          )}

        </div>
      </main>
    </div>
  );
}