import { useState, useEffect } from 'react';
import { UserSettings } from '../types/api';

const defaultSettings: UserSettings = {
  language: 'en',
  voiceAssist: false,
  highContrast: false,
  dyslexicFont: false,
  reducedMotion: false,
  textToSpeechVoice: 'default',
  region: 'India',
  notifications: {
    sms: false,
    whatsapp: false,
    email: false
  }
};

export function useAccessibility() {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('jaldrishti_accessibility');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('jaldrishti_accessibility', JSON.stringify(settings));
    
    // Apply accessibility settings to document
    document.documentElement.classList.toggle('high-contrast', settings.highContrast);
    document.documentElement.classList.toggle('dyslexic-font', settings.dyslexicFont);
    document.documentElement.classList.toggle('reduced-motion', settings.reducedMotion);
  }, [settings]);

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const speak = (text: string) => {
    if (settings.voiceAssist && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = speechSynthesis.getVoices().find(voice => 
        voice.name.includes(settings.textToSpeechVoice)
      ) || null;
      speechSynthesis.speak(utterance);
    }
  };

  return {
    settings,
    updateSettings,
    speak
  };
}