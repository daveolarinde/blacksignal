// components/chat/ChatWidget.jsx
import { useEffect, useRef, useState } from 'react';
import { MessageCircle, SendHorizontal, X } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../store/SocketContext';

export default function ChatWidget({ adminMode = false, caseId: propCaseId = '' }) {
  const { user } = useAuth();
  const { socket, joinRoom, sendMessage: socketSend } = useSocket();

  const [open, setOpen]         = useState(false);
  const [input, setInput]       = useState('');
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId]     = useState(null);
  const [rooms, setRooms]       = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState(propCaseId);
  const endRef = useRef(null);

  const visible = Boolean(user);

  // Normalise role — your DB uses 'user' but code checks 'admin'
  const userRole = user?.role === 'admin' ? 'admin' : 'user';
  const isAdmin  = userRole === 'admin';

  // ── Join room whenever selectedCaseId or socket is ready ──────────────────
  useEffect(() => {
    if (!socket || !selectedCaseId) return;
    joinRoom({ caseId: selectedCaseId, role: userRole });
    console.log('🚪 Joined room:', selectedCaseId, 'as', userRole);
  }, [socket, selectedCaseId, userRole]);

  // ── Listen for incoming messages ───────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
      if (String(msg.caseId) === String(selectedCaseId)) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on('receive_message', handler);
    return () => socket.off('receive_message', handler);
  }, [socket, selectedCaseId]);

  // ── ADMIN: load rooms list ─────────────────────────────────────────────────
  useEffect(() => {
    if (!visible || !adminMode) return;
    api.get('/chat/rooms').then(({ data }) => {
      const list = data.rooms || [];
      setRooms(list);
      setSelectedCaseId(list[0]?.case?._id || '');
    }).catch(() => undefined);
  }, [visible, adminMode]);

  // ── ADMIN: load thread when selected case changes ──────────────────────────
  useEffect(() => {
    if (!visible || !adminMode || !selectedCaseId) return;
    api.get(`/chat/thread?caseId=${selectedCaseId}`).then(({ data }) => {
      setRoomId(data.roomId);
      setMessages(data.messages || []);
    }).catch(() => undefined);
  }, [selectedCaseId, adminMode, visible]);

  // ── CLIENT: load their own case thread ────────────────────────────────────
  useEffect(() => {
    if (!visible || adminMode) return;

    api.get('/cases/my-cases')
      .then(({ data }) => {
        const list = data.cases || data;
        const activeCase = Array.isArray(list) ? list[0] : null;
        if (!activeCase) return null;
        const cId = activeCase._id;
        setSelectedCaseId(String(cId));
        return api.get(`/chat/thread?caseId=${cId}`);
      })
      .then((res) => {
        if (!res) return;
        setRoomId(res.data.roomId);
        setMessages(res.data.messages || []);
      })
      .catch(() => undefined);
  }, [visible, adminMode]);

  // ── Auto-scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  if (!visible) return null;

  // ── Send ───────────────────────────────────────────────────────────────────
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !roomId) return;

    const { data } = await api.post('/chat/message', {
      roomId,
      message: input.trim()
    });

    const outgoing = {
      ...data.message,
      caseId: selectedCaseId,
      senderName: user.name,
      senderRole: userRole,   // ← uses normalised role, never undefined
    };

    console.log('📤 emitting send_message:', outgoing); 
    console.log('👤 FULL USER OBJECT:', JSON.stringify(user)); // ← add this// debug — remove later
    socketSend(outgoing);
    setMessages((prev) => [...prev, data.message]);
    setInput('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="grid h-14 w-14 place-items-center rounded-full border border-borderSoft bg-primary text-white shadow-glow"
          aria-label="Open chat"
        >
          <MessageCircle size={22} />
        </button>
      ) : (
        <div className="w-[360px] overflow-hidden rounded-[24px] border border-borderSoft bg-[#0d0d0d] shadow-[0_30px_80px_rgba(0,0,0,0.55)]">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-borderSoft px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">
                {isAdmin ? 'Admin Support Inbox' : 'Support Chat'}
              </p>
              <p className="text-xs text-textSoft">
                {isAdmin ? 'Reply to client cases.' : 'Chat with our support team.'}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-textSoft hover:bg-white/5 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Case selector (admin only) */}
          {isAdmin && rooms.length > 0 && (
            <div className="border-b border-borderSoft px-4 py-3">
              <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-textSoft">
                Select Case
              </label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="input h-11 py-2"
              >
                {rooms.map((room) => (
                  <option key={room._id} value={room.case?._id}>
                    {room.user?.name} — {room.case?.recoveryType} ({room.case?.status})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Messages */}
          <div className="h-80 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 ? (
              <p className="text-sm text-textSoft">No messages yet.</p>
            ) : (
              messages.map((msg) => {
                const mine = msg.sender?._id === user._id;
                return (
                  <div key={msg._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${mine ? 'bg-primary text-white' : 'bg-white/7 text-textSoft'}`}>
                      <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-primaryLight">
                        {mine ? 'You' : (msg.sender?.name || (isAdmin ? 'Client' : 'Support'))}
                      </p>
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-borderSoft p-3">
            <div className="flex items-center gap-2 rounded-2xl border border-borderSoft bg-black/70 px-3 py-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isAdmin ? 'Reply to client…' : 'Type a message…'}
                className="h-10 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-textSoft"
              />
              <button
                className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white"
                type="submit"
              >
                <SendHorizontal size={18} />
              </button>
            </div>
          </form>

        </div>
      )}
    </div>
  );
}