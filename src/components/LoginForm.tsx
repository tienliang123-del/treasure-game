import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { login, register } from '../auth';

interface LoginFormProps {
  onLogin: (username: string) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const isRegister = mode === 'register';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const name = username.trim();
    if (!name || !password) {
      setError('請輸入使用者名稱和密碼');
      return;
    }

    try {
      if (isRegister) {
        if (password.length < 4) throw new Error('密碼至少需要 4 個字元');
        if (password !== confirmPassword) throw new Error('兩次輸入的密碼不一致');
        await register(name, password);
      } else {
        await login(name, password);
      }
      onLogin(name);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const switchMode = () => {
    setMode(isRegister ? 'login' : 'register');
    setError('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl mb-8 text-amber-900">🏴‍☠️ Treasure Hunt Game 🏴‍☠️</h1>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit}
        className="w-full p-8 bg-amber-200/80 backdrop-blur-sm rounded-xl shadow-lg border-2 border-amber-400 flex flex-col gap-4"
        style={{ maxWidth: '24rem' }}
      >
        <h2 className="text-2xl text-center text-amber-900">
          {isRegister ? '註冊新帳號' : '登入'}
        </h2>

        <div className="flex flex-col gap-2">
          <Label htmlFor="username" className="text-amber-900">使用者名稱</Label>
          <Input
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-amber-900">密碼</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
          />
        </div>

        {isRegister && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword" className="text-amber-900">確認密碼</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white">
          {isRegister ? '註冊並開始遊戲' : '登入'}
        </Button>

        <button
          type="button"
          onClick={switchMode}
          className="text-sm text-amber-800 underline"
        >
          {isRegister ? '已經有帳號？前往登入' : '還沒有帳號？立即註冊'}
        </button>
      </motion.form>
    </div>
  );
}
