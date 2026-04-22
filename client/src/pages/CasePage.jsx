// pages/CasePage.jsx
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, SendHorizontal, Shield } from 'lucide-react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import api, { SOCKET_URL } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const STATUS_STYLES = {
  submitted:   'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
  reviewing:   'border-blue-500/30   bg-blue-500/10   text-blue-400',
  'in-progress':'border-primary/30   bg-primary/10    text-primaryLight',
  resolved:    'border-green-500/30  bg-green-500/10  text-green-400'
};

export default function CasePage() {
  const { id: caseId } = useParams();
  const { user } = useAuth();

  const [recoveryCase, setRecoveryCase] = useState(null);
  const [messages, setMessages]         = useState([]);
  const [roomId, setRoomId]             = useState(null);
  const [input, setInput]               = useState('');
  const [loadingCase, setLoadingCase]   = useState(true);

  const socketRef = useRef(null);
  const endRef    = useRef(null);

  // ── Fetch case details ──────────────────────────────────────────────────────
  useEffect(() => {
    api.get(`/cases/${caseId}`)
      .then((res) => setRecoveryCase(res.data.case))
      .catch(() => toast.error('Could not load case'))
      .finally(() => setLoadingCase(false));
  }, [caseId]);

  // ── Fetch chat thread ───────────────────────────────────────────────────────
  useEffect(() => {
    api.get(`/chat/thread?caseId=${caseId}`)
      .then((res) => {
        setRoomId(res.data.roomId);
        setMessages(res.data.messages);
      })
      .catch(() => undefined);
  }, [caseId]);

  // ── Socket ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_room', { caseId, role: user.role });
    });

    socket.on('receive_message', (msg) => {
      // Only append if it belongs to this case
      if (String(msg.caseId) === String(caseId)) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.disconnect();
  }, [caseId, user.role]);

  // ── Auto-scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send message ─────────────────────────────────────────────────────────────
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !roomId) return;

    try {
      const { data } = await api.post('/chat/message', { roomId, message: input.trim() });
      socketRef.current?.emit('send_message', data.message);
      setMessages((prev) => [...prev, data.message]);
      setInput('');
    } catch {
      toast.error('Failed to send message');
    }
  };

  if (loadingCase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-textSoft">
        Loading case...
      </div>
    );
  }

  if (!recoveryCase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-xl font-semibold">Case not found</p>
          <Link to="/portal" className="mt-4 inline-block text-primaryLight underline">Back to portal</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-borderSoft">
        <div className="section-shell flex h-16 items-center justify-between">
          <Link to="/portal" className="flex items-center gap-3 font-semibold">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary">
              <Shield size={14} />
            </div>
            Crypto Asset Recovery
          </Link>
          <Link to="/portal" className="flex items-center gap-2 text-sm text-textSoft hover:text-white">
            <ArrowLeft size={14} /> Back to Portal
          </Link>
        </div>
      </header>

      <main className="section-shell py-10">
        <div className="mx-auto max-w-5xl">

          {/* Confirmation banner — shown right after submission */}
          <div className="mb-8 rounded-[24px] border border-green-500/30 bg-green-500/10 p-6">
            <p className="text-lg font-semibold text-green-400">Your request has been submitted ✓</p>
            <p className="mt-1 text-sm text-textSoft">
              Our team will review your case within 24–48 hours and reach out via email.
              Use the chat below to add more details at any time.
            </p>
          </div>

          <div className="grid gap-8 xl:grid-cols-[0.55fr_0.45fr]">

            {/* ── Case Summary ─────────────────────────────────────────────── */}
            <section className="panel p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-textSoft">Recovery Type</p>
                  <h2 className="mt-1 text-2xl font-bold">{recoveryCase.recoveryType}</h2>
                </div>
                <span className={`shrink-0 rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${STATUS_STYLES[recoveryCase.status] ?? STATUS_STYLES.submitted}`}>
                  {recoveryCase.status}
                </span>
              </div>

              <div className="mt-8 space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-textSoft">Wallet Information</p>
                  <p className="mt-1 font-semibold">{recoveryCase.walletType}</p>
                  <p className="text-textSoft">{recoveryCase.cryptoType} • {recoveryCase.estimatedValue}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-textSoft">Issue Description</p>
                  <div className="mt-1 rounded-2xl border border-borderSoft bg-black/40 p-4 text-sm leading-7 text-textSoft">
                    {recoveryCase.issueDescription || '—'}
                  </div>
                </div>

                {recoveryCase.partialInfo && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-textSoft">Partial Info Provided</p>
                    <div className="mt-1 rounded-2xl border border-borderSoft bg-black/40 p-4 text-sm leading-7 text-textSoft">
                      {recoveryCase.partialInfo}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-textSoft">Contact</p>
                  <p className="mt-1 font-semibold">{recoveryCase.fullName}</p>
                  <p className="text-sm text-textSoft">{recoveryCase.email}</p>
                  <p className="text-sm text-textSoft">{recoveryCase.phone}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-textSoft">Submitted</p>
                  <p className="mt-1 text-sm text-textSoft">
                    {new Date(recoveryCase.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-[22px] border border-primary/30 bg-primary/10 p-5">
                <p className="font-semibold">What happens next?</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-textSoft">
                  <li>Our team reviews your case within 24–48 hours.</li>
                  <li>We'll contact you via email with our initial assessment.</li>
                  <li>If we can help, we'll provide a detailed recovery plan.</li>
                </ul>
              </div>
            </section>

            {/* ── Persistent Chat ───────────────────────────────────────────── */}
            <section className="panel flex flex-col p-0 overflow-hidden">
              <div className="border-b border-borderSoft px-6 py-4">
                <p className="font-semibold">Case Chat</p>
                <p className="text-xs text-textSoft">Only you and our support team can see this conversation.</p>
              </div>

              {/* Message list */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3" style={{ minHeight: '320px', maxHeight: '480px' }}>
                {messages.length === 0 ? (
                  <p className="text-sm text-textSoft">
                    No messages yet. Start by adding more details about your case.
                  </p>
                ) : (
                  messages.map((msg) => {
                    const mine = msg.sender?._id === user._id;
                    const isAdmin = msg.sender?.role === 'admin';
                    return (
                      <div key={msg._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${mine ? 'bg-primary text-white' : 'bg-white/7 text-textSoft'}`}>
                          {!mine && (
                            <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-primaryLight">
                              {isAdmin ? 'Support Team' : msg.sender?.name}
                            </p>
                          )}
                          {msg.content}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={endRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="border-t border-borderSoft p-4">
                <div className="flex items-center gap-2 rounded-2xl border border-borderSoft bg-black/70 px-3 py-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add more details or ask a question…"
                    className="h-10 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-textSoft"
                  />
                  <button
                    type="submit"
                    className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white"
                  >
                    <SendHorizontal size={18} />
                  </button>
                </div>
              </form>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}