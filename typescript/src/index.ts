// Main entry point for the TypeScript project

/**
 * Example TypeScript function demonstrating type safety
 * @param name - The name to greet
 * @returns A greeting message
 */
export function greet(name: string): string {
  return `Hello, ${name}!`;
}

/**
 * Example interface for a user
 */
export interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

/**
 * Example class for managing users
 */
export class UserManager {
  private users: User[] = [];

  /**
   * Add a new user to the collection
   * @param user - The user to add
   */
  addUser(user: User): void {
    this.users.push(user);
  }

  /**
   * Get a user by ID
   * @param id - The user ID
   * @returns The user if found, otherwise undefined
   */
  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  /**
   * Get all active users
   * @returns Array of active users
   */
  getActiveUsers(): User[] {
    return this.users.filter(user => user.isActive);
  }

  /**
   * Get the total number of users
   * @returns The count of users
   */
  getUserCount(): number {
    return this.users.length;
  }
}

// Example usage
const userManager = new UserManager();
const user1: User = { id: 1, name: 'John Doe', email: 'john@example.com', isActive: true };
const user2: User = { id: 2, name: 'Jane Smith', email: 'jane@example.com', isActive: false };

userManager.addUser(user1);
userManager.addUser(user2);

console.log(greet('TypeScript Developer'));
console.log(`Total users: ${userManager.getUserCount()}`);
console.log(`Active users: ${userManager.getActiveUsers().length}`);