import { getLocalData, setLocalData, STORAGE_KEYS } from '@/app/utils/localStorage';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => {
      return store[key] || null;
    }),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

// Set up the mock before tests
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('localStorage Utilities', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  describe('setLocalData', () => {
    it('should store data in localStorage with the correct key', () => {
      const testData = { name: 'Test Project', description: 'Test Description' };
      setLocalData(STORAGE_KEYS.PROJECTS, testData);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.PROJECTS,
        JSON.stringify(testData)
      );
    });

    it('should handle complex objects with dates', () => {
      const testDate = new Date('2023-01-01');
      const testData = { 
        name: 'Test Project', 
        createdAt: testDate,
        items: [
          { id: 1, date: new Date('2023-02-01') }
        ]
      };
      
      setLocalData(STORAGE_KEYS.PROJECTS, testData);
      
      // Get the stringified data that was passed to localStorage
      const storedData = JSON.parse(
        (mockLocalStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      
      // Verify date was converted to ISO string format in the JSON
      expect(typeof storedData.createdAt).toBe('string');
      expect(storedData.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(typeof storedData.items[0].date).toBe('string');
      expect(storedData.items[0].date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('getLocalData', () => {
    it('should retrieve data from localStorage with the correct key', () => {
      const testData = { name: 'Test Project', description: 'Test Description' };
      mockLocalStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(testData));
      
      const result = getLocalData(STORAGE_KEYS.PROJECTS, null);
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.PROJECTS);
      expect(result).toEqual(testData);
    });

    it('should return default value when no data is found', () => {
      const defaultValue = { default: true };
      
      const result = getLocalData(STORAGE_KEYS.PROJECTS, defaultValue);
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.PROJECTS);
      expect(result).toBe(defaultValue);
    });

    it('should handle invalid JSON gracefully', () => {
      mockLocalStorage.setItem(STORAGE_KEYS.PROJECTS, 'invalid-json');
      const defaultValue = { default: true };
      
      const result = getLocalData(STORAGE_KEYS.PROJECTS, defaultValue);
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.PROJECTS);
      expect(result).toBe(defaultValue);
    });

    it('should handle date strings in JSON', () => {
      const testDate = new Date('2023-01-01');
      const testData = { 
        name: 'Test Project', 
        createdAt: testDate.toISOString(),
        items: [
          { id: 1, date: new Date('2023-02-01').toISOString() }
        ]
      };
      
      mockLocalStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(testData));
      
      const result = getLocalData(STORAGE_KEYS.PROJECTS, null);
      
      // Verify the data was retrieved correctly
      expect(result).toEqual(testData);
      // Note: The actual implementation doesn't convert ISO strings back to Date objects
      // So we're just checking that the data is retrieved correctly
    });
  });
}); 