import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.dbe499c6b0314f84a0d1f3b69ecafbab',
  appName: 'Winline',
  webDir: 'dist',
  server: {
    url: 'https://dbe499c6-b031-4f84-a0d1-f3b69ecafbab.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#1a0a2e',
    preferredContentMode: 'mobile',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#1a0a2e',
      showSpinner: false,
      launchFadeOutDuration: 500,
    },
  },
};

export default config;
