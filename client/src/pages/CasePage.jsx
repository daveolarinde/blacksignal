// pages/CasePage.jsx
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, SendHorizontal, Shield } from 'lucide-react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import api, { SOCKET_URL } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import Logo from "../assets/logo.png";

const STATUS_STYLES = {
  submitted:    'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
  reviewing:    'border-blue-500/30   bg-blue-500/10   text-blue-400',
  'in-progress':'border-primary/30   bg-primary/10    text-primaryLight',
  resolved:     'border-green-500/30  bg-green-500/10  text-green-400'
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

  useEffect(() => {
    api.get(`/cases/${caseId}`)
      .then((res) => setRecoveryCase(res.data.case))
      .catch(() => toast.error('Could not load case'))
      .finally(() => setLoadingCase(false));
  }, [caseId]);

  useEffect(() => {
    api.get(`/chat/thread?caseId=${caseId}`)
      .then((res) => { setRoomId(res.data.roomId); setMessages(res.data.messages); })
      .catch(() => undefined);
  }, [caseId]);

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current = socket;
    socket.on('connect', () => socket.emit('join_room', { caseId, role: user.role }));
    socket.on('receive_message', (msg) => {
      if (String(msg.caseId) === String(caseId)) setMessages((prev) => [...prev, msg]);
    });
    return () => socket.disconnect();
  }, [caseId, user.role]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    return <div className="flex min-h-screen items-center justify-center bg-black text-textSoft">Loading case...</div>;
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
        <div className="section-shell flex h-14 items-center justify-between sm:h-16">
          <Link to="/portal" className="flex items-center gap-3 font-semibold">
            <img src={Logo} alt="Logo" className="w-28 sm:w-40" />
          </Link>
          <Link to="/portal" className="flex items-center gap-2 text-sm text-textSoft hover:text-white">
            <ArrowLeft size={14} /> <span className="hidden sm:inline">Back to Portal</span><span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      <main className="section-shell py-8 sm:py-10">
        <div className="mx-auto max-w-5xl">

          {/* Confirmation banner */}
          <div className="mb-6 rounded-[18px] border border-green-500/30 bg-green-500/10 p-5 sm:mb-8 sm:rounded-[24px] sm:p-6">
            <p className="text-base font-semibold text-green-400 sm:text-lg">Your request has been submitted ✓</p>
            <p className="mt-1 text-sm text-textSoft">
              Our team will review your case within 24–48 hours and reach out via email.
              Use the chat below to add more details at any time.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 xl:grid-cols-[0.55fr_0.45fr]">

            {/* ── Case Summary ── */}
            <section className="panel p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-textSoft sm:text-sm">Recovery Type</p>
                  <h2 className="mt-1 text-xl font-bold sm:text-2xl">{recoveryCase.recoveryType}</h2>
                </div>
                <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] sm:px-4 ${STATUS_STYLES[recoveryCase.status] ?? STATUS_STYLES.submitted}`}>
                  {recoveryCase.status}
                </span>
              </div>

              <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-textSoft">Wallet Information</p>
                  <p className="mt-1 font-semibold">{recoveryCase.walletType}</p>
                  <p className="text-sm text-textSoft sm:text-base">{recoveryCase.cryptoType} • {recoveryCase.estimatedValue}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-textSoft">Issue Description</p>
                  <div className="mt-1 rounded-2xl border border-borderSoft bg-black/40 p-3 text-sm leading-7 text-textSoft sm:p-4">
                    {recoveryCase.issueDescription || '—'}
                  </div>
                </div>

                {recoveryCase.partialInfo && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-textSoft">Partial Info Provided</p>
                    <div className="mt-1 rounded-2xl border border-borderSoft bg-black/40 p-3 text-sm leading-7 text-textSoft sm:p-4">
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

              <div className="mt-6 rounded-[18px] border border-primary/30 bg-primary/10 p-4 sm:mt-8 sm:rounded-[22px] sm:p-5">
                <p className="font-semibold">What happens next?</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-textSoft sm:mt-3 sm:space-y-2">
                  <li>Our team reviews your case within 24–48 hours.</li>
                  <li>We'll contact you via email with our initial assessment.</li>
                  <li>If we can help, we'll provide a detailed recovery plan.</li>
                </ul>
              </div>
            </section>

            {/* ── Persistent Chat ── */}
            <section className="panel flex flex-col overflow-hidden p-0">
              <div className="border-b border-borderSoft px-5 py-4 sm:px-6">
                <p className="font-semibold">Case Chat</p>
                <p className="text-xs text-textSoft">Only you and our support team can see this conversation.</p>
              </div>

              {/* Message list */}
              <div
                className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6"
                style={{ minHeight: '280px', maxHeight: '420px' }}
              >
                {messages.length === 0 ? (
                  <p className="text-sm text-textSoft">No messages yet. Start by adding more details about your case.</p>
                ) : (
                  messages.map((msg) => {
                    const mine = msg.sender?._id === user._id;
                    const isAdmin = msg.sender?.role === 'admin';
                    return (
                      <div key={msg._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm sm:max-w-[80%] ${mine ? 'bg-primary text-white' : 'bg-white/7 text-textSoft'}`}>
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
              <form onSubmit={sendMessage} className="border-t border-borderSoft p-3 sm:p-4">
                <div className="flex items-center gap-2 rounded-2xl border border-borderSoft bg-black/70 px-3 py-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add more details or ask a question…"
                    className="h-9 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-textSoft sm:h-10"
                  />
                  <button type="submit" className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white sm:h-10 sm:w-10">
                    <SendHorizontal size={16} className="sm:hidden" />
                    <SendHorizontal size={18} className="hidden sm:block" />
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