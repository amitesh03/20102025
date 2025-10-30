// Test file for the main TypeScript module
import { greet, User, UserManager } from '../src/index';

describe('TypeScript Examples', () => {
  describe('greet function', () => {
    it('should return a greeting message with the provided name', () => {
      const name = 'TypeScript';
      const expected = `Hello, ${name}!`;
      const result = greet(name);
      expect(result).toBe(expected);
    });

    it('should handle empty string', () => {
      const name = '';
      const expected = 'Hello, !';
      const result = greet(name);
      expect(result).toBe(expected);
    });
  });

  describe('UserManager class', () => {
    let userManager: UserManager;
    const testUser: User = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      isActive: true
    };

    beforeEach(() => {
      userManager = new UserManager();
    });

    it('should start with no users', () => {
      expect(userManager.getUserCount()).toBe(0);
    });

    it('should add a user', () => {
      userManager.addUser(testUser);
      expect(userManager.getUserCount()).toBe(1);
    });

    it('should retrieve a user by ID', () => {
      userManager.addUser(testUser);
      const retrievedUser = userManager.getUserById(1);
      expect(retrievedUser).toEqual(testUser);
    });

    it('should return undefined for non-existent user', () => {
      const retrievedUser = userManager.getUserById(999);
      expect(retrievedUser).toBeUndefined();
    });

    it('should return only active users', () => {
      const activeUser: User = {
        id: 1,
        name: 'Active User',
        email: 'active@example.com',
        isActive: true
      };
      const inactiveUser: User = {
        id: 2,
        name: 'Inactive User',
        email: 'inactive@example.com',
        isActive: false
      };

      userManager.addUser(activeUser);
      userManager.addUser(inactiveUser);

      const activeUsers = userManager.getActiveUsers();
      expect(activeUsers).toHaveLength(1);
      expect(activeUsers[0]).toEqual(activeUser);
    });
  });
});