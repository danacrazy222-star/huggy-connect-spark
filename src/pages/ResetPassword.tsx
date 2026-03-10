import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const { t, isRTL } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
    });

    // Check hash for recovery type
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setIsRecovery(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error(t('passwordMinLength'));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t('passwordsDoNotMatch'));
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success(t('passwordUpdated'));
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen bg-premium-gradient stars-bg flex items-center justify-center px-4">
        <p className="text-muted-foreground">{t('resetPassword')}...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-premium-gradient stars-bg flex items-center justify-center px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-6"
      >
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-bold text-gold-gradient">WINLINE</h1>
          <p className="text-muted-foreground text-sm">{t('resetPassword')}</p>
        </div>

        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className={cn('absolute top-3 w-4 h-4 text-muted-foreground', isRTL ? 'right-3' : 'left-3')} />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('newPassword')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn('bg-muted/30 border-border/50', isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10')}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn('absolute top-3 text-muted-foreground', isRTL ? 'left-3' : 'right-3')}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Lock className={cn('absolute top-3 w-4 h-4 text-muted-foreground', isRTL ? 'right-3' : 'left-3')} />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('confirmNewPassword')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={cn('bg-muted/30 border-border/50', isRTL ? 'pr-10' : 'pl-10')}
                required
                minLength={6}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-bold shadow-gold">
              {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : t('resetPassword')}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
