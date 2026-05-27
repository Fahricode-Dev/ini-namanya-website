import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import { User, ShieldAlert, ArrowRight, Lock, Key, Eye, EyeOff } from 'lucide-react';

export function Landing() {
  const [view, setView] = useState<'selection' | 'member' | 'admin'>('selection');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);

  const login = useAppStore(state => state.login);

  const handleLogin = (e: React.FormEvent, isAdmin: boolean) => {
    e.preventDefault();
    setError('');
    const success = login(isAdmin ? 'admin' : username, password, isAdmin);
    if (!success) {
      setError(isAdmin ? 'Invalid admin password' : 'Invalid username or password');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-100px)]">
      <AnimatePresence mode="wait">
        {view === 'selection' && (
          <motion.div
            key="selection"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-2xl grid md:grid-cols-2 gap-6 p-4"
          >
            <motion.div variants={itemVariants} className="text-center md:col-span-2 mb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                Welcome to Nnevv
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                Access exclusive WhatsApp bot features, plugins, cases, and premium scripts.
              </p>
            </motion.div>

            <motion.button
              variants={itemVariants}
              onClick={() => setView('member')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-2xl p-8 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl border border-white/50 dark:border-neutral-800/50 shadow-xl shadow-indigo-500/5 transition-all hover:shadow-indigo-500/10 flex flex-col items-center justify-center gap-4 h-64"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <User size={32} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold">Login Member</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">Access your dashboard & endpoints.</p>
            </motion.button>

            <motion.button
              variants={itemVariants}
              onClick={() => setView('admin')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-2xl p-8 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl border border-white/50 dark:border-neutral-800/50 shadow-xl shadow-purple-500/5 transition-all hover:shadow-purple-500/10 flex flex-col items-center justify-center gap-4 h-64"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <ShieldAlert size={32} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold">Login Admin</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">Manage users and features.</p>
            </motion.button>
          </motion.div>
        )}

        {view === 'member' && (
          <motion.div
            key="member"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md"
          >
            <form onSubmit={(e) => handleLogin(e, false)} className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-neutral-800/50 shadow-2xl shadow-black/5">
              <div className="mb-8 text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
                  <User size={24} />
                </div>
                <h2 className="text-2xl font-bold">Member Portal</h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Welcome back, please sign in.</p>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 mb-6 text-sm text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                  {error}
                </motion.div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 ml-1 text-neutral-700 dark:text-neutral-300">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 ml-1 text-neutral-700 dark:text-neutral-300">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 bg-white/50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 group mt-6"
                >
                  Sign In
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="mt-6 text-center">
                <button type="button" onClick={() => { setView('selection'); setError(''); setPassword(''); }} className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
                  ← Back to selection
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {view === 'admin' && (
          <motion.div
            key="admin"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md"
          >
            <form onSubmit={(e) => handleLogin(e, true)} className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-neutral-800/50 shadow-2xl shadow-black/5">
              <div className="mb-8 text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert size={24} />
                </div>
                <h2 className="text-2xl font-bold">Admin Portal</h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Authorized personnel only.</p>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 mb-6 text-sm text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                  {error}
                </motion.div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 ml-1 text-neutral-700 dark:text-neutral-300">Secret Key</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                      <Key size={18} />
                    </div>
                    <input
                      type={showAdminKey ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 bg-white/50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                      placeholder="Enter admin passcode"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminKey(v => !v)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                    >
                      {showAdminKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-400 mt-2 ml-1">Requires the NEV master passcode to enter.</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 group mt-6"
                >
                  Authenticate
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="mt-6 text-center">
                <button type="button" onClick={() => { setView('selection'); setError(''); setPassword(''); }} className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
                  ← Back to selection
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
