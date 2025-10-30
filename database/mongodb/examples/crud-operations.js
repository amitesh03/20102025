const { MongoClient, ObjectId } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// Database and collection names
const dbName = 'blog';
const collectionName = 'posts';

async function runCrudOperations() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    
    // 1. CREATE - Insert a single document
    console.log('\n=== CREATE ===');
    const newPost = {
      title: 'Getting Started with MongoDB',
      content: 'MongoDB is a NoSQL database that stores data in flexible, JSON-like documents.',
      author: 'John Doe',
      tags: ['mongodb', 'nosql', 'database'],
      published: true,
      createdAt: new Date(),
      views: 0
    };
    
    const insertResult = await collection.insertOne(newPost);
    console.log('Inserted document with _id:', insertResult.insertedId);
    
    // 2. CREATE - Insert multiple documents
    const posts = [
      {
        title: 'Advanced MongoDB Queries',
        content: 'Learn about aggregation pipelines and complex queries in MongoDB.',
        author: 'Jane Smith',
        tags: ['mongodb', 'queries', 'aggregation'],
        published: true,
        createdAt: new Date(),
        views: 25
      },
      {
        title: 'MongoDB Indexing Strategies',
        content: 'Optimize your MongoDB queries with proper indexing.',
        author: 'Bob Johnson',
        tags: ['mongodb', 'indexing', 'performance'],
        published: false,
        createdAt: new Date(),
        views: 10
      }
    ];
    
    const insertManyResult = await collection.insertMany(posts);
    console.log('Inserted documents with _ids:', insertManyResult.insertedIds);
    
    // 3. READ - Find all documents
    console.log('\n=== READ ===');
    const allPosts = await collection.find({}).toArray();
    console.log('All posts:', allPosts);
    
    // 4. READ - Find with query
    const publishedPosts = await collection.find({ published: true }).toArray();
    console.log('Published posts:', publishedPosts);
    
    // 5. READ - Find with projection
    const postTitles = await collection.find(
      { published: true },
      { projection: { title: 1, author: 1, _id: 0 } }
    ).toArray();
    console.log('Post titles and authors:', postTitles);
    
    // 6. READ - Find with sorting and limiting
    const recentPosts = await collection.find({})
      .sort({ createdAt: -1 })
      .limit(2)
      .toArray();
    console.log('Recent posts:', recentPosts);
    
    // 7. READ - Find with regex
    const mongoPosts = await collection.find({
      title: { $regex: /mongodb/i }
    }).toArray();
    console.log('Posts with "mongodb" in title:', mongoPosts);
    
    // 8. UPDATE - Update a single document
    console.log('\n=== UPDATE ===');
    const updateResult = await collection.updateOne(
      { title: 'Getting Started with MongoDB' },
      { 
        $set: { views: 50, updatedAt: new Date() },
        $push: { tags: 'beginner' }
      }
    );
    console.log('Updated document count:', updateResult.modifiedCount);
    
    // 9. UPDATE - Update multiple documents
    const updateManyResult = await collection.updateMany(
      { published: true },
      { $inc: { views: 10 } }
    );
    console.log('Updated documents count:', updateManyResult.modifiedCount);
    
    // 10. UPDATE - Upsert (update or insert)
    const upsertResult = await collection.updateOne(
      { title: 'MongoDB Best Practices' },
      {
        $set: {
          title: 'MongoDB Best Practices',
          content: 'Follow these best practices for optimal MongoDB performance.',
          author: 'Alice Wilson',
          tags: ['mongodb', 'best-practices'],
          published: true,
          createdAt: new Date(),
          views: 0
        }
      },
      { upsert: true }
    );
    console.log('Upserted document _id:', upsertResult.upsertedId);
    
    // 11. DELETE - Delete a single document
    console.log('\n=== DELETE ===');
    const deleteResult = await collection.deleteOne({ published: false });
    console.log('Deleted document count:', deleteResult.deletedCount);
    
    // 12. AGGREGATION - Basic aggregation
    console.log('\n=== AGGREGATION ===');
    const authorStats = await collection.aggregate([
      { $match: { published: true } },
      { $group: {
        _id: '$author',
        totalPosts: { $sum: 1 },
        totalViews: { $sum: '$views' },
        avgViews: { $avg: '$views' }
      }},
      { $sort: { totalViews: -1 } }
    ]).toArray();
    console.log('Author statistics:', authorStats);
    
    // 13. AGGREGATION - Unwind tags
    const tagStats = await collection.aggregate([
      { $unwind: '$tags' },
      { $group: {
        _id: '$tags',
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } }
    ]).toArray();
    console.log('Tag statistics:', tagStats);
    
    // 14. INDEXING - Create indexes
    console.log('\n=== INDEXING ===');
    await collection.createIndex({ title: 'text', content: 'text' });
    console.log('Created text index on title and content');
    
    await collection.createIndex({ author: 1, published: 1 });
    console.log('Created compound index on author and published');
    
    // 15. TEXT SEARCH
    console.log('\n=== TEXT SEARCH ===');
    const searchResults = await collection.find({
      $text: { $search: 'mongodb queries' }
    }).toArray();
    console.log('Text search results:', searchResults);
    
    // 16. TRANSACTIONS
    console.log('\n=== TRANSACTIONS ===');
    const session = client.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Insert a comment
        await database.collection('comments').insertOne({
          postId: insertResult.insertedId,
          content: 'Great article!',
          author: 'Reader',
          createdAt: new Date()
        }, { session });
        
        // Update post comment count
        await collection.updateOne(
          { _id: insertResult.insertedId },
          { $inc: { commentCount: 1 } },
          { session }
        );
        
        console.log('Transaction completed successfully');
      });
    } catch (error) {
      console.error('Transaction failed:', error);
    } finally {
      await session.endSession();
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the CRUD operations
runCrudOperations().catch(console.error);