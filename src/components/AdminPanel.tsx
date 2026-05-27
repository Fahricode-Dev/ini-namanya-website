import { useState } from 'react';
import { useAppStore, Role, Endpoint } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, User as UserIcon, Settings, Eye, EyeOff, Loader2,
  Pencil, Check, X, Music2, Package, Crown, Star, Zap, Plug, Code, Server, Save
} from 'lucide-react';
import { cn } from '../lib/utils';

// ── Custom Styled Select ──────────────────────────────────────────────────────
function StyledSelect({
  value, onChange, options, variant = 'default'
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; color?: string }[];
  variant?: 'default' | 'role' | 'access' | 'type';
}) {
  const [open, setOpen] = useState(false);
  const current = options.find(o => o.value === value) || options[0];

  const roleColors: Record<string, string> = {
    basic: 'from-indigo-500 to-blue-500',
    premium: 'from-amber-400 to-orange-500',
    admin: 'from-purple-500 to-pink-500',
  };
  const accessColors: Record<string, string> = {
    basic: 'from-emerald-400 to-teal-500',
    premium: 'from-amber-400 to-orange-500',
  };
  const typeIcons: Record<string, JSX.Element> = {
    Plugin: <Plug size={14} />,
    Case: <Code size={14} />,
    Script: <Zap size={14} />,
    API: <Server size={14} />,
  };

  const getBadge = (val: string) => {
    if (variant === 'role') return `bg-gradient-to-r ${roleColors[val] || 'from-neutral-400 to-neutral-500'} text-white`;
    if (variant === 'access') return `bg-gradient-to-r ${accessColors[val] || 'from-neutral-400 to-neutral-500'} text-white`;
    return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300';
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm border",
          getBadge(value),
          "border-white/20 hover:opacity-90"
        )}
      >
        {variant === 'type' && typeIcons[value]}
        {variant === 'role' && (value === 'premium' ? <Crown size={14} /> : value === 'admin' ? <Settings size={14} /> : <Star size={14} />)}
        {variant === 'access' && (value === 'premium' ? <Crown size={14} /> : <Package size={14} />)}
        <span className="flex-1 text-left">{current.label}</span>
        <svg className={cn("w-4 h-4 transition-transform", open && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-1.5 left-0 right-0 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800",
                  opt.value === value && "bg-neutral-50 dark:bg-neutral-800"
                )}
              >
                <span className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm bg-gradient-to-br shrink-0",
                  variant === 'role' ? (roleColors[opt.value] || 'from-neutral-400 to-neutral-500') :
                  variant === 'access' ? (accessColors[opt.value] || 'from-neutral-400 to-neutral-500') :
                  'from-neutral-400 to-neutral-500'
                )}>
                  {variant === 'type' ? typeIcons[opt.value] || <Server size={14} /> :
                   variant === 'role' ? (opt.value === 'premium' ? <Crown size={13} /> : opt.value === 'admin' ? <Settings size={13} /> : <Star size={13} />) :
                   variant === 'access' ? (opt.value === 'premium' ? <Crown size={13} /> : <Package size={13} />) :
                   null}
                </span>
                {opt.label}
                {opt.value === value && <Check size={14} className="ml-auto text-indigo-500" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  );
}

// ── Edit Endpoint Modal ───────────────────────────────────────────────────────
function EditModal({ endpoint, onClose }: { endpoint: Endpoint; onClose: () => void }) {
  const { updateEndpoint } = useAppStore();
  const [name, setName] = useState(endpoint.name);
  const [url, setUrl] = useState(endpoint.url);
  const [desc, setDesc] = useState(endpoint.description);
  const [type, setType] = useState(endpoint.type);
  const [access, setAccess] = useState<'basic' | 'premium'>(endpoint.accessLevel);
  const [code, setCode] = useState(endpoint.codeSnippet);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateEndpoint(endpoint.id, { name, url, description: desc, type, accessLevel: access, codeSnippet: code });
    setSaving(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-neutral-900 rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-neutral-200 dark:border-neutral-800 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg flex items-center gap-2"><Pencil size={18} className="text-purple-500" /> Edit Endpoint</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1 text-neutral-500">Nama</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-neutral-500">URL / Path</label>
            <input value={url} onChange={e => setUrl(e.target.value)} className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-500">Tipe</label>
              <StyledSelect value={type} onChange={setType} variant="type" options={[
                { value: 'Plugin', label: 'Plugin' }, { value: 'Case', label: 'Case' },
                { value: 'Script', label: 'Script' }, { value: 'API', label: 'API' }
              ]} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-500">Akses</label>
              <StyledSelect value={access} onChange={v => setAccess(v as any)} variant="access" options={[
                { value: 'basic', label: 'Basic' }, { value: 'premium', label: 'Premium' }
              ]} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-neutral-500">Deskripsi</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none h-20" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-neutral-500">Kode Snippet</label>
            <textarea value={code} onChange={e => setCode(e.target.value)} className="w-full px-3 py-2 text-sm font-mono bg-neutral-900 text-green-400 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-y h-32" />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl font-medium text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              Batal
            </button>
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors">
              {saving ? <><Loader2 size={15} className="animate-spin" /> Menyimpan...</> : <><Save size={15} /> Simpan</>}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main AdminPanel ───────────────────────────────────────────────────────────
export function AdminPanel() {
  const { endpoints, users, addEndpoint, deleteEndpoint, addUser, deleteUser, updateUserRole, musicUrl, setMusicUrl } = useAppStore();
  const [activeTab, setActiveTab] = useState<'endpoints' | 'users' | 'musik'>('endpoints');
  const [editingEndpoint, setEditingEndpoint] = useState<Endpoint | null>(null);

  // Endpoint form
  const [epName, setEpName] = useState('');
  const [epUrl, setEpUrl] = useState('');
  const [epDesc, setEpDesc] = useState('');
  const [epType, setEpType] = useState('Plugin');
  const [epAccess, setEpAccess] = useState<'basic' | 'premium'>('basic');
  const [epCode, setEpCode] = useState('');
  const [epSaving, setEpSaving] = useState(false);

  // User form
  const [uName, setUName] = useState('');
  const [uPass, setUPass] = useState('');
  const [uRole, setURole] = useState<Role>('basic');
  const [uSaving, setUSaving] = useState(false);
  const [showFormPass, setShowFormPass] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Musik
  const [musicInput, setMusicInput] = useState(musicUrl || '');
  const [musicSaving, setMusicSaving] = useState(false);

  const toggleUserPass = (id: string) =>
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));

  const handleAddEndpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    setEpSaving(true);
    await addEndpoint({ name: epName, url: epUrl, description: epDesc, type: epType, accessLevel: epAccess, codeSnippet: epCode });
    setEpName(''); setEpUrl(''); setEpDesc(''); setEpCode('');
    setEpSaving(false);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uName || !uPass) return;
    setUSaving(true);
    await addUser({ username: uName, password: uPass, role: uRole });
    setUName(''); setUPass(''); setURole('basic');
    setUSaving(false);
  };

  const handleSaveMusicUrl = async () => {
    setMusicSaving(true);
    await setMusicUrl(musicInput);
    setMusicSaving(false);
  };

  const tabs = [
    { id: 'endpoints', label: `Kode (${endpoints.length})`, icon: <Package size={15} /> },
    { id: 'users', label: `Users (${users.length})`, icon: <UserIcon size={15} /> },
    { id: 'musik', label: 'Musik', icon: <Music2 size={15} /> },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-purple-600 dark:text-purple-400 flex items-center gap-2">
            <Settings size={28} /> System Administration
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-2 text-sm">
            Manage platform content and user access.
            <span className="inline-flex items-center gap-1 text-green-500 dark:text-green-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
              Realtime Firebase
            </span>
          </p>
        </div>

        {/* Custom Tab Switcher */}
        <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1.5 rounded-2xl gap-1 w-full md:w-auto shadow-inner">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-1.5 flex-1 md:flex-none px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                activeTab === tab.id
                  ? "bg-white dark:bg-neutral-800 text-purple-600 dark:text-purple-400 shadow-md"
                  : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ── ENDPOINTS TAB ── */}
        {activeTab === 'endpoints' && (
          <motion.div key="endpoints" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <form onSubmit={handleAddEndpoint} className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm sticky top-24">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Plus size={18} /> Tambah Kode Baru</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-neutral-500">Nama Kode</label>
                    <input type="text" required value={epName} onChange={e => setEpName(e.target.value)} className="w-full px-3 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g. Sticker Plugin" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-neutral-500">URL / Path</label>
                    <input type="text" required value={epUrl} onChange={e => setEpUrl(e.target.value)} className="w-full px-3 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g. /plugin/sticker.js" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1.5 text-neutral-500">Tipe</label>
                      <StyledSelect value={epType} onChange={setEpType} variant="type" options={[
                        { value: 'Plugin', label: 'Plugin' }, { value: 'Case', label: 'Case' },
                        { value: 'Script', label: 'Script' }, { value: 'API', label: 'API' }
                      ]} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5 text-neutral-500">Akses</label>
                      <StyledSelect value={epAccess} onChange={v => setEpAccess(v as any)} variant="access" options={[
                        { value: 'basic', label: 'Basic' }, { value: 'premium', label: 'Premium' }
                      ]} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-neutral-500">Deskripsi</label>
                    <textarea required value={epDesc} onChange={e => setEpDesc(e.target.value)} className="w-full px-3 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none h-20" placeholder="Brief description..." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-neutral-500">Kode Snippet</label>
                    <textarea required value={epCode} onChange={e => setEpCode(e.target.value)} className="w-full px-3 py-2.5 text-sm font-mono bg-neutral-900 text-green-400 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-y h-32" placeholder="console.log('Hello');" />
                  </div>
                  <button type="submit" disabled={epSaving} className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-60 text-white rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30">
                    {epSaving ? <><Loader2 size={15} className="animate-spin" /> Menyimpan...</> : <><Plus size={15} /> Tambah Kode</>}
                  </button>
                </div>
              </form>
            </div>

            <div className="md:col-span-2 space-y-3">
              {endpoints.map((ep) => (
                <motion.div key={ep.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex items-start justify-between gap-4 hover:border-purple-500/50 transition-all hover:shadow-md">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-bold">{ep.name}</h4>
                      <span className={cn("text-[10px] px-2.5 py-1 rounded-full uppercase font-black shadow-sm text-white",
                        ep.accessLevel === 'premium'
                          ? "bg-gradient-to-r from-amber-400 to-orange-500 shadow-amber-500/30"
                          : "bg-gradient-to-r from-emerald-400 to-teal-500 shadow-teal-500/30"
                      )}>
                        {ep.accessLevel === 'premium' ? '✦ Premium' : 'Free'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-500 uppercase font-bold">{ep.type}</span>
                    </div>
                    <p className="text-xs font-mono text-neutral-400 mb-1">{ep.url}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-1">{ep.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditingEndpoint(ep)}
                      className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deleteEndpoint(ep.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
              {endpoints.length === 0 && (
                <div className="text-center py-12 text-neutral-500 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl">
                  <Package size={36} className="mx-auto mb-3 opacity-30" />
                  Belum ada kode. Tambahkan dari sidebar.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'users' && (
          <motion.div key="users" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <form onSubmit={handleAddUser} className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm sticky top-24">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><UserIcon size={18} /> Tambah User</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-neutral-500">Username</label>
                    <input type="text" required value={uName} onChange={e => setUName(e.target.value)} className="w-full px-3 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="contoh: user123" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-neutral-500">Password</label>
                    <div className="relative">
                      <input
                        type={showFormPass ? 'text' : 'password'}
                        required value={uPass}
                        onChange={e => setUPass(e.target.value)}
                        className="w-full px-3 py-2.5 pr-10 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder="password..."
                      />
                      <button type="button" onClick={() => setShowFormPass(v => !v)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
                        {showFormPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-neutral-500">Role</label>
                    <StyledSelect value={uRole} onChange={v => setURole(v as Role)} variant="role" options={[
                      { value: 'basic', label: 'Basic Member' },
                      { value: 'premium', label: 'Premium' },
                    ]} />
                  </div>
                  <button type="submit" disabled={uSaving} className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-60 text-white rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30">
                    {uSaving ? <><Loader2 size={15} className="animate-spin" /> Menyimpan...</> : <><Plus size={15} /> Tambah User</>}
                  </button>
                </div>
              </form>
            </div>

            <div className="md:col-span-2 space-y-3">
              {users.map((user) => (
                <motion.div key={user.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-purple-500/50 transition-all hover:shadow-md">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={cn(
                      "w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md",
                      user.role === 'premium' ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30"
                        : user.role === 'admin' ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/30"
                        : "bg-gradient-to-br from-indigo-500 to-blue-500 shadow-indigo-500/30"
                    )}>
                      {user.role === 'premium' ? <Crown size={18} /> : user.role === 'admin' ? <Settings size={18} /> : <UserIcon size={18} />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold">{user.username}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-neutral-500 font-mono">
                          {visiblePasswords[user.id] ? user.password : '••••••••'}
                        </span>
                        <button type="button" onClick={() => toggleUserPass(user.id)} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
                          {visiblePasswords[user.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-36">
                      <StyledSelect
                        value={user.role}
                        onChange={v => updateUserRole(user.id, v as Role)}
                        variant="role"
                        options={[
                          { value: 'basic', label: 'Basic' },
                          { value: 'premium', label: 'Premium' },
                        ]}
                      />
                    </div>
                    <button onClick={() => deleteUser(user.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
              {users.length === 0 && (
                <div className="text-center py-12 text-neutral-500 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl">
                  <UserIcon size={36} className="mx-auto mb-3 opacity-30" />
                  Belum ada user. Tambahkan dari sidebar.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── MUSIK TAB ── */}
        {activeTab === 'musik' && (
          <motion.div key="musik" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl">
            <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#1DB954] flex items-center justify-center shadow-lg shadow-[#1DB954]/30">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#1DB954]">Pengaturan Musik</h2>
                  <p className="text-sm text-neutral-500">Atur URL Spotify untuk member</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-2 text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">URL Spotify</label>
                  <input
                    type="text"
                    value={musicInput}
                    onChange={e => setMusicInput(e.target.value)}
                    placeholder="https://open.spotify.com/track/... atau playlist/album..."
                    className="w-full px-4 py-3 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-[#1DB954] outline-none transition-all"
                  />
                  <p className="text-xs text-neutral-400 mt-1.5">Paste link Spotify track, playlist, atau album. Member hanya bisa play & dengarkan.</p>
                </div>

                <button
                  onClick={handleSaveMusicUrl}
                  disabled={musicSaving}
                  className="w-full py-3 bg-[#1DB954] hover:bg-[#1aa34a] disabled:opacity-60 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#1DB954]/30"
                >
                  {musicSaving ? <><Loader2 size={15} className="animate-spin" /> Menyimpan...</> : <><Save size={15} /> Simpan URL Musik</>}
                </button>

                {musicUrl && (
                  <div className="mt-4 p-4 bg-[#1DB954]/10 rounded-xl border border-[#1DB954]/20">
                    <p className="text-xs font-bold text-[#1DB954] mb-1 uppercase tracking-wider">URL Aktif:</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 break-all font-mono">{musicUrl}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingEndpoint && (
          <EditModal endpoint={editingEndpoint} onClose={() => setEditingEndpoint(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
