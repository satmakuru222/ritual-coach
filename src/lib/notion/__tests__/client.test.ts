import { NotionClient } from '../client';
import { RitualProfile } from '@/types';

// Mock the Notion client
jest.mock('@notionhq/client', () => ({
  Client: jest.fn().mockImplementation(() => ({
    pages: {
      create: jest.fn(),
      retrieve: jest.fn(),
    },
    databases: {
      query: jest.fn(),
    },
  })),
}));

describe('NotionClient', () => {
  let notionClient: NotionClient;
  let mockClient: any;

  const mockProfile: RitualProfile = {
    user_id: 'test-user-123',
    tradition: 'andhra_smarta',
    region: 'south',
    language_pref: 'en',
    daily_time: '06:30',
    duration_minutes: 30,
    dietary_rules: 'sattvic',
    kid_mode: false,
  };

  beforeEach(() => {
    // Set up environment variables
    process.env.NOTION_API_KEY = 'test-key';
    process.env.NOTION_DATABASE_RITUAL_PROFILES = 'test-db-profiles';
    process.env.NOTION_DATABASE_RITUALS = 'test-db-rituals';
    process.env.NOTION_DATABASE_FESTIVALS = 'test-db-festivals';
    process.env.NOTION_DATABASE_MANTRAS = 'test-db-mantras';
    process.env.NOTION_DATABASE_PRASADAM = 'test-db-prasadam';
    process.env.NOTION_DATABASE_CHECKLISTS = 'test-db-checklists';

    const { Client } = require('@notionhq/client');
    mockClient = new Client();
    notionClient = new NotionClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRitualProfile', () => {
    it('creates profile with correct rich_text format for user_id', async () => {
      mockClient.pages.create.mockResolvedValue({ id: 'created-page-id' });

      const result = await notionClient.createRitualProfile(mockProfile);

      expect(mockClient.pages.create).toHaveBeenCalledWith({
        parent: { database_id: 'test-db-profiles' },
        properties: {
          user_id: { rich_text: [{ text: { content: 'test-user-123' } }] },
          tradition: { select: { name: 'andhra_smarta' } },
          region: { select: { name: 'south' } },
          language_pref: { select: { name: 'en' } },
          daily_time: { rich_text: [{ text: { content: '06:30' } }] },
          duration_minutes: { number: 30 },
          dietary_rules: { rich_text: [{ text: { content: 'sattvic' } }] },
          kid_mode: { checkbox: false },
        },
      });

      expect(result).toBe('created-page-id');
    });
  });

  describe('getRitualProfile', () => {
    it('queries with correct rich_text filter for user_id', async () => {
      const mockQueryResponse = {
        results: [
          {
            id: 'page-id',
            properties: {
              user_id: { rich_text: [{ text: { content: 'test-user-123' } }] },
              tradition: { select: { name: 'andhra_smarta' } },
              region: { select: { name: 'south' } },
              language_pref: { select: { name: 'en' } },
              daily_time: { rich_text: [{ text: { content: '06:30' } }] },
              duration_minutes: { number: 30 },
              dietary_rules: { rich_text: [{ text: { content: 'sattvic' } }] },
              kid_mode: { checkbox: false },
            },
          },
        ],
      };

      mockClient.databases.query.mockResolvedValue(mockQueryResponse);

      const result = await notionClient.getRitualProfile('test-user-123');

      expect(mockClient.databases.query).toHaveBeenCalledWith({
        database_id: 'test-db-profiles',
        filter: {
          property: 'user_id',
          rich_text: {
            equals: 'test-user-123',
          },
        },
      });

      expect(result).toEqual(mockProfile);
    });

    it('returns null when no profile found', async () => {
      mockClient.databases.query.mockResolvedValue({ results: [] });

      const result = await notionClient.getRitualProfile('nonexistent-user');

      expect(result).toBeNull();
    });
  });

  describe('Constructor validation', () => {
    it('throws error when NOTION_API_KEY is missing', () => {
      delete process.env.NOTION_API_KEY;

      expect(() => {
        new NotionClient();
      }).toThrow('NOTION_API_KEY environment variable is required');
    });

    it('throws error when database IDs are missing', () => {
      delete process.env.NOTION_DATABASE_RITUAL_PROFILES;

      expect(() => {
        new NotionClient();
      }).toThrow('Missing database IDs for: ritualProfiles');
    });
  });
});

export {};