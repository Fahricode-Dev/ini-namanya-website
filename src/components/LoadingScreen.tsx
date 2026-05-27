import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-neutral-950"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer glowing rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="absolute w-32 h-32 rounded-full border-t-2 border-indigo-500/50 blur-[2px]"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          className="absolute w-24 h-24 rounded-full border-b-2 border-purple-500/50 blur-[1px]"
        />
        
        {/* Inner pulsing logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
          transition={{ 
            scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
            opacity: { duration: 0.5 }
          }}
          className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
        >
          <span className="text-3xl font-bold text-white tracking-tighter">N</span>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex flex-col items-center gap-2"
      >
        <h1 className="text-xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-200">
          Nnevv Feature
        </h1>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
              className="w-1.5 h-1.5 rounded-full bg-indigo-500"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
