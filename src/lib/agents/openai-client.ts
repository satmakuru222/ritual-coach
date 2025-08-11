import OpenAI from 'openai';
import { AGENT_TOOLS, AGENT_CONFIG, getContextualPrompt } from './config';

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
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  function_calls?: Array<{
    name: string;
    arguments: any;
    result?: any;
  }>;
}

export interface ToolResult {
  name: string;
  result: string;
  success: boolean;
}

export class RitualCoachOpenAIAgent {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async chat(
    message: string,
    context?: AgentContext,
    conversationHistory?: AgentMessage[],
    enableTools: boolean = true
  ): Promise<AgentResponse> {
    try {
      const systemPrompt = getContextualPrompt(context);
      
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: systemPrompt,
        }
      ];
      
      // Add conversation history
      if (conversationHistory && conversationHistory.length > 0) {
        conversationHistory.forEach(msg => {
          messages.push({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          });
        });
      }

      // Add current message
      messages.push({
        role: 'user',
        content: message,
      });

      const chatParams: OpenAI.Chat.Completions.ChatCompletionCreateParams = {
        model: AGENT_CONFIG.model,
        messages,
        temperature: AGENT_CONFIG.temperature,
        max_tokens: AGENT_CONFIG.max_tokens,
        presence_penalty: AGENT_CONFIG.presence_penalty,
        frequency_penalty: AGENT_CONFIG.frequency_penalty,
      };

      // Add tools if enabled
      if (enableTools) {
        chatParams.tools = AGENT_TOOLS;
        chatParams.tool_choice = 'auto';
      }

      const response = await this.openai.chat.completions.create(chatParams);

      const choice = response.choices[0];
      if (!choice) {
        throw new Error('No response from OpenAI');
      }

      let content = choice.message.content || '';
      const functionCalls: Array<{ name: string; arguments: any; result?: any }> = [];

      // Handle tool calls
      if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
        for (const toolCall of choice.message.tool_calls) {
          if (toolCall.type === 'function') {
            const functionName = toolCall.function.name;
            const functionArgs = JSON.parse(toolCall.function.arguments);
            
            try {
              const result = await this.executeFunction(functionName, functionArgs);
              functionCalls.push({
                name: functionName,
                arguments: functionArgs,
                result: result,
              });
            } catch (error) {
              console.error(`Error executing function ${functionName}:`, error);
              functionCalls.push({
                name: functionName,
                arguments: functionArgs,
                result: { error: 'Function execution failed' },
              });
            }
          }
        }

        // If we had function calls, make a follow-up request with the results
        if (functionCalls.length > 0) {
          const followUpMessages = [...messages];
          
          // Add assistant message with tool calls
          followUpMessages.push({
            role: 'assistant',
            content: choice.message.content,
            tool_calls: choice.message.tool_calls,
          });

          // Add tool results
          for (const toolCall of choice.message.tool_calls) {
            const funcCall = functionCalls.find(fc => fc.name === toolCall.function.name);
            followUpMessages.push({
              role: 'tool',
              content: JSON.stringify(funcCall?.result || {}),
              tool_call_id: toolCall.id,
            });
          }

          const followUpResponse = await this.openai.chat.completions.create({
            ...chatParams,
            messages: followUpMessages,
            tools: undefined, // Don't allow more tool calls in follow-up
            tool_choice: undefined,
          });

          const followUpChoice = followUpResponse.choices[0];
          content = followUpChoice?.message.content || content;
          
          return {
            content,
            usage: {
              prompt_tokens: response.usage?.prompt_tokens || 0,
              completion_tokens: response.usage?.completion_tokens || 0,
              total_tokens: response.usage?.total_tokens || 0,
            },
            function_calls: functionCalls,
          };
        }
      }

      return {
        content,
        usage: {
          prompt_tokens: response.usage?.prompt_tokens || 0,
          completion_tokens: response.usage?.completion_tokens || 0,
          total_tokens: response.usage?.total_tokens || 0,
        },
        function_calls: functionCalls,
      };
    } catch (error) {
      console.error('OpenAI chat error:', error);
      throw new Error('Failed to get response from OpenAI agent');
    }
  }

  private async executeFunction(functionName: string, args: any): Promise<any> {
    switch (functionName) {
      case 'create_calendar_event':
        return await this.createCalendarEvent(args);
      case 'generate_pdf_guide':
        return await this.generatePDFGuide(args);
      case 'plan_festival':
        return await this.planFestival(args);
      case 'chant_coach':
        return await this.chantCoach(args);
      case 'get_panchang_info':
        return await this.getPanchangInfo(args);
      case 'save_user_preference':
        return await this.saveUserPreference(args);
      default:
        throw new Error(`Unknown function: ${functionName}`);
    }
  }

  // Tool implementation methods
  async createCalendarEvent(params: {
    title: string;
    start: string;
    duration: number;
    notes?: string;
    tradition?: string;
    type?: string;
  }): Promise<ToolResult> {
    // TODO: Implement actual calendar integration
    console.log('Creating calendar event:', params);
    
    return {
      name: 'create_calendar_event',
      result: `Calendar event "${params.title}" created successfully for ${params.start}`,
      success: true,
    };
  }

  async generatePDFGuide(params: {
    title: string;
    sections: any[];
    language: string;
    script?: string;
    tradition?: string;
  }): Promise<ToolResult> {
    // TODO: Implement actual PDF generation
    console.log('Generating PDF guide:', params);
    
    return {
      name: 'generate_pdf_guide',
      result: `PDF guide "${params.title}" generated successfully in ${params.language}`,
      success: true,
    };
  }

  async planFestival(params: {
    name: string;
    date: string;
    tradition: string;
    region?: string;
    language?: string;
    family_size?: number;
    kid_mode?: boolean;
  }): Promise<ToolResult> {
    // TODO: Implement festival planning logic
    console.log('Planning festival:', params);
    
    return {
      name: 'plan_festival',
      result: `Festival plan for ${params.name} created successfully for ${params.date}`,
      success: true,
    };
  }

  async chantCoach(params: {
    mantra_id: string;
    speed?: string;
    kid_mode?: boolean;
    language?: string;
    script?: string;
  }): Promise<ToolResult> {
    // TODO: Implement chant coaching logic
    console.log('Providing chant coaching:', params);
    
    return {
      name: 'chant_coach',
      result: `Chanting guidance provided for mantra ${params.mantra_id}`,
      success: true,
    };
  }

  async getPanchangInfo(params: {
    date?: string;
    location?: string;
    timezone?: string;
  }): Promise<ToolResult> {
    // TODO: Integrate with actual Panchang API
    const panchang = {
      date: params.date || new Date().toISOString().split('T')[0],
      location: params.location || 'India',
      timezone: params.timezone || 'Asia/Kolkata',
      tithi: 'Dvādaśī',
      nakshatra: 'Anurādhā',
      yoga: 'Siddhi',
      karana: 'Viśṭi',
      sunrise: '06:15',
      sunset: '18:30',
      auspicious_times: {
        brahma_muhurta: '04:30 - 05:15',
        abhijit_muhurta: '11:45 - 12:30',
      },
    };

    console.log('Fetching panchang info:', panchang);
    
    return {
      name: 'get_panchang_info',
      result: JSON.stringify(panchang),
      success: true,
    };
  }

  async saveUserPreference(params: {
    user_id: string;
    preferences: any;
  }): Promise<ToolResult> {
    // TODO: Implement user preference saving to Notion
    console.log('Saving user preferences:', params);
    
    return {
      name: 'save_user_preference',
      result: `User preferences saved for ${params.user_id}`,
      success: true,
    };
  }

  // Specialized methods for common ritual guidance (similar to Claude client)
  async getDailyRitual(tradition: string, region: string, language: string = 'en'): Promise<AgentResponse> {
    const message = `Please provide today's daily ritual (pūjā) guidance for ${tradition} tradition in ${region} Indian style. Include the complete step-by-step process, required materials, mantras, and estimated timing. Be specific about the traditional procedures and their spiritual significance.`;
    
    const context: AgentContext = {
      tradition,
      region: region as 'south' | 'north',
      language: language as 'en' | 'te' | 'hi',
    };

    return await this.chat(message, context);
  }

  async getFestivalGuidance(festivalName: string, date: string, tradition: string, language: string = 'en'): Promise<AgentResponse> {
    const message = `Please provide complete preparation guidance for ${festivalName} on ${date} following ${tradition} tradition. Include:

1. Preparation timeline (7 days before to festival day)
2. Required materials and shopping list
3. Traditional ritual procedures step-by-step
4. Authentic prasādam (offerings) recipes
5. Decoration ideas and setup
6. Spiritual significance and stories
7. Regional variations and family customs

Make it practical and authentic, suitable for home celebration.`;
    
    const context: AgentContext = {
      tradition,
      language: language as 'en' | 'te' | 'hi',
    };

    return await this.chat(message, context);
  }

  async getMantraGuidance(mantraName: string, script: string = 'iast', language: string = 'en'): Promise<AgentResponse> {
    const message = `Please provide comprehensive guidance for the ${mantraName} mantra including:

1. The complete mantra text in ${script} script
2. Proper pronunciation with phonetic guide
3. Word-by-word meaning and translation
4. Spiritual significance and benefits
5. Traditional chanting instructions (rhythm, repetitions)
6. Appropriate occasions and timing for recitation
7. Any specific requirements or preparations

Ensure authenticity and traditional accuracy.`;
    
    const context: AgentContext = {
      language: language as 'en' | 'te' | 'hi',
    };

    return await this.chat(message, context);
  }

  async getKidsGuidance(topic: string, age?: number, language: string = 'en'): Promise<AgentResponse> {
    const message = `Please explain ${topic} in a way that's perfect for children${age ? ` around ${age} years old` : ''}. Make it:

1. Simple and engaging
2. Interactive with activities they can do
3. Respectful of Hindu traditions
4. Fun but educational
5. Include stories or examples they can relate to
6. Suggest family activities or games

Keep the spiritual essence while making it child-friendly and enjoyable.`;
    
    const context: AgentContext = {
      language: language as 'en' | 'te' | 'hi',
      kid_mode: true,
    };

    return await this.chat(message, context);
  }
}