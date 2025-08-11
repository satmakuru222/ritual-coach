interface EnvironmentConfig {
  notion: {
    apiKey: string;
    databases: {
      ritualProfiles: string;
      rituals: string;
      festivals: string;
      mantras: string;
      prasadam: string;
      checklists: string;
    };
  };
  claude: {
    apiKey?: string;
  };
  openai: {
    apiKey?: string;
  };
  agent: {
    preferredProvider: 'claude' | 'openai';
  };
  app: {
    nodeEnv: string;
    url: string;
  };
}

interface ValidationResult {
  isValid: boolean;
  missingVars: string[];
  errors: string[];
}

export function validateEnvironment(): ValidationResult {
  const missingVars: string[] = [];
  const errors: string[] = [];

  // Check Notion configuration
  if (!process.env.NOTION_API_KEY) {
    missingVars.push('NOTION_API_KEY');
  }

  const notionDatabases = [
    'NOTION_DATABASE_RITUAL_PROFILES',
    'NOTION_DATABASE_RITUALS', 
    'NOTION_DATABASE_FESTIVALS',
    'NOTION_DATABASE_MANTRAS',
    'NOTION_DATABASE_PRASADAM',
    'NOTION_DATABASE_CHECKLISTS'
  ];

  notionDatabases.forEach(dbVar => {
    if (!process.env[dbVar]) {
      missingVars.push(dbVar);
    }
  });

  // Check agent API configuration - at least one must be present
  const hasClaudeKey = process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here';
  const hasOpenAIKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here';
  
  if (!hasClaudeKey && !hasOpenAIKey) {
    errors.push('At least one AI provider API key is required (ANTHROPIC_API_KEY or OPENAI_API_KEY)');
  }

  // Check individual API key configurations
  if (process.env.ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
    errors.push('ANTHROPIC_API_KEY is set to placeholder value');
  }
  
  if (process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    errors.push('OPENAI_API_KEY is set to placeholder value');
  }

  // Validate API key formats
  if (process.env.NOTION_API_KEY && !process.env.NOTION_API_KEY.startsWith('ntn_')) {
    errors.push('NOTION_API_KEY should start with "ntn_"');
  }
  
  if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here' && !process.env.ANTHROPIC_API_KEY.startsWith('sk-ant-')) {
    errors.push('ANTHROPIC_API_KEY should start with "sk-ant-"');
  }
  
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here' && !process.env.OPENAI_API_KEY.startsWith('sk-')) {
    errors.push('OPENAI_API_KEY should start with "sk-"');
  }

  // Validate database ID format (Notion UUIDs are 32 characters)
  notionDatabases.forEach(dbVar => {
    const value = process.env[dbVar];
    if (value && value.length !== 32) {
      errors.push(`${dbVar} should be a 32-character Notion database ID`);
    }
  });

  return {
    isValid: missingVars.length === 0 && errors.length === 0,
    missingVars,
    errors,
  };
}

export function getEnvironmentConfig(): EnvironmentConfig | null {
  const validation = validateEnvironment();
  
  if (!validation.isValid) {
    console.error('Environment validation failed:', {
      missingVars: validation.missingVars,
      errors: validation.errors,
    });
    return null;
  }

  // Determine preferred provider based on available keys
  let preferredProvider: 'claude' | 'openai' = 'openai';
  
  if (process.env.PREFERRED_AGENT_PROVIDER) {
    preferredProvider = process.env.PREFERRED_AGENT_PROVIDER as 'claude' | 'openai';
  } else if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    preferredProvider = 'openai';
  } else if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here') {
    preferredProvider = 'claude';
  }

  return {
    notion: {
      apiKey: process.env.NOTION_API_KEY!,
      databases: {
        ritualProfiles: process.env.NOTION_DATABASE_RITUAL_PROFILES!,
        rituals: process.env.NOTION_DATABASE_RITUALS!,
        festivals: process.env.NOTION_DATABASE_FESTIVALS!,
        mantras: process.env.NOTION_DATABASE_MANTRAS!,
        prasadam: process.env.NOTION_DATABASE_PRASADAM!,
        checklists: process.env.NOTION_DATABASE_CHECKLISTS!,
      },
    },
    claude: {
      apiKey: (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here') 
        ? process.env.ANTHROPIC_API_KEY 
        : undefined,
    },
    openai: {
      apiKey: (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') 
        ? process.env.OPENAI_API_KEY 
        : undefined,
    },
    agent: {
      preferredProvider,
    },
    app: {
      nodeEnv: process.env.NODE_ENV || 'development',
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
  };
}

export function logEnvironmentStatus(): void {
  const validation = validateEnvironment();
  
  if (validation.isValid) {
    console.log('✅ Environment configuration is valid');
  } else {
    console.error('❌ Environment configuration issues:');
    
    if (validation.missingVars.length > 0) {
      console.error('Missing environment variables:', validation.missingVars);
    }
    
    if (validation.errors.length > 0) {
      console.error('Configuration errors:', validation.errors);
    }
    
    console.error('Please check your .env.local file');
  }
}