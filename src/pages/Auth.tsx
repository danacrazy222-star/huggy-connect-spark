import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Sparkles, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t, isRTL } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  // Strip invisible/RTL/LTR characters from input
  const sanitize = (val: string) => val.replace(/[\u200F\u200E\u061C\u200B\u200C\u200D\uFEFF]/g, '').trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = sanitize(email);
    const cleanPassword = sanitize(password);
    if (!cleanEmail || !cleanPassword) return;
    if (cleanPassword.length < 6) {
      toast.error(t('passwordMinLength'));
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPassword });
        if (error) throw error;
        toast.success(t('welcomeBack'));
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: { display_name: sanitize(displayName) || cleanEmail },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success(t('accountCreated'));
        navigate('/');
      }
    } catch (error: any) {
      const msg = error.message || '';
      if (msg.includes('User already registered')) {
        toast.error(t('userAlreadyExists'));
        setIsLogin(true);
      } else if (msg.includes('Invalid login credentials')) {
        toast.error(t('invalidCredentials'));
      } else if (msg.includes('Email not confirmed')) {
        toast.error(t('emailNotConfirmed'));
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg flex items-center justify-center px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-6"
      >
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-bold text-gold-gradient">WINLINE</h1>
          <p className="text-muted-foreground text-sm">
            {isLogin ? t('loginSubtitle') : t('signupSubtitle')}
          </p>
        </div>

        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-6 space-y-5">
          <div className="flex bg-muted/50 rounded-xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                isLogin ? 'bg-primary text-primary-foreground shadow-gold' : 'text-muted-foreground'
              )}
            >
              {t('login')}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                !isLogin ? 'bg-primary text-primary-foreground shadow-gold' : 'text-muted-foreground'
              )}
            >
              {t('signup')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <div className="relative">
                  <User className={cn('absolute top-3 w-4 h-4 text-muted-foreground', isRTL ? 'right-3' : 'left-3')} />
                  <Input
                    type="text"
                    placeholder={t('displayName')}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className={cn('bg-muted/30 border-border/50', isRTL ? 'pr-10' : 'pl-10')}
                    maxLength={50}
                  />
                </div>
              </motion.div>
            )}

            <div className="relative">
              <Mail className={cn('absolute top-3 w-4 h-4 text-muted-foreground', isRTL ? 'right-3' : 'left-3')} />
              <Input
                type="email"
                placeholder={t('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn('bg-muted/30 border-border/50', isRTL ? 'pr-10' : 'pl-10')}
                required
                maxLength={255}
              />
            </div>

            <div className="relative">
              <Lock className={cn('absolute top-3 w-4 h-4 text-muted-foreground', isRTL ? 'right-3' : 'left-3')} />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn('bg-muted/30 border-border/50', isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10')}
                required
                minLength={6}
                maxLength={128}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn('absolute top-3 text-muted-foreground', isRTL ? 'left-3' : 'right-3')}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-bold shadow-gold">
              {loading ? (
                <Sparkles className="w-4 h-4 animate-spin" />
              ) : isLogin ? t('login') : t('signup')}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {t('allRewardsPromotional')}
        </p>
      </motion.div>
    </div>
  );
}
