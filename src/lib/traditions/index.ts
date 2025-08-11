import { Tradition, Region, RitualStep } from '@/types';

export const traditionLabels: Record<Tradition, string> = {
  andhra_smarta: 'Andhra Smārta',
  vaishnava: 'Vaishnava',
};

export const regionLabels: Record<Region, string> = {
  south: 'South Indian',
  north: 'North Indian',
};

export interface TraditionFlow {
  name: string;
  steps: RitualStep[];
  materials: string[];
  mantras: string[];
}

export const smartaDailyFlow: TraditionFlow = {
  name: 'Smārta Daily Pūjā',
  steps: [
    {
      id: '1',
      title: 'Saṅkalpa (संकल्प)',
      description: 'Set intention for the ritual with proper date and purpose',
      duration_minutes: 2,
      materials: ['kuśa grass', 'water', 'flowers'],
      mantras: ['sankalpa_mantra'],
    },
    {
      id: '2',
      title: 'Ācamana (आचमन)',
      description: 'Purification through sipping water while reciting mantras',
      duration_minutes: 3,
      materials: ['clean water', 'spoon'],
      mantras: ['achamana_mantra'],
    },
    {
      id: '3',
      title: 'Gaṇapati Dhyāna (गणपति ध्यान)',
      description: 'Invocation of Lord Gaṇeśa to remove obstacles',
      duration_minutes: 5,
      materials: ['ganapati image/murti', 'flowers', 'kumkum'],
      mantras: ['ganapati_dhyana', 'vakratunda_mahakaya'],
    },
    {
      id: '4',
      title: 'Ṣoḍaśopacāra Pūjā (षोडशोपचार पूजा)',
      description: 'Sixteen-step worship of the chosen deity',
      duration_minutes: 15,
      materials: [
        'deity image/murti',
        'flowers',
        'incense',
        'lamp',
        'kumkum',
        'turmeric',
        'sandalwood paste',
        'rice',
        'fruits',
        'water',
        'bell',
      ],
      mantras: ['dhyana_sloka', 'avahana', 'asana', 'pada_prakshalana'],
    },
    {
      id: '5',
      title: 'Ārati (आरती)',
      description: 'Offering of light to the deity with devotional songs',
      duration_minutes: 5,
      materials: ['camphor', 'lamp', 'bell'],
      mantras: ['arati_mantra'],
    },
  ],
  materials: [
    'deity images/murtis',
    'flowers',
    'incense sticks',
    'camphor',
    'oil lamp',
    'kumkum',
    'turmeric',
    'sandalwood paste',
    'rice',
    'fruits',
    'water',
    'bell',
    'kuśa grass',
  ],
  mantras: [
    'sankalpa_mantra',
    'achamana_mantra',
    'ganapati_dhyana',
    'vakratunda_mahakaya',
    'dhyana_sloka',
    'arati_mantra',
  ],
};

export const vaishnavaDailyFlow: TraditionFlow = {
  name: 'Vaishnava Daily Pūjā',
  steps: [
    {
      id: '1',
      title: 'Saṅkalpa (संकल्प)',
      description: 'Set intention dedicating the ritual to Lord Viṣṇu',
      duration_minutes: 2,
      materials: ['tulasī leaves', 'water', 'flowers'],
      mantras: ['sankalpa_mantra'],
    },
    {
      id: '2',
      title: 'Ācamana (आचमन)',
      description: 'Purification while remembering Lord Viṣṇu',
      duration_minutes: 3,
      materials: ['clean water', 'spoon'],
      mantras: ['achamana_mantra', 'vishnu_names'],
    },
    {
      id: '3',
      title: 'Viṣṇu Dhyāna (विष्णु ध्यान)',
      description: 'Meditation on Lord Viṣṇu\'s divine form',
      duration_minutes: 5,
      materials: ['viṣṇu image/śālagrāma', 'tulasī leaves', 'flowers'],
      mantras: ['vishnu_dhyana', 'om_namo_narayanaya'],
    },
    {
      id: '4',
      title: 'Tulasī Arcana (तुलसी अर्चना)',
      description: 'Special worship of sacred Tulasī plant',
      duration_minutes: 5,
      materials: ['tulasī plant', 'water', 'flowers', 'kumkum'],
      mantras: ['tulasi_stotram', 'tulasi_namaskara'],
    },
    {
      id: '5',
      title: 'Ṣoḍaśopacāra to Viṣṇu (षोडशोपचार)',
      description: 'Sixteen-step worship of Lord Viṣṇu',
      duration_minutes: 10,
      materials: [
        'viṣṇu image/śālagrāma',
        'tulasī leaves',
        'flowers',
        'incense',
        'lamp',
        'sandalwood paste',
        'rice',
        'fruits',
        'water',
        'bell',
      ],
      mantras: ['vishnu_sahasranama', 'purusha_sukta'],
    },
    {
      id: '6',
      title: 'Ārati (आरती)',
      description: 'Offering of light with Vaishnava bhajans',
      duration_minutes: 5,
      materials: ['camphor', 'lamp', 'bell'],
      mantras: ['vishnu_arati'],
    },
  ],
  materials: [
    'viṣṇu image/śālagrāma',
    'tulasī plant and leaves',
    'flowers',
    'incense sticks',
    'camphor',
    'oil lamp',
    'sandalwood paste',
    'rice',
    'fruits',
    'water',
    'bell',
    'conch shell (optional)',
  ],
  mantras: [
    'sankalpa_mantra',
    'achamana_mantra',
    'vishnu_dhyana',
    'om_namo_narayanaya',
    'tulasi_stotram',
    'vishnu_sahasranama',
    'vishnu_arati',
  ],
};

export function getTraditionFlow(tradition: Tradition, region: Region): TraditionFlow {
  switch (tradition) {
    case 'vaishnava':
      return vaishnavaDailyFlow;
    case 'andhra_smarta':
    default:
      return smartaDailyFlow;
  }
}

export function getRegionalVariations(tradition: Tradition, region: Region): string[] {
  const variations: Record<string, string[]> = {
    'andhra_smarta_south': [
      'Use coconut oil lamps',
      'Offer jasmine and marigold flowers',
      'Include banana and coconut as fruits',
      'Use Telugu mantras alongside Sanskrit',
    ],
    'andhra_smarta_north': [
      'Use mustard oil or ghee lamps',
      'Offer roses and lotus flowers',
      'Include apples and pomegranates as fruits',
      'Use Hindi translations of mantras',
    ],
    'vaishnava_south': [
      'Emphasize Tulasī worship',
      'Use sandalwood paste liberally',
      'Offer sweet rice (paramaanna)',
      'Include specific South Indian bhajans',
    ],
    'vaishnava_north': [
      'Include Rādhā-Kṛṣṇa worship',
      'Use white sandalwood paste',
      'Offer kheer and sweets',
      'Include Braj bhajans and kirtans',
    ],
  };
  
  const key = `${tradition}_${region}`;
  return variations[key] || [];
}

export function getDietaryGuidelines(tradition: Tradition): string[] {
  const guidelines: Record<Tradition, string[]> = {
    andhra_smarta: [
      'Avoid onion and garlic on festival days',
      'Prefer sattvic foods during vratas',
      'No non-vegetarian food on ritual days',
      'Avoid eating before morning pūjā',
    ],
    vaishnava: [
      'Strict vegetarian diet always',
      'No onion, garlic, mushrooms, or root vegetables',
      'Offer all food to Kṛṣṇa before eating',
      'Avoid caffeine and stimulants during festivals',
    ],
  };
  
  return guidelines[tradition] || [];
}