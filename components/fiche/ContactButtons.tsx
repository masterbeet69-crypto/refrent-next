'use client';
import { Phone, MessageCircle, Send, X, Loader2, Crown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  contactPhone: string | null;
  agentIsPremium: boolean;
}

export function ContactButtons({ contactPhone, agentIsPremium }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    if (!message.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 900));
    setSending(false);
    setSent(true);
  }

  if (agentIsPremium && contactPhone) {
    return (
      <>
        <a
          href={`tel:${contactPhone}`}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#2A5C45' }}
        >
          <Phone className="w-4 h-4" />
          Appeler l&apos;agent
        </a>
        <a
          href={`https://wa.me/${contactPhone.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#25D366' }}
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
      </>
    );
  }

  /* Non-premium: internal message form */
  return (
    <div className="space-y-2">
      {/* Premium badge hint */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
        style={{ backgroundColor: '#FFFBEB', color: '#8A5A00', border: '1px solid #FDE68A' }}
      >
        <Crown className="w-3.5 h-3.5 flex-shrink-0" />
        <span>WhatsApp disponible pour les agents <strong>Premium</strong></span>
      </div>

      <motion.button
        onClick={() => setShowForm(v => !v)}
        whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-medium transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#2A5C45' }}
      >
        <Send className="w-4 h-4" />
        Message interne
      </motion.button>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="mt-1 p-4 rounded-xl space-y-3"
              style={{ backgroundColor: '#F7F5F2', border: '1px solid #E8E4DF' }}
            >
              {sent ? (
                <div className="text-center py-3 space-y-1">
                  <p className="text-sm font-semibold" style={{ color: '#2A5C45' }}>
                    ✓ Message envoyé !
                  </p>
                  <p className="text-xs" style={{ color: '#8A837C' }}>
                    L&apos;agent vous contactera sous 24h.
                  </p>
                </div>
              ) : (
                <>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Bonjour, je suis intéressé par ce bien..."
                    rows={3}
                    className="w-full text-sm px-3 py-2 rounded-lg outline-none resize-none"
                    style={{
                      border: '1px solid #E8E4DF',
                      color: '#1A1714',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                  <div className="flex gap-2">
                    <motion.button
                      onClick={handleSend}
                      disabled={sending || !message.trim()}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-white text-sm font-medium"
                      style={{
                        backgroundColor: '#2A5C45',
                        opacity: sending || !message.trim() ? 0.5 : 1,
                      }}
                    >
                      {sending
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Send className="w-4 h-4" />}
                      {sending ? 'Envoi…' : 'Envoyer'}
                    </motion.button>
                    <button
                      onClick={() => setShowForm(false)}
                      className="p-2 rounded-lg"
                      style={{ color: '#8A837C', backgroundColor: '#EFECE5' }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
