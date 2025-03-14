import { getLocalData, setLocalData, STORAGE_KEYS } from '@/app/utils/localStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
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

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('localStorage Utility Functions', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('setLocalData', () => {
    it('should store data in localStorage with the correct key', () => {
      const testData = [{ id: '1', name: 'Test Item' }];
      setLocalData(STORAGE_KEYS.PROJECTS, testData);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.PROJECTS,
        JSON.stringify(testData)
      );
    });

    it('should handle complex objects with dates', () => {
      const testData = [
        { 
          id: '1', 
          name: 'Test Item', 
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-02')
        }
      ];
      
      setLocalData(STORAGE_KEYS.PROJECTS, testData);

      // The dates should be converted to ISO strings
      const expectedData = [
        { 
          id: '1', 
          name: 'Test Item', 
          createdAt: new Date('2023-01-01').toISOString(),
          updatedAt: new Date('2023-01-02').toISOString()
        }
      ];
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.PROJECTS,
        JSON.stringify(expectedData)
      );
    });
  });

  describe('getLocalData', () => {
    it('should retrieve data from localStorage with the correct key', () => {
      const testData = [{ id: '1', name: 'Test Item' }];
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(testData));

      const result = getLocalData(STORAGE_KEYS.PROJECTS, null);

      expect(localStorageMock.getItem).toHaveBeenCalledWith(STORAGE_KEYS.PROJECTS);
      expect(result).toEqual(testData);
    });

    it('should return default value if no data is found', () => {
      localStorageMock.getItem.mockReturnValueOnce(null);
      const defaultValue = [];
      
      const result = getLocalData(STORAGE_KEYS.PROJECTS, defaultValue);

      expect(localStorageMock.getItem).toHaveBeenCalledWith(STORAGE_KEYS.PROJECTS);
      expect(result).toBe(defaultValue);
    });

    it('should handle invalid JSON', () => {
      localStorageMock.getItem.mockReturnValueOnce('invalid-json');
      const defaultValue = [];
      
      const result = getLocalData(STORAGE_KEYS.PROJECTS, defaultValue);

      expect(localStorageMock.getItem).toHaveBeenCalledWith(STORAGE_KEYS.PROJECTS);
      expect(result).toBe(defaultValue);
    });
  });
}); 