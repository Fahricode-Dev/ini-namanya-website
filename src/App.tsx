import { useEffect, useState } from 'react';
import { useAppStore } from './store';
import { LoadingScreen } from './components/LoadingScreen';
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
import { Moon, Sun, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const {
    theme, toggleTheme,
    currentUser, logout,
    initRealtimeListeners, restoreSession,
    dbReady,
  } = useAppStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sync theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    // Restore session dari localStorage (auto-login)
    restoreSession();

    // Mulai realtime Firestore listeners
    const unsub = initRealtimeListeners();

    // Tunggu DB ready max 3 detik, lalu tampil
    const timer = setTimeout(() => setLoading(false), 2500);

    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, []);

  // Kalau DB sudah ready lebih cepat, langsung tampil
  useEffect(() => {
    if (dbReady) {
      const t = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(t);
    }
  }, [dbReady]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300" style={{ fontFamily: "'Sora', system-ui, sans-serif" }}>
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen key="loading" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col min-h-screen"
          >
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    N
                  </div>
                  <span className="font-bold text-lg tracking-tight">Nnevv Feature</span>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>

                  {currentUser && (
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium hidden sm:block">
                        {currentUser.username}
                        <span className="ml-2 text-xs px-2 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                          {currentUser.role.toUpperCase()}
                        </span>
                      </span>
                      <button
                        onClick={logout}
                        className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Main */}
            <main className="flex-1 pt-16 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[100px]" />
              </div>

              <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
                {!currentUser ? (
                  <Landing />
                ) : currentUser.role === 'admin' ? (
                  <AdminPanel />
                ) : (
                  <Dashboard />
                )}
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
