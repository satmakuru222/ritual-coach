import { RitualCoachAgent as ClaudeAgent } from './claude-client';
import { RitualCoachOpenAIAgent } from './openai-client';

export interface AgentContext {
  tradition?: string;
  region?: string;
  language?: 'en' | 'te' | 'hi';
  kid_mode?: boolean;
  user_level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface AgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AgentResponse {
  content: string;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  function_calls?: any[];
  tool_calls?: any[];
  tool_results?: any[];
}

export type AgentProvider = 'claude' | 'openai';

export class RitualCoachAgent {
  private claudeAgent?: ClaudeAgent;
  private openaiAgent?: RitualCoachOpenAIAgent;
  private provider: AgentProvider;

  constructor(provider: AgentProvider = 'openai') {
    this.provider = provider;
    
    try {
      if (provider === 'claude') {
        if (!process.env.ANTHROPIC_API_KEY) {
          throw new Error('ANTHROPIC_API_KEY environment variable is required for Claude');
        }
        this.claudeAgent = new ClaudeAgent();
      } else if (provider === 'openai') {
        if (!process.env.OPENAI_API_KEY) {
          throw new Error('OPENAI_API_KEY environment variable is required for OpenAI');
        }
        this.openaiAgent = new RitualCoachOpenAIAgent();
      } else {
        throw new Error(`Unsupported agent provider: ${provider}`);
      }
    } catch (error) {
      console.warn(`Failed to initialize ${provider} agent:`, error);
      
      // Fallback to the other provider if available
      if (provider === 'claude' && process.env.OPENAI_API_KEY) {
        console.log('Falling back to OpenAI agent');
        this.provider = 'openai';
        this.openaiAgent = new RitualCoachOpenAIAgent();
      } else if (provider === 'openai' && process.env.ANTHROPIC_API_KEY) {
        console.log('Falling back to Claude agent');
        this.provider = 'claude';
        this.claudeAgent = new ClaudeAgent();
      } else {
        throw new Error('No valid agent provider available');
      }
    }
  }

  getProvider(): AgentProvider {
    return this.provider;
  }

  async chat(
    message: string,
    context?: AgentContext,
    conversationHistory?: AgentMessage[]
  ): Promise<AgentResponse> {
    try {
      if (this.provider === 'claude' && this.claudeAgent) {
        const response = await this.claudeAgent.chat(message, context, conversationHistory);
        return {
          content: response.content,
          usage: {
            input_tokens: response.usage?.input_tokens,
            output_tokens: response.usage?.output_tokens,
          },
        };
      } else if (this.provider === 'openai' && this.openaiAgent) {
        const response = await this.openaiAgent.chat(message, context, conversationHistory);
        return {
          content: response.content,
          usage: {
            prompt_tokens: response.usage?.prompt_tokens,
            completion_tokens: response.usage?.completion_tokens,
            total_tokens: response.usage?.total_tokens,
          },
          function_calls: response.function_calls,
        };
      } else {
        throw new Error('No agent available');
      }
    } catch (error) {
      console.error('Agent chat error:', error);
      throw new Error('Failed to get response from Ritual Coach agent');
    }
  }

  // Delegate specialized methods to the appropriate agent
  async createCalendarEvent(params: {
    title: string;
    start: string;
    duration: number;
    notes?: string;
    tradition?: string;
    type?: string;
  }) {
    if (this.provider === 'claude' && this.claudeAgent) {
      return await this.claudeAgent.createCalendarEvent(params);
    } else if (this.provider === 'openai' && this.openaiAgent) {
      return await this.openaiAgent.createCalendarEvent(params);
    } else {
      throw new Error('No agent available');
    }
  }

  async generatePDFGuide(params: {
    title: string;
    sections: any[];
    language: string;
    script?: string;
    tradition?: string;
  }) {
    if (this.provider === 'claude' && this.claudeAgent) {
      return await this.claudeAgent.generatePDFGuide(params);
    } else if (this.provider === 'openai' && this.openaiAgent) {
      return await this.openaiAgent.generatePDFGuide(params);
    } else {
      throw new Error('No agent available');
    }
  }

  async planFestival(params: {
    name: string;
    date: string;
    tradition: string;
    region?: string;
    language?: string;
    family_size?: number;
    kid_mode?: boolean;
  }) {
    if (this.provider === 'claude' && this.claudeAgent) {
      return await this.claudeAgent.planFestival(params);
    } else if (this.provider === 'openai' && this.openaiAgent) {
      return await this.openaiAgent.planFestival(params);
    } else {
      throw new Error('No agent available');
    }
  }

  async getPanchangInfo(params: {
    date?: string;
    location?: string;
    timezone?: string;
  }) {
    if (this.provider === 'claude' && this.claudeAgent) {
      return await this.claudeAgent.getPanchangInfo(params);
    } else if (this.provider === 'openai' && this.openaiAgent) {
      return await this.openaiAgent.getPanchangInfo(params);
    } else {
      throw new Error('No agent available');
    }
  }

  async getDailyRitual(tradition: string, region: string, language: string = 'en'): Promise<AgentResponse> {
    if (this.provider === 'claude' && this.claudeAgent) {
      return await this.claudeAgent.getDailyRitual(tradition, region, language);
    } else if (this.provider === 'openai' && this.openaiAgent) {
      return await this.openaiAgent.getDailyRitual(tradition, region, language);
    } else {
      throw new Error('No agent available');
    }
  }

  async getFestivalGuidance(festivalName: string, date: string, tradition: string, language: string = 'en'): Promise<AgentResponse> {
    if (this.provider === 'claude' && this.claudeAgent) {
      return await this.claudeAgent.getFestivalGuidance(festivalName, date, tradition, language);
    } else if (this.provider === 'openai' && this.openaiAgent) {
      return await this.openaiAgent.getFestivalGuidance(festivalName, date, tradition, language);
    } else {
      throw new Error('No agent available');
    }
  }

  async getMantraGuidance(mantraName: string, script: string = 'iast', language: string = 'en'): Promise<AgentResponse> {
    if (this.provider === 'claude' && this.claudeAgent) {
      return await this.claudeAgent.getMantraGuidance(mantraName, script, language);
    } else if (this.provider === 'openai' && this.openaiAgent) {
      return await this.openaiAgent.getMantraGuidance(mantraName, script, language);
    } else {
      throw new Error('No agent available');
    }
  }

  async getKidsGuidance(topic: string, age?: number, language: string = 'en'): Promise<AgentResponse> {
    if (this.provider === 'claude' && this.claudeAgent) {
      return await this.claudeAgent.getKidsGuidance(topic, age, language);
    } else if (this.provider === 'openai' && this.openaiAgent) {
      return await this.openaiAgent.getKidsGuidance(topic, age, language);
    } else {
      throw new Error('No agent available');
    }
  }
}