import { Language } from '@/types';

export const languages: Record<Language, string> = {
  te: 'తెలుగు',
  hi: 'हिन्दी',
  en: 'English',
};

export const translations = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      next: 'Next',
      back: 'Back',
      complete: 'Complete',
      loading: 'Loading...',
      error: 'An error occurred',
    },
    ritual: {
      daily_ritual: 'Daily Ritual',
      start_ritual: 'Start Ritual',
      ritual_complete: 'Ritual Complete',
      materials_needed: 'Materials Needed',
      estimated_time: 'Estimated Time',
      minutes: 'minutes',
    },
    festival: {
      upcoming_festivals: 'Upcoming Festivals',
      festival_preparation: 'Festival Preparation',
      prep_checklist: 'Preparation Checklist',
      prasadam: 'Prasādam',
      decorations: 'Decorations',
    },
    mantra: {
      mantras: 'Mantras',
      pronunciation: 'Pronunciation',
      meaning: 'Meaning',
      cadence: 'Cadence',
      slow: 'Slow',
      medium: 'Medium',
      fast: 'Fast',
    },
    kids: {
      kids_mode: 'Kids Mode',
      simple_steps: 'Simple Steps',
      fun_activities: 'Fun Activities',
      coloring_pages: 'Coloring Pages',
    },
    onboarding: {
      welcome: 'Welcome to Ritual Coach',
      select_tradition: 'Select Your Tradition',
      select_region: 'Select Your Region',
      select_language: 'Select Your Language',
      daily_schedule: 'Daily Schedule',
      preferences: 'Preferences',
      complete_setup: 'Complete Setup',
    },
  },
  te: {
    common: {
      save: 'సేవ్ చేయి',
      cancel: 'రద్దు చేయి',
      next: 'తరువాత',
      back: 'వెనుకకు',
      complete: 'పూర్తి',
      loading: 'లోడవుతోంది...',
      error: 'ఒక లోపం జరిగింది',
    },
    ritual: {
      daily_ritual: 'దైనిక పూజ',
      start_ritual: 'పూజ మొదలుపెట్టు',
      ritual_complete: 'పూజ పూర్తి',
      materials_needed: 'అవసరమైన వస్తువులు',
      estimated_time: 'అంచనా సమయం',
      minutes: 'నిమిషాలు',
    },
    festival: {
      upcoming_festivals: 'రాబోయే పండుగలు',
      festival_preparation: 'పండుగ సిద్ధం',
      prep_checklist: 'సిద్ధపు జాబితా',
      prasadam: 'ప్రసాదం',
      decorations: 'అలంకారాలు',
    },
    mantra: {
      mantras: 'మంత్రాలు',
      pronunciation: 'ఉచ్చారణ',
      meaning: 'అర్థం',
      cadence: 'లయ',
      slow: 'నెమ్మది',
      medium: 'మధ్యమ',
      fast: 'వేగం',
    },
    kids: {
      kids_mode: 'పిల్లల మోడ్',
      simple_steps: 'సులభ దశలు',
      fun_activities: 'వినోద కార్యకలాపాలు',
      coloring_pages: 'రంగు వేయు పేజీలు',
    },
    onboarding: {
      welcome: 'రిచువల్ కోచ్‌కు స్వాగతం',
      select_tradition: 'మీ సంప్రదాయం ఎంచుకోండి',
      select_region: 'మీ ప్రాంతం ఎంచుకోండి',
      select_language: 'మీ భాష ఎంచుకోండి',
      daily_schedule: 'దైనిక కాలక్రమం',
      preferences: 'ప్రాధాన్యతలు',
      complete_setup: 'సెటప్ పూర్తి చేయండి',
    },
  },
  hi: {
    common: {
      save: 'सहेजें',
      cancel: 'रद्द करें',
      next: 'अगला',
      back: 'पीछे',
      complete: 'पूर्ण',
      loading: 'लोड हो रहा है...',
      error: 'एक त्रुटि हुई',
    },
    ritual: {
      daily_ritual: 'दैनिक पूजा',
      start_ritual: 'पूजा शुरू करें',
      ritual_complete: 'पूजा पूर्ण',
      materials_needed: 'आवश्यक सामग्री',
      estimated_time: 'अनुमानित समय',
      minutes: 'मिनट',
    },
    festival: {
      upcoming_festivals: 'आगामी त्योहार',
      festival_preparation: 'त्योहार की तैयारी',
      prep_checklist: 'तैयारी सूची',
      prasadam: 'प्रसादम्',
      decorations: 'सजावट',
    },
    mantra: {
      mantras: 'मंत्र',
      pronunciation: 'उच्चारण',
      meaning: 'अर्थ',
      cadence: 'लय',
      slow: 'धीमा',
      medium: 'मध्यम',
      fast: 'तेज़',
    },
    kids: {
      kids_mode: 'बच्चों का मोड',
      simple_steps: 'सरल चरण',
      fun_activities: 'मजेदार गतिविधियां',
      coloring_pages: 'रंग भरने के पेज',
    },
    onboarding: {
      welcome: 'रिचुअल कोच में स्वागत',
      select_tradition: 'अपनी परंपरा चुनें',
      select_region: 'अपना क्षेत्र चुनें',
      select_language: 'अपनी भाषा चुनें',
      daily_schedule: 'दैनिक कार्यक्रम',
      preferences: 'प्राथमिकताएं',
      complete_setup: 'सेटअप पूरा करें',
    },
  },
};

export function useTranslation(language: Language = 'en') {
  return {
    t: (key: string) => {
      const keys = key.split('.');
      let value: any = translations[language];
      
      for (const k of keys) {
        value = value?.[k];
      }
      
      return value || key;
    },
    language,
  };
}