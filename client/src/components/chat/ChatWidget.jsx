// components/chat/ChatWidget.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { MessageCircle, SendHorizontal, X } from 'lucide-react';
import api, { SOCKET_URL } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function ChatWidget({ adminMode = false }) {
  const { user } = useAuth();
  const [open, setOpen]         = useState(false);
  const [input, setInput]       = useState('');
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId]     = useState(null);
  const [rooms, setRooms]       = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const socketRef = useRef(null);
  const endRef    = useRef(null);

  const visible   = Boolean(user);
  const endpoint  = useMemo(() => SOCKET_URL, []);

  // ── Socket ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible || !adminMode) return;

    const socket = io(endpoint, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_room', { caseId: selectedCaseId, role: user.role });
    });

    socket.on('receive_message', (msg) => {
      if (String(msg.caseId) === String(selectedCaseId)) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.disconnect();
  }, [endpoint, visible, adminMode, user, selectedCaseId]);

  // ── Load rooms list ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible || !adminMode) return;

    api.get('/chat/rooms').then(({ data }) => {
      const list = data.rooms || [];
      setRooms(list);
      const first = list[0]?.case?._id || '';
      setSelectedCaseId(first);
    }).catch(() => undefined);
  }, [visible, adminMode]);

  // ── Load thread when selected case changes ──────────────────────────────────
  useEffect(() => {
    if (!visible || !adminMode || !selectedCaseId) return;

    api.get(`/chat/thread?caseId=${selectedCaseId}`).then(({ data }) => {
      setRoomId(data.roomId);
      setMessages(data.messages);
    }).catch(() => undefined);
  }, [selectedCaseId, adminMode, visible]);

  // ── Auto-scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  if (!visible || !adminMode) return null;

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !roomId) return;

    const { data } = await api.post('/chat/message', { roomId, message: input.trim() });
    socketRef.current?.emit('send_message', data.message);
    setMessages((prev) => [...prev, data.message]);
    setInput('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="grid h-14 w-14 place-items-center rounded-full border border-borderSoft bg-primary text-white shadow-glow"
          aria-label="Open admin support inbox"
        >
          <MessageCircle size={22} />
        </button>
      ) : (
        <div className="w-[360px] overflow-hidden rounded-[24px] border border-borderSoft bg-[#0d0d0d] shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
          <div className="flex items-center justify-between border-b border-borderSoft px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">Admin Support Inbox</p>
              <p className="text-xs text-textSoft">Reply to client cases.</p>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-textSoft hover:bg-white/5 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Case selector */}
          {rooms.length > 0 && (
            <div className="border-b border-borderSoft px-4 py-3">
              <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-textSoft">Select Case</label>
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
            {messages.length === 0
              ? <p className="text-sm text-textSoft">No messages yet.</p>
              : messages.map((msg) => {
                  const mine = msg.sender?._id === user._id;
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
            }
            <div ref={endRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="border-t border-borderSoft p-3">
            <div className="flex items-center gap-2 rounded-2xl border border-borderSoft bg-black/70 px-3 py-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Reply to client…"
                className="h-10 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-textSoft"
              />
              <button className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white" type="submit">
                <SendHorizontal size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}