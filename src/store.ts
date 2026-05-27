import { create } from 'zustand';
import {
  collection, doc, setDoc, deleteDoc,
  onSnapshot, getDocs
} from 'firebase/firestore';
import { db } from './lib/firebase';

export type Role = 'admin' | 'basic' | 'premium';

export interface User {
  id: string;
  username: string;
  password: string;
  role: Role;
}

export interface Endpoint {
  id: string;
  name: string;
  url: string;
  description: string;
  type: string;
  accessLevel: 'basic' | 'premium';
  codeSnippet: string;
}

interface AppState {
  users: User[];
  endpoints: Endpoint[];
  currentUser: Omit<User, 'password'> | null;
  theme: 'light' | 'dark';
  dbReady: boolean;
  musicUrl: string;

  // Auth
  login: (username: string, password?: string, isAdmin?: boolean) => Promise<boolean>;
  logout: () => void;
  restoreSession: () => void;

  // Theme
  toggleTheme: () => void;

  // Realtime listener starter
  initRealtimeListeners: () => () => void;

  // Admin – Users
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUserRole: (id: string, role: Role) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  // Admin – Endpoints
  addEndpoint: (endpoint: Omit<Endpoint, 'id'>) => Promise<void>;
  updateEndpoint: (id: string, endpoint: Partial<Endpoint>) => Promise<void>;
  deleteEndpoint: (id: string) => Promise<void>;

  // Admin – Music
  setMusicUrl: (url: string) => Promise<void>;
}

const SESSION_KEY = 'nnevv-session';
const THEME_KEY   = 'nnevv-theme';

const INITIAL_ENDPOINTS: Endpoint[] = [
  {
    id: 'ep-1',
    name: 'Get User Profile',
    url: '/api/v1/profile',
    description: 'Fetch basic user profile information.',
    type: 'API Endpoint',
    accessLevel: 'basic',
    codeSnippet: 'fetch("/api/v1/profile")\n  .then(res => res.json())\n  .then(console.log);',
  },
  {
    id: 'ep-2',
    name: 'WhatsApp Auto Reply Plugin',
    url: 'plugin/autoreply.js',
    description: 'Advanced auto-reply plugin with regex matching.',
    type: 'Plugin',
    accessLevel: 'premium',
    codeSnippet: 'export default function AutoReply(msg) {\n  if (msg.body.match(/hello/i)) return "Hi there!";\n}',
  },
];

export const useAppStore = create<AppState>()((set, get) => ({
  users: [],
  endpoints: [],
  currentUser: null,
  theme: (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light',
  dbReady: false,
  musicUrl: '',

  // ── Realtime listeners (Firestore) ────────────────────────────────────────
  initRealtimeListeners: () => {
    // Seed endpoint awal jika koleksi kosong
    getDocs(collection(db, 'endpoints')).then(snap => {
      if (snap.empty) {
        INITIAL_ENDPOINTS.forEach(ep =>
          setDoc(doc(db, 'endpoints', ep.id), ep)
        );
      }
    });

    const unsubUsers = onSnapshot(collection(db, 'users'), snap => {
      const users = snap.docs.map(d => d.data() as User);
      set({ users });
    });

    const unsubEndpoints = onSnapshot(collection(db, 'endpoints'), snap => {
      const endpoints = snap.docs.map(d => d.data() as Endpoint);
      set({ endpoints, dbReady: true });
    });

    // Listen to settings doc (music URL)
    const unsubSettings = onSnapshot(doc(db, 'settings', 'music'), snap => {
      if (snap.exists()) {
        set({ musicUrl: snap.data().url || '' });
      }
    });

    return () => { unsubUsers(); unsubEndpoints(); unsubSettings(); };
  },

  // ── Session restore (auto-login) ──────────────────────────────────────────
  restoreSession: () => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) set({ currentUser: JSON.parse(raw) });
    } catch {}
  },

  // ── Login ─────────────────────────────────────────────────────────────────
  login: async (username, password, isAdmin) => {
    if (isAdmin) {
      if (password === 'NEV1980') {
        const user = { id: 'admin', username: 'Administrator', role: 'admin' as Role };
        set({ currentUser: user });
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        return true;
      }
      return false;
    }

    // Ambil langsung dari Firestore agar selalu data terbaru
    const snap = await getDocs(collection(db, 'users'));
    const found = snap.docs
      .map(d => d.data() as User)
      .find(u => u.username === username && u.password === password);

    if (found) {
      const session = { id: found.id, username: found.username, role: found.role };
      set({ currentUser: session });
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return true;
    }
    return false;
  },

  logout: () => {
    set({ currentUser: null });
    localStorage.removeItem(SESSION_KEY);
  },

  // ── Theme ─────────────────────────────────────────────────────────────────
  toggleTheme: () => set(state => {
    const next = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, next);
    return { theme: next };
  }),

  // ── Users CRUD ────────────────────────────────────────────────────────────
  addUser: async (user) => {
    const id = crypto.randomUUID();
    await setDoc(doc(db, 'users', id), { ...user, id });
  },

  updateUserRole: async (id, role) => {
    await setDoc(doc(db, 'users', id), { role }, { merge: true });
  },

  deleteUser: async (id) => {
    await deleteDoc(doc(db, 'users', id));
  },

  // ── Endpoints CRUD ────────────────────────────────────────────────────────
  addEndpoint: async (endpoint) => {
    const id = crypto.randomUUID();
    await setDoc(doc(db, 'endpoints', id), { ...endpoint, id });
  },

  updateEndpoint: async (id, endpoint) => {
    await setDoc(doc(db, 'endpoints', id), endpoint, { merge: true });
  },

  deleteEndpoint: async (id) => {
    await deleteDoc(doc(db, 'endpoints', id));
  },

  // ── Music URL ─────────────────────────────────────────────────────────────
  setMusicUrl: async (url) => {
    await setDoc(doc(db, 'settings', 'music'), { url });
    set({ musicUrl: url });
  },
}));
