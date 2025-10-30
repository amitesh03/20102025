const redis = require('redis');

// Create Redis client
const client = redis.createClient({
  host: 'localhost',
  port: 6379
});

// Handle connection events
client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.error('Redis Error:', err);
});

async function demonstrateRedisUseCases() {
  try {
    // 1. BASIC STRING OPERATIONS
    console.log('\n=== BASIC STRING OPERATIONS ===');
    
    // Set a simple key-value pair
    await client.set('user:1:name', 'John Doe');
    await client.set('user:1:email', 'john@example.com');
    
    // Get values
    const userName = await client.get('user:1:name');
    const userEmail = await client.get('user:1:email');
    console.log('User:', userName, userEmail);
    
    // Set with expiration (cache example)
    await client.setex('cache:weather:london', 60, 'Sunny, 22°C');
    const weather = await client.get('cache:weather:london');
    console.log('Cached weather:', weather);
    
    // 2. HASH OPERATIONS (Object-like storage)
    console.log('\n=== HASH OPERATIONS ===');
    
    // Store user profile as hash
    await client.hSet('profile:2', {
      'username': 'jane_smith',
      'email': 'jane@example.com',
      'age': '28',
      'city': 'New York'
    });
    
    // Get specific fields
    const username = await client.hGet('profile:2', 'username');
    const age = await client.hGet('profile:2', 'age');
    console.log('Profile:', username, age);
    
    // Get all fields
    const profile = await client.hGetAll('profile:2');
    console.log('Full profile:', profile);
    
    // 3. LIST OPERATIONS (Queues, timelines)
    console.log('\n=== LIST OPERATIONS ===');
    
    // Create a simple queue
    await client.lPush('task:queue', 'Task 1: Process payment');
    await client.lPush('task:queue', 'Task 2: Send email');
    await client.lPush('task:queue', 'Task 3: Update inventory');
    
    // Process tasks from queue
    const task1 = await client.rPop('task:queue');
    const task2 = await client.rPop('task:queue');
    console.log('Processed tasks:', task1, task2);
    
    // User timeline example
    await client.lPush('timeline:user:1', 'Posted a new article');
    await client.lPush('timeline:user:1', 'Liked a photo');
    await client.lPush('timeline:user:1', 'Commented on a post');
    
    // Get recent timeline entries
    const timeline = await client.lRange('timeline:user:1', 0, 4);
    console.log('User timeline:', timeline);
    
    // 4. SET OPERATIONS (Unique collections)
    console.log('\n=== SET OPERATIONS ===');
    
    // Track unique tags for a post
    await client.sAdd('post:1:tags', 'javascript', 'nodejs', 'redis');
    await client.sAdd('post:1:tags', 'javascript'); // Duplicate, won't be added
    
    const tags = await client.sMembers('post:1:tags');
    console.log('Post tags:', tags);
    
    // Track online users
    await client.sAdd('users:online', 'user:1', 'user:2', 'user:3');
    const isOnline = await client.sIsMember('users:online', 'user:2');
    console.log('Is user:2 online?', isOnline);
    
    // 5. SORTED SET OPERATIONS (Leaderboards, rankings)
    console.log('\n=== SORTED SET OPERATIONS ===');
    
    // Game leaderboard
    await client.zAdd('game:leaderboard', [
      { score: 1500, value: 'player:alice' },
      { score: 1200, value: 'player:bob' },
      { score: 1800, value: 'player:charlie' },
      { score: 900, value: 'player:david' }
    ]);
    
    // Get top players
    const topPlayers = await client.zRangeWithScores('game:leaderboard', 0, 2, { REV: true });
    console.log('Top players:', topPlayers);
    
    // Get player rank
    const playerRank = await client.zRevRank('game:leaderboard', 'player:alice');
    console.log('Alice rank:', playerRank + 1);
    
    // 6. PUB/SUB MESSAGING
    console.log('\n=== PUB/SUB MESSAGING ===');
    
    // Create a subscriber client
    const subscriber = redis.createClient();
    await subscriber.connect();
    
    // Subscribe to channels
    await subscriber.subscribe('notifications', 'chat:room:1');
    
    subscriber.on('message', (channel, message) => {
      console.log(`Received message from ${channel}:`, message);
    });
    
    // Publish messages
    await client.publish('notifications', 'New user registered');
    await client.publish('chat:room:1', 'Hello everyone!');
    
    // Wait a bit for messages to be processed
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // 7. CACHING STRATEGIES
    console.log('\n=== CACHING STRATEGIES ===');
    
    // Cache-aside pattern
    async function getUserFromCache(userId) {
      const cacheKey = `user:${userId}`;
      let user = await client.get(cacheKey);
      
      if (!user) {
        // Simulate database fetch
        console.log('Fetching user from database...');
        user = JSON.stringify({
          id: userId,
          name: `User ${userId}`,
          email: `user${userId}@example.com`
        });
        
        // Cache for 1 hour
        await client.setex(cacheKey, 3600, user);
      } else {
        console.log('User found in cache');
      }
      
      return JSON.parse(user);
    }
    
    const cachedUser = await getUserFromCache(123);
    console.log('Cached user:', cachedUser);
    
    // 8. RATE LIMITING
    console.log('\n=== RATE LIMITING ===');
    
    async function isRateLimited(userId, limit = 10, window = 60) {
      const key = `rate_limit:${userId}`;
      const current = await client.incr(key);
      
      if (current === 1) {
        await client.expire(key, window);
      }
      
      return current > limit;
    }
    
    // Test rate limiting
    for (let i = 1; i <= 12; i++) {
      const limited = await isRateLimited('api_user:1', 10, 60);
      console.log(`Request ${i}: ${limited ? 'BLOCKED' : 'ALLOWED'}`);
    }
    
    // 9. DISTRIBUTED LOCKING
    console.log('\n=== DISTRIBUTED LOCKING ===');
    
    async function acquireLock(resource, ttl = 10) {
      const lockKey = `lock:${resource}`;
      const lockValue = Date.now().toString();
      
      const result = await client.set(lockKey, lockValue, {
        NX: true, // Only set if key doesn't exist
        EX: ttl   // Set expiration
      });
      
      return result === 'OK' ? lockValue : null;
    }
    
    async function releaseLock(resource, lockValue) {
      const lockKey = `lock:${resource}`;
      
      // Lua script to ensure only lock owner can release
      const script = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
        else
          return 0
        end
      `;
      
      return await client.eval(script, {
        keys: [lockKey],
        arguments: [lockValue]
      });
    }
    
    // Test distributed locking
    const lock = await acquireLock('resource:important', 10);
    if (lock) {
      console.log('Lock acquired:', lock);
      
      // Simulate work
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const released = await releaseLock('resource:important', lock);
      console.log('Lock released:', released === 1);
    }
    
    // 10. REAL-TIME ANALYTICS
    console.log('\n=== REAL-TIME ANALYTICS ===');
    
    // Track page views
    await client.incr('analytics:page_views:today');
    await client.incr('analytics:page_views:page:home');
    
    // Track unique visitors
    await client.pFAdd('analytics:unique_visitors:today', 'visitor:ip:192.168.1.1');
    await client.pFAdd('analytics:unique_visitors:today', 'visitor:ip:192.168.1.2');
    await client.pFAdd('analytics:unique_visitors:today', 'visitor:ip:192.168.1.1'); // Duplicate
    
    const pageViews = await client.get('analytics:page_views:today');
    const uniqueVisitors = await client.pFCount('analytics:unique_visitors:today');
    
    console.log('Page views today:', pageViews);
    console.log('Unique visitors today:', uniqueVisitors);
    
    console.log('\n=== Redis demonstration completed ===');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close connections
    await client.quit();
    await subscriber.quit();
  }
}

// Run the demonstration
demonstrateRedisUseCases().catch(console.error);