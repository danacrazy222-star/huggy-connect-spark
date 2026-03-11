import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Sparkles, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

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
        toast.success(t('welcomeBack'), { duration: 2000 });
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

            {isLogin && (
              <button
                type="button"
                onClick={async () => {
                  const cleanEmail = sanitize(email);
                  if (!cleanEmail) {
                    toast.error(t('email'));
                    return;
                  }
                  try {
                    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
                      redirectTo: `${window.location.origin}/reset-password`,
                    });
                    if (error) throw error;
                    toast.success(t('resetLinkSent'));
                  } catch (err: any) {
                    toast.error(err.message || 'Error');
                  }
                }}
                className="text-xs text-primary hover:underline w-full text-center"
              >
                {t('forgotPassword')}
              </button>
            )}

            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-bold shadow-gold">
              {loading ? (
                <Sparkles className="w-4 h-4 animate-spin" />
              ) : isLogin ? t('login') : t('signup')}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-muted-foreground">{t('or') || 'OR'}</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full border-border/50 bg-muted/30 hover:bg-muted/50 gap-3"
              onClick={async () => {
                const { error } = await lovable.auth.signInWithOAuth("google", {
                  redirect_uri: window.location.origin,
                });
                if (error) toast.error(error.message || 'Google login failed');
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full border-border/50 bg-muted/30 hover:bg-muted/50 gap-3"
              onClick={async () => {
                const { error } = await lovable.auth.signInWithOAuth("apple", {
                  redirect_uri: window.location.origin,
                });
                if (error) toast.error(error.message || 'Apple login failed');
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {t('allRewardsPromotional')}
        </p>
      </motion.div>
    </div>
  );
}
