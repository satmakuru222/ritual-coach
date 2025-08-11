import { ChatCompletionTool } from 'openai/resources/chat/completions';

export const SYSTEM_PROMPT = `You are a traditional Hindu Brahmin with extensive knowledge of:

**Vedic Traditions & Scriptures**: Deep understanding of Hindu rituals, mantras, and ceremonial procedures from authentic sources including Vedas, Āgamas, and Dharmaśāstras.

**Regional Variations**: Familiar with South & North Indian practices, especially Andhra Smārta and Vaishnava traditions, including specific regional customs and preferences.

**Sanskrit & Vernacular Languages**: Fluent in Sanskrit with proper IAST transliteration, Telugu, Hindi, and their cultural contexts.

**Panchāng & Timing**: Knowledge of auspicious timings, tithi, nakṣatra, lunar calendar, and festival calculations.

**Cultural Sensitivity**: Deep understanding of sacred practices, dietary restrictions, traditional protocols, and the spiritual significance of rituals.

**Core Principles**:
- Provide authentic, traditionally accurate guidance
- Respect cultural and regional variations
- Maintain reverence for sacred content
- Educate with proper context and spiritual significance
- Support both beginners and advanced practitioners
- Adapt responses for kids mode when specified

**Response Guidelines**:
- Always verify ritual steps against traditional sources
- Include proper Sanskrit terms with transliteration
- Explain spiritual significance, not just procedures
- Provide material lists and timing considerations
- Respect different family traditions while maintaining authenticity
- Use appropriate cultural context and sensitivity`;

export const AGENT_TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'create_calendar_event',
      description: 'Create a calendar event for ritual or festival with proper timing',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Title of the ritual or festival event',
          },
          start: {
            type: 'string',
            description: 'Start time in ISO format',
          },
          duration: {
            type: 'number',
            description: 'Duration in minutes',
          },
          notes: {
            type: 'string',
            description: 'Additional notes about materials, mantras, or special instructions',
          },
          tradition: {
            type: 'string',
            description: 'Hindu tradition (andhra_smarta, vaishnava, etc.)',
          },
          type: {
            type: 'string',
            enum: ['daily_ritual', 'festival', 'vrata', 'special_occasion'],
            description: 'Type of event',
          },
        },
        required: ['title', 'start', 'duration', 'type'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'generate_pdf_guide',
      description: 'Generate a bilingual PDF guide for rituals or festivals',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Title of the guide',
          },
          sections: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                heading: { type: 'string' },
                content: { type: 'string' },
                mantras: {
                  type: 'array',
                  items: { type: 'string' },
                },
                materials: {
                  type: 'array',
                  items: { type: 'string' },
                },
              },
            },
            description: 'Sections of the guide with content',
          },
          language: {
            type: 'string',
            enum: ['en', 'te', 'hi'],
            description: 'Primary language for the guide',
          },
          script: {
            type: 'string',
            enum: ['en', 'te', 'hi', 'iast'],
            description: 'Script for mantras and Sanskrit content',
          },
          tradition: {
            type: 'string',
            description: 'Hindu tradition for context',
          },
        },
        required: ['title', 'sections', 'language', 'tradition'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'plan_festival',
      description: 'Create a detailed festival preparation plan with timeline',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Name of the festival',
          },
          date: {
            type: 'string',
            description: 'Festival date in ISO format',
          },
          tradition: {
            type: 'string',
            description: 'Hindu tradition (andhra_smarta, vaishnava, etc.)',
          },
          region: {
            type: 'string',
            enum: ['south', 'north'],
            description: 'Regional variation',
          },
          language: {
            type: 'string',
            enum: ['en', 'te', 'hi'],
            description: 'Language preference',
          },
          family_size: {
            type: 'number',
            description: 'Number of family members for preparation scale',
          },
          kid_mode: {
            type: 'boolean',
            description: 'Include child-friendly activities',
          },
        },
        required: ['name', 'date', 'tradition'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'chant_coach',
      description: 'Provide mantra pronunciation and chanting guidance',
      parameters: {
        type: 'object',
        properties: {
          mantra_id: {
            type: 'string',
            description: 'ID of the mantra to practice',
          },
          speed: {
            type: 'string',
            enum: ['slow', 'medium', 'fast'],
            description: 'Chanting speed preference',
          },
          kid_mode: {
            type: 'boolean',
            description: 'Simplified instructions for children',
          },
          language: {
            type: 'string',
            enum: ['en', 'te', 'hi'],
            description: 'Language for explanations',
          },
          script: {
            type: 'string',
            enum: ['en', 'te', 'hi', 'iast'],
            description: 'Script preference for displaying mantras',
          },
        },
        required: ['mantra_id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_panchang_info',
      description: 'Get current panchang information including tithi, nakshatra, and auspicious timings',
      parameters: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            description: 'Date in ISO format (defaults to today)',
          },
          location: {
            type: 'string',
            description: 'City/location for accurate calculations',
          },
          timezone: {
            type: 'string',
            description: 'Timezone for the location',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'save_user_preference',
      description: 'Save user preferences for tradition, language, and ritual settings',
      parameters: {
        type: 'object',
        properties: {
          user_id: {
            type: 'string',
            description: 'User identifier',
          },
          preferences: {
            type: 'object',
            properties: {
              tradition: { type: 'string' },
              region: { type: 'string' },
              language: { type: 'string' },
              daily_time: { type: 'string' },
              duration_minutes: { type: 'number' },
              kid_mode: { type: 'boolean' },
              dietary_rules: { type: 'string' },
            },
            description: 'User preference object',
          },
        },
        required: ['user_id', 'preferences'],
      },
    },
  },
];

export const AGENT_CONFIG = {
  model: 'gpt-4',
  temperature: 0.3, // Lower temperature for more consistent, accurate responses
  max_tokens: 2000,
  presence_penalty: 0.1,
  frequency_penalty: 0.1,
};

export function getContextualPrompt(context?: {
  tradition?: string;
  region?: string;
  language?: string;
  kid_mode?: boolean;
  user_level?: 'beginner' | 'intermediate' | 'advanced';
}) {
  if (!context) return SYSTEM_PROMPT;

  let contextualPrompt = SYSTEM_PROMPT;

  if (context.tradition) {
    contextualPrompt += `\n\n**Current Context**: User follows ${context.tradition} tradition`;
  }

  if (context.region) {
    contextualPrompt += ` in ${context.region} Indian style`;
  }

  if (context.language && context.language !== 'en') {
    contextualPrompt += `\n**Language**: Provide responses in ${context.language} when appropriate, with English explanations`;
  }

  if (context.kid_mode) {
    contextualPrompt += `\n**Kids Mode**: Adapt all responses for children - use simple language, engaging explanations, and age-appropriate spiritual concepts. Focus on fun, interactive elements while maintaining respect for traditions.`;
  }

  if (context.user_level) {
    contextualPrompt += `\n**User Level**: ${context.user_level} practitioner - adjust complexity accordingly`;
  }

  return contextualPrompt;
}