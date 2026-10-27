// Front-end only auth: accounts and stats live in localStorage.
// Not secure — anyone with access to the browser can read or edit this data.

export interface UserStats {
  gamesPlayed: number;
  highScore: number;
  totalScore: number;
}

interface StoredUser {
  passwordHash: string;
  stats: UserStats;
}

const USERS_KEY = 'treasure_users';
const SESSION_KEY = 'treasure_current_user';

const emptyStats = (): UserStats => ({ gamesPlayed: 0, highScore: 0, totalScore: 0 });

function loadUsers(): Record<string, StoredUser> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, StoredUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function register(username: string, password: string) {
  const users = loadUsers();
  if (users[username]) throw new Error('此使用者名稱已被註冊');
  users[username] = { passwordHash: await hashPassword(password), stats: emptyStats() };
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, username);
}

export async function login(username: string, password: string) {
  const user = loadUsers()[username];
  if (!user || user.passwordHash !== (await hashPassword(password))) {
    throw new Error('使用者名稱或密碼錯誤');
  }
  localStorage.setItem(SESSION_KEY, username);
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): string | null {
  const username = localStorage.getItem(SESSION_KEY);
  return username && loadUsers()[username] ? username : null;
}

export function getStats(username: string): UserStats {
  return loadUsers()[username]?.stats ?? emptyStats();
}

export function recordGame(username: string, score: number): UserStats {
  const users = loadUsers();
  const user = users[username];
  if (!user) return emptyStats();
  const { gamesPlayed, highScore, totalScore } = user.stats;
  user.stats = {
    gamesPlayed: gamesPlayed + 1,
    highScore: gamesPlayed === 0 ? score : Math.max(highScore, score),
    totalScore: totalScore + score,
  };
  saveUsers(users);
  return user.stats;
}
