import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import { Copy, Check, Lock, Code, Server, Plug, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';

export function Dashboard() {
  const { currentUser, endpoints } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!currentUser) return null;

  const isPremium = currentUser.role === 'premium' || currentUser.role === 'admin';

  const filteredEndpoints = endpoints.filter(ep => 
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
      case 'plugin': return <Plug size={18} />;
      case 'case': return <Code size={18} />;
      default: return <Server size={18} />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Endpoints Hub</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Browse and integrate WhatsApp bot features. 
            {!isPremium && <span className="text-indigo-500 font-medium ml-1">Upgrade to Premium for full access.</span>}
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder="Search endpoints..."
          />
        </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {filteredEndpoints.map((endpoint, i) => {
            const isLocked = endpoint.accessLevel === 'premium' && !isPremium;
            const isExpanded = expandedId === endpoint.id;

            return (
              <motion.div
                key={endpoint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md border rounded-2xl overflow-hidden transition-all duration-300",
                  isLocked ? "border-neutral-200 dark:border-neutral-800 opacity-75" : "border-indigo-100 dark:border-indigo-900/30 hover:shadow-lg hover:shadow-indigo-500/5"
                )}
              >
                <div 
                  className={cn(
                    "p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer",
                    !isLocked && "hover:bg-black/5 dark:hover:bg-white/5"
                  )}
                  onClick={() => !isLocked && setExpandedId(isExpanded ? null : endpoint.id)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      endpoint.accessLevel === 'premium' 
                        ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white" 
                        : "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                    )}>
                      {isLocked ? <Lock size={20} /> : getIcon(endpoint.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg truncate">{endpoint.name}</h3>
                        {endpoint.accessLevel === 'premium' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                        {endpoint.type} • {endpoint.url}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-neutral-400">
                    {!isLocked && (isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />)}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && !isLocked && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50"
                    >
                      <div className="p-5 space-y-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-300">
                          {endpoint.description}
                        </p>
                        
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-30 blur transition duration-500" />
                          <div className="relative bg-neutral-900 rounded-xl p-4 overflow-x-auto">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">{endpoint.type} Code</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleCopy(endpoint.codeSnippet, endpoint.id); }}
                                className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs bg-white/10 px-2 py-1 rounded-md"
                              >
                                {copiedId === endpoint.id ? <><Check size={14} className="text-green-400" /> Copied</> : <><Copy size={14} /> Copy</>}
                              </button>
                            </div>
                            <pre className="text-sm font-mono text-neutral-300">
                              <code>{endpoint.codeSnippet}</code>
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
          
          {filteredEndpoints.length === 0 && (
            <div className="text-center py-12 text-neutral-500">
              No endpoints found matching your search.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
