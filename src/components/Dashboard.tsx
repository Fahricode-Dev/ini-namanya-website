import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import {
  Copy, Check, Lock, Code, Server, Plug,
  Search, ChevronDown, Crown, Zap, Package,
  MessageCircle,
} from 'lucide-react';
import { cn } from '../lib/utils';

// ── Spotify music widget (floating, minimal) ──────────────────────────────────
function MusicWidget({ musicUrl }: { musicUrl: string }) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);

  const getEmbed = (url: string) => {
    const m = url.match(/spotify\.com\/(track|playlist|album)\/([a-zA-Z0-9]+)/);
    if (m) return `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0`;
    return '';
  };

  const embed = getEmbed(musicUrl);
  if (!musicUrl) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="w-[320px] rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-white/10"
          >
            {embed ? (
              <iframe
                src={embed}
                width="320"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{ display: 'block' }}
              />
            ) : (
              <div className="bg-[#121212] p-4 text-neutral-400 text-xs font-mono">
                URL tidak dapat diputar
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <button
        onClick={() => { setOpen(v => !v); setPlaying(v => !v || open ? !playing : true); }}
        className={cn(
          "group relative w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300",
          "bg-[#1DB954] hover:bg-[#1ed760] hover:scale-110",
          "shadow-[#1DB954]/40"
        )}
        title="Musik Nevano"
      >
        {/* Spotify logo */}
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-black">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>

        {/* Animated bars */}
        {open && (
          <span className="absolute -top-1 -right-1 flex items-end gap-[2px] h-3 px-0.5 bg-black/60 rounded-full overflow-hidden">
            <span className="w-[2px] h-full bg-[#1DB954] rounded-full music-bar" />
            <span className="w-[2px] h-full bg-[#1DB954] rounded-full music-bar" />
            <span className="w-[2px] h-full bg-[#1DB954] rounded-full music-bar" />
            <span className="w-[2px] h-full bg-[#1DB954] rounded-full music-bar" />
          </span>
        )}
      </button>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export function Dashboard() {
  const { currentUser, endpoints, musicUrl } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!currentUser) return null;

  const isPremium = currentUser.role === 'premium' || currentUser.role === 'admin';

  const filtered = endpoints.filter(ep =>
    ep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ep.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'plugin': return <Plug size={15} />;
      case 'case': return <Code size={15} />;
      case 'script': return <Zap size={15} />;
      default: return <Server size={15} />;
    }
  };

  const waLink = `https://wa.me/819070424636?text=Halo%20kak%2C%20mau%20berlangganan%20Premium%20Gudang%20Nevano`;

  const basicCount = endpoints.filter(e => e.accessLevel === 'basic').length;
  const premCount = endpoints.filter(e => e.accessLevel === 'premium').length;

  return (
    <div className="w-full flex flex-col gap-7 pb-24">

      {/* ── Page title row ── */}
      <div className="flex items-end justify-between gap-6 mt-1">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-indigo-500 dark:text-indigo-400 uppercase mb-1">
            Koleksi Bot AI WhatsApp
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight leading-none">
            Gudang Nevano
          </h1>
        </div>

        {/* Premium pill / upgrade CTA */}
        {isPremium ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-400/30 text-amber-600 dark:text-amber-400 text-[11px] font-bold tracking-wider uppercase">
            <Crown size={12} />
            Premium
          </span>
        ) : (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-xl",
              "text-xs font-semibold text-white tracking-wide",
              "bg-gradient-to-r from-violet-600 to-indigo-600",
              "shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40",
              "hover:-translate-y-0.5 transition-all duration-200"
            )}
          >
            <Crown size={13} />
            Akses Premium
          </a>
        )}
      </div>

      {/* ── Stats thin row ── */}
      <div className="flex items-center gap-4 text-[12px] text-neutral-500 dark:text-neutral-500 font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
          {basicCount} Gratis
        </span>
        <span className="w-px h-3 bg-neutral-300 dark:bg-neutral-700" />
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
          {premCount} Premium
        </span>
        <span className="w-px h-3 bg-neutral-300 dark:bg-neutral-700" />
        <span>{endpoints.length} Total</span>
      </div>

      {/* ── Search bar ── */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Cari kode, plugin, script..."
          className={cn(
            "w-full pl-10 pr-4 py-2.5 text-sm",
            "bg-white dark:bg-neutral-900",
            "border border-neutral-200 dark:border-neutral-800",
            "rounded-xl outline-none",
            "focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500",
            "placeholder:text-neutral-400 transition-all"
          )}
        />
      </div>

      {/* ── Endpoint cards ── */}
      <div className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {filtered.map((ep, i) => {
            const isLocked = ep.accessLevel === 'premium' && !isPremium;
            const isExpanded = expandedId === ep.id;

            // Build 3-line preview
            const lines = (ep.codeSnippet || '').split('\n');
            const previewLines = lines.slice(0, 4);
            const hasMore = lines.length > 4;

            return (
              <motion.div
                key={ep.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  "rounded-2xl border overflow-hidden transition-shadow duration-200",
                  "bg-white dark:bg-neutral-900",
                  isLocked
                    ? "border-amber-200/60 dark:border-amber-800/30"
                    : "border-neutral-200 dark:border-neutral-800 hover:shadow-md hover:shadow-indigo-500/5"
                )}
              >
                {/* Card header */}
                <div
                  className={cn(
                    "flex items-center gap-3 px-5 py-4",
                    !isLocked && "cursor-pointer select-none"
                  )}
                  onClick={() => !isLocked && setExpandedId(isExpanded ? null : ep.id)}
                >
                  {/* Icon dot */}
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                    ep.accessLevel === 'premium'
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                      : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                  )}>
                    {ep.accessLevel === 'premium' ? <Crown size={15} /> : getIcon(ep.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[15px] leading-tight">{ep.name}</span>
                      {ep.accessLevel === 'premium' && (
                        <span className="text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 uppercase border border-amber-200/50 dark:border-amber-800/30">
                          Premium
                        </span>
                      )}
                      <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 uppercase">
                        {ep.type}
                      </span>
                    </div>
                    <p className="text-[12px] text-neutral-500 mt-0.5 truncate">{ep.description}</p>
                  </div>

                  {/* Chevron */}
                  {!isLocked && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-neutral-400 shrink-0"
                    >
                      <ChevronDown size={17} />
                    </motion.div>
                  )}
                </div>

                {/* Code preview (always visible) */}
                <div className="px-5 pb-4">
                  <div className="rounded-xl overflow-hidden border border-neutral-800/80 dark:border-neutral-700/50">

                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a2e]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                        <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                        <span className="w-2 h-2 rounded-full bg-[#28c840]" />
                        <span className="ml-2 text-[10px] tracking-widest text-neutral-500 font-mono uppercase">{ep.type}</span>
                      </div>
                    </div>

                    {/* Preview code body */}
                    <div className={cn("relative bg-[#0d0d1a] px-4 py-3", isLocked && "select-none")}>
                      <pre className={cn(
                        "text-[12px] leading-[1.7] font-mono text-[#a5b4fc] overflow-hidden",
                        isLocked && "blur-sm"
                      )} style={{ maxHeight: '5.5rem' }}>
                        <code>{previewLines.join('\n')}{hasMore ? '\n...' : ''}</code>
                      </pre>

                      {/* Fade bottom gradient for free code (truncated) */}
                      {!isLocked && !isExpanded && hasMore && (
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0d0d1a] to-transparent pointer-events-none" />
                      )}

                      {/* Locked overlay */}
                      {isLocked && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0d1a]/80 backdrop-blur-[1px]">
                          <Lock size={14} className="text-amber-500 mb-1.5" />
                          <p className="text-[11px] font-semibold text-neutral-300 mb-0.5">Konten eksklusif Premium</p>
                          <p className="text-[10px] text-neutral-500 mb-3 text-center max-w-[180px]">
                            Langganan untuk buka akses ke semua kode premium
                          </p>
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[11px] font-bold shadow-lg shadow-indigo-500/25 hover:opacity-90 transition-opacity"
                          >
                            <MessageCircle size={11} />
                            Hubungi Admin
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded full code */}
                <AnimatePresence initial={false}>
                  {isExpanded && !isLocked && (
                    <motion.div
                      key="expanded"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="px-5 pb-5">
                        {/* Divider */}
                        <div className="w-full h-px bg-neutral-100 dark:bg-neutral-800 mb-4" />

                        {/* Description */}
                        <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mb-4 leading-relaxed">
                          {ep.description}
                        </p>

                        {/* Full code block */}
                        <div className="rounded-xl overflow-hidden border border-neutral-800">

                          {/* Toolbar (different bg from code) */}
                          <div className="flex items-center justify-between px-4 py-2.5 bg-[#161622]">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                              <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                              <span className="w-2 h-2 rounded-full bg-[#28c840]" />
                              <span className="ml-2 text-[10px] tracking-widest text-neutral-500 font-mono uppercase">
                                {ep.type} &nbsp;/&nbsp; {ep.name}
                              </span>
                            </div>
                            <button
                              onClick={e => { e.stopPropagation(); handleCopy(ep.codeSnippet, ep.id); }}
                              className={cn(
                                "flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold transition-all",
                                copiedId === ep.id
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/25"
                              )}
                            >
                              {copiedId === ep.id
                                ? <><Check size={12} /> Tersalin</>
                                : <><Copy size={12} /> Salin Kode</>
                              }
                            </button>
                          </div>

                          {/* Code body — darker than toolbar */}
                          <div className="bg-[#0a0a14] px-5 py-4 overflow-x-auto max-h-[380px] overflow-y-auto">
                            <pre className="text-[13px] leading-[1.75] font-mono text-[#c4ceff]">
                              <code>{ep.codeSnippet}</code>
                            </pre>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
              <Package size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">Tidak ada hasil</p>
              <p className="text-xs mt-1 text-neutral-500">Coba kata kunci yang berbeda</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Music floating widget */}
      <MusicWidget musicUrl={musicUrl || ''} />
    </div>
  );
}
