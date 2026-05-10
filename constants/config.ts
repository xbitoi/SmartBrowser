// Powered by OnSpace.AI
export const DEFAULT_SETTINGS = {
  url: 'https://example.com',
  isActive: true,
  settingsPassword: 'admin',
  welcomeMessage: 'مرحباً بك في تطبيقنا',
  themeColor: '#3b82f6',
  bannerOpacity: 100,
  bannerFontSize: 18,
  bannerTextColor: '#ffffff',
  marqueeSpeed: 15,
  marqueeDirection: 'rtl' as 'rtl' | 'ltr',
  broadcastMessage: { text: '', isActive: false },
};

export type AppSettings = typeof DEFAULT_SETTINGS;
