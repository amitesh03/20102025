import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-tomorrow.css';

// Prisma Examples Component
const PrismaExamples = () => {
  const [activeExample, setActiveExample] = useState('setup');
  const [copiedCode, setCopiedCode] = useState('');

  // Example data for demonstration
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Copy code to clipboard
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  // Example 1: Schema Definition
  const SchemaExample = () => (
    <div className="example-section">
      <h3>Prisma Schema Definition</h3>
      <p>Define your database schema in the Prisma schema file:</p>
      <div className="code-container">
        <button 
          className="copy-button" 
          onClick={() => copyToClipboard(schemaCode)}
        >
          {copiedCode === schemaCode ? 'Copied!' : 'Copy'}
        </button>
        <SyntaxHighlighter language="javascript" style={tomorrow}>
          {schemaCode}
        </SyntaxHighlighter>
      </div>
      <p>This schema defines:</p>
      <ul>
        <li>Database connection (PostgreSQL)</li>
        <li>Prisma Client generator</li>
        <li>User model with id, email, name, and posts relation</li>
        <li>Post model with id, title, content, published status, and author relation</li>
      </ul>
    </div>
  );

  // Example 2: Basic CRUD Operations
  const CrudExample = () => (
    <div className="example-section">
      <h3>Basic CRUD Operations</h3>
      <p>Perform create, read, update, and delete operations with Prisma Client:</p>
      <div className="code-container">
        <button 
          className="copy-button" 
          onClick={() => copyToClipboard(crudCode)}
        >
          {copiedCode === crudCode ? 'Copied!' : 'Copy'}
        </button>
        <SyntaxHighlighter language="typescript" style={tomorrow}>
          {crudCode}
        </SyntaxHighlighter>
      </div>
      <div className="demo-section">
        <h4>Interactive Demo</h4>
        <div className="button-group">
          <button onClick={fetchUsers}>Fetch Users</button>
          <button onClick={createUser}>Create User</button>
          <button onClick={updateUser}>Update User</button>
          <button onClick={deleteUser}>Delete User</button>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {users.length > 0 && (
          <div className="results">
            <h4>Users:</h4>
            <ul>
              {users.map(user => (
                <li key={user.id}>{user.name} ({user.email})</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  // Example 3: Relations and Nested Queries
  const RelationsExample = () => (
    <div className="example-section">
      <h3>Relations and Nested Queries</h3>
      <p>Work with related data using Prisma's powerful query API:</p>
      <div className="code-container">
        <button 
          className="copy-button" 
          onClick={() => copyToClipboard(relationsCode)}
        >
          {copiedCode === relationsCode ? 'Copied!' : 'Copy'}
        </button>
        <SyntaxHighlighter language="typescript" style={tomorrow}>
          {relationsCode}
        </SyntaxHighlighter>
      </div>
      <div className="demo-section">
        <h4>Interactive Demo</h4>
        <div className="button-group">
          <button onClick={fetchUsersWithPosts}>Fetch Users with Posts</button>
          <button onClick={createUserWithPosts}>Create User with Posts</button>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {users.length > 0 && (
          <div className="results">
            <h4>Users with their posts:</h4>
            {users.map(user => (
              <div key={user.id} className="user-posts">
                <h5>{user.name} ({user.email})</h5>
                {user.posts && user.posts.length > 0 ? (
                  <ul>
                    {user.posts.map(post => (
                      <li key={post.id}>{post.title} - {post.published ? 'Published' : 'Draft'}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No posts</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Example 4: Filtering and Sorting
  const FilteringExample = () => (
    <div className="example-section">
      <h3>Filtering and Sorting</h3>
      <p>Filter and sort data using Prisma's query options:</p>
      <div className="code-container">
        <button 
          className="copy-button" 
          onClick={() => copyToClipboard(filteringCode)}
        >
          {copiedCode === filteringCode ? 'Copied!' : 'Copy'}
        </button>
        <SyntaxHighlighter language="typescript" style={tomorrow}>
          {filteringCode}
        </SyntaxHighlighter>
      </div>
      <div className="demo-section">
        <h4>Interactive Demo</h4>
        <div className="button-group">
          <button onClick={fetchPublishedPosts}>Fetch Published Posts</button>
          <button onClick={fetchRecentPosts}>Fetch Recent Posts</button>
          <button onClick={searchPosts}>Search Posts</button>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {posts.length > 0 && (
          <div className="results">
            <h4>Posts:</h4>
            <ul>
              {posts.map(post => (
                <li key={post.id}>{post.title} by {post.author?.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  // Example 5: Transactions
  const TransactionsExample = () => (
    <div className="example-section">
      <h3>Transactions</h3>
      <p>Execute multiple operations in a single transaction:</p>
      <div className="code-container">
        <button 
          className="copy-button" 
          onClick={() => copyToClipboard(transactionsCode)}
        >
          {copiedCode === transactionsCode ? 'Copied!' : 'Copy'}
        </button>
        <SyntaxHighlighter language="typescript" style={tomorrow}>
          {transactionsCode}
        </SyntaxHighlighter>
      </div>
      <p>Transactions ensure that all operations succeed or fail together, maintaining data integrity.</p>
    </div>
  );

  // Example 6: Migrations
  const MigrationsExample = () => (
    <div className="example-section">
      <h3>Database Migrations</h3>
      <p>Manage database schema changes with Prisma Migrate:</p>
      <div className="code-container">
        <button 
          className="copy-button" 
          onClick={() => copyToClipboard(migrationsCode)}
        >
          {copiedCode === migrationsCode ? 'Copied!' : 'Copy'}
        </button>
        <SyntaxHighlighter language="bash" style={tomorrow}>
          {migrationsCode}
        </SyntaxHighlighter>
      </div>
      <p>Key migration commands:</p>
      <ul>
        <li><code>init</code>: Initialize Prisma in your project</li>
        <li><code>migrate dev</code>: Create and apply migrations in development</li>
        <li><code>migrate deploy</code>: Apply migrations in production</li>
        <li><code>migrate reset</code>: Reset the database and reapply migrations</li>
        <li><code>generate</code>: Generate Prisma Client based on the schema</li>
      </ul>
    </div>
  );

  // Demo functions (simulated for demonstration)
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulate API call
      setTimeout(() => {
        setUsers([
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const createUser = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulate API call
      setTimeout(() => {
        setUsers(prev => [...prev, { 
          id: Date.now(), 
          name: 'New User', 
          email: 'newuser@example.com' 
        }]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to create user');
      setLoading(false);
    }
  };

  const updateUser = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulate API call
      setTimeout(() => {
        if (users.length > 0) {
          setUsers(prev => prev.map(user => 
            user.id === 1 
              ? { ...user, name: 'Updated Name' } 
              : user
          ));
        }
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to update user');
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulate API call
      setTimeout(() => {
        if (users.length > 0) {
          setUsers(prev => prev.filter(user => user.id !== 1));
        }
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to delete user');
      setLoading(false);
    }
  };

  const fetchUsersWithPosts = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulate API call
      setTimeout(() => {
        setUsers([
          { 
            id: 1, 
            name: 'John Doe', 
            email: 'john@example.com',
            posts: [
              { id: 1, title: 'First Post', published: true },
              { id: 2, title: 'Second Post', published: false }
            ]
          },
          { 
            id: 2, 
            name: 'Jane Smith', 
            email: 'jane@example.com',
            posts: [
              { id: 3, title: 'Jane\'s Post', published: true }
            ]
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to fetch users with posts');
      setLoading(false);
    }
  };

  const createUserWithPosts = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulate API call
      setTimeout(() => {
        setUsers(prev => [...prev, { 
          id: Date.now(), 
          name: 'Author with Posts', 
          email: 'author@example.com',
          posts: [
            { id: Date.now(), title: 'New Post', published: true }
          ]
        }]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to create user with posts');
      setLoading(false);
    }
  };

  const fetchPublishedPosts = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulate API call
      setTimeout(() => {
        setPosts([
          { id: 1, title: 'Published Post 1', author: { name: 'John Doe' } },
          { id: 3, title: 'Jane\'s Post', author: { name: 'Jane Smith' } }
        ]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to fetch published posts');
      setLoading(false);
    }
  };

  const fetchRecentPosts = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulate API call
      setTimeout(() => {
        setPosts([
          { id: 3, title: 'Recent Post', author: { name: 'Jane Smith' } },
          { id: 2, title: 'Another Recent Post', author: { name: 'John Doe' } }
        ]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to fetch recent posts');
      setLoading(false);
    }
  };

  const searchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulate API call
      setTimeout(() => {
        setPosts([
          { id: 1, title: 'Search Result Post', author: { name: 'John Doe' } }
        ]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to search posts');
      setLoading(false);
    }
  };

  // Code examples
  const schemaCode = `// prisma/schema.prisma

// Database connection
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Prisma Client generator
generator client {
  provider = "prisma-client-js"
}

// User model
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

// Post model
model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User?   @relation(fields: [authorId], references: [id])
  authorId  Int?
}`;

  const crudCode = `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new user
const createUser = async () => {
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'John Doe',
    },
  });
  return user;
};

// Read all users
const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

// Read a specific user
const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
};

// Update a user
const updateUser = async (id: number, data: { name?: string; email?: string }) => {
  const user = await prisma.user.update({
    where: { id },
    data,
  });
  return user;
};

// Delete a user
const deleteUser = async (id: number) => {
  const user = await prisma.user.delete({
    where: { id },
  });
  return user;
};`;

  const relationsCode = `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a user with posts
const createUserWithPosts = async () => {
  const user = await prisma.user.create({
    data: {
      email: 'author@example.com',
      name: 'Jane Smith',
      posts: {
        create: [
          { title: 'First Post', content: 'Content of first post' },
          { title: 'Second Post', content: 'Content of second post', published: true },
        ],
      },
    },
    include: {
      posts: true,
    },
  });
  return user;
};

// Get users with their posts
const getUsersWithPosts = async () => {
  const users = await prisma.user.findMany({
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  return users;
};

// Get a post with its author
const getPostWithAuthor = async (postId: number) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
    },
  });
  return post;
};

// Update a post and its author in one query
const updatePostAndAuthor = async (postId: number) => {
  const result = await prisma.post.update({
    where: { id: postId },
    data: {
      published: true,
      author: {
        update: {
          name: 'Updated Author Name',
        },
      },
    },
    include: {
      author: true,
    },
  });
  return result;
};`;

  const filteringCode = `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Filter posts by published status
const getPublishedPosts = async () => {
  const posts = await prisma.post.findMany({
    where: { published: true },
  });
  return posts;
};

// Filter users by email domain
const getUsersByDomain = async (domain: string) => {
  const users = await prisma.user.findMany({
    where: {
      email: {
        endsWith: domain,
      },
    },
  });
  return users;
};

// Complex filtering with OR and AND
const searchPosts = async (query: string) => {
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { content: { contains: query } },
        { author: { name: { contains: query } } },
      ],
      AND: {
        published: true,
      },
    },
    include: {
      author: true,
    },
  });
  return posts;
};

// Sort posts by creation date (newest first)
const getRecentPosts = async (limit: number = 10) => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  return posts;
};

// Pagination
const getPaginatedPosts = async (page: number = 1, pageSize: number = 10) => {
  const skip = (page - 1) * pageSize;
  const posts = await prisma.post.findMany({
    skip,
    take: pageSize,
    orderBy: { createdAt: 'desc' },
  });
  
  const totalCount = await prisma.post.count();
  
  return {
    posts,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
};`;

  const transactionsCode = `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Transfer a post from one user to another
const transferPost = async (postId: number, fromUserId: number, toUserId: number) => {
  const result = await prisma.$transaction(async (tx) => {
    // 1. Decrement post count for the original author
    const fromUser = await tx.user.update({
      where: { id: fromUserId },
      data: {
        posts: {
          delete: { id: postId },
        },
      },
    });
    
    // 2. Increment post count for the new author
    const toUser = await tx.user.update({
      where: { id: toUserId },
      data: {
        posts: {
          connect: { id: postId },
        },
      },
    });
    
    // 3. Update the post's author
    const post = await tx.post.update({
      where: { id: postId },
      data: { authorId: toUserId },
    });
    
    return { fromUser, toUser, post };
  });
  
  return result;
};

// Create a user and multiple posts in a single transaction
const createUserWithMultiplePosts = async (userData: any, postsData: any[]) => {
  const result = await prisma.$transaction(async (tx) => {
    // Create the user
    const user = await tx.user.create({
      data: userData,
    });
    
    // Create all posts
    const posts = await Promise.all(
      postsData.map(postData =>
        tx.post.create({
          data: {
            ...postData,
            authorId: user.id,
          },
        })
      )
    );
    
    return { user, posts };
  });
  
  return result;
};

// Batch operations
const updateMultiplePosts = async (postIds: number[], updateData: any) => {
  const result = await prisma.post.updateMany({
    where: {
      id: { in: postIds },
    },
    data: updateData,
  });
  
  return result;
};`;

  const migrationsCode = `# Initialize Prisma in your project
npx prisma init

# Create a new migration
npx prisma migrate dev --name init

# Apply migrations in production
npx prisma migrate deploy

# Reset the database and reapply all migrations
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate

# View database with Prisma Studio
npx prisma studio

# Check the status of migrations
npx prisma migrate status

# Resolve migration issues
npx prisma migrate resolve`;

  // Prism.js theme
  const tomorrow = {
    plain: {
      color: '#f8f8f2',
      backgroundColor: '#2d2d2d',
    },
    styles: [
      {
        types: ['comment', 'prolog', 'doctype', 'cdata'],
        style: {
          color: '#6272a4',
        },
      },
      {
        types: ['punctuation'],
        style: {
          color: '#f8f8f2',
        },
      },
      {
        types: ['property', 'tag', 'constant', 'symbol', 'deleted'],
        style: {
          color: '#ff79c6',
        },
      },
      {
        types: ['boolean', 'number'],
        style: {
          color: '#bd93f9',
        },
      },
      {
        types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'],
        style: {
          color: '#50fa7b',
        },
      },
      {
        types: ['operator', 'entity', 'url'],
        style: {
          color: '#ff79c6',
        },
      },
      {
        types: ['atrule', 'attr-value', 'keyword'],
        style: {
          color: '#66d9ef',
        },
      },
      {
        types: ['function'],
        style: {
          color: '#50fa7b',
        },
      },
      {
        types: ['regex', 'important', 'variable'],
        style: {
          color: '#f8f8f2',
        },
      },
    ],
  };

  // Render the appropriate example based on activeExample
  const renderExample = () => {
    switch (activeExample) {
      case 'setup':
        return <SchemaExample />;
      case 'crud':
        return <CrudExample />;
      case 'relations':
        return <RelationsExample />;
      case 'filtering':
        return <FilteringExample />;
      case 'transactions':
        return <TransactionsExample />;
      case 'migrations':
        return <MigrationsExample />;
      default:
        return <SchemaExample />;
    }
  };

  return (
    <div className="prisma-examples">
      <h1>Prisma ORM Examples</h1>
      <p>Prisma is a next-generation ORM that makes database access easy with type safety and auto-completion.</p>
      
      <div className="example-navigation">
        <button 
          className={activeExample === 'setup' ? 'active' : ''}
          onClick={() => setActiveExample('setup')}
        >
          Schema Definition
        </button>
        <button 
          className={activeExample === 'crud' ? 'active' : ''}
          onClick={() => setActiveExample('crud')}
        >
          CRUD Operations
        </button>
        <button 
          className={activeExample === 'relations' ? 'active' : ''}
          onClick={() => setActiveExample('relations')}
        >
          Relations
        </button>
        <button 
          className={activeExample === 'filtering' ? 'active' : ''}
          onClick={() => setActiveExample('filtering')}
        >
          Filtering & Sorting
        </button>
        <button 
          className={activeExample === 'transactions' ? 'active' : ''}
          onClick={() => setActiveExample('transactions')}
        >
          Transactions
        </button>
        <button 
          className={activeExample === 'migrations' ? 'active' : ''}
          onClick={() => setActiveExample('migrations')}
        >
          Migrations
        </button>
      </div>
      
      <div className="example-content">
        {renderExample()}
      </div>
      
      <div className="resources">
        <h2>Additional Resources</h2>
        <ul>
          <li><a href="https://www.prisma.io/docs" target="_blank" rel="noopener noreferrer">Official Documentation</a></li>
          <li><a href="https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch" target="_blank" rel="noopener noreferrer">Getting Started</a></li>
          <li><a href="https://www.prisma.io/docs/concepts/components/prisma-client" target="_blank" rel="noopener noreferrer">Prisma Client API</a></li>
          <li><a href="https://www.prisma.io/docs/concepts/components/prisma-migrate" target="_blank" rel="noopener noreferrer">Database Migrations</a></li>
        </ul>
      </div>
      
      <style jsx>{`
        .prisma-examples {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
        }
        
        h1 {
          color: #2d3748;
          margin-bottom: 10px;
        }
        
        h2 {
          color: #4a5568;
          margin-top: 30px;
          margin-bottom: 15px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 10px;
        }
        
        h3 {
          color: #4a5568;
          margin-top: 20px;
          margin-bottom: 10px;
        }
        
        h4 {
          color: #718096;
          margin-top: 15px;
          margin-bottom: 8px;
        }
        
        h5 {
          color: #718096;
          margin-top: 10px;
          margin-bottom: 5px;
        }
        
        p {
          line-height: 1.6;
          margin-bottom: 15px;
        }
        
        ul {
          margin-bottom: 15px;
          padding-left: 20px;
        }
        
        li {
          margin-bottom: 5px;
        }
        
        .example-navigation {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 20px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .example-navigation button {
          background: none;
          border: none;
          padding: 10px 15px;
          cursor: pointer;
          font-weight: 500;
          color: #4a5568;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }
        
        .example-navigation button:hover {
          color: #2d3748;
        }
        
        .example-navigation button.active {
          color: #3182ce;
          border-bottom-color: #3182ce;
        }
        
        .example-content {
          margin-bottom: 30px;
        }
        
        .example-section {
          margin-bottom: 30px;
        }
        
        .code-container {
          position: relative;
          margin-bottom: 20px;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .copy-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #4a5568;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          z-index: 10;
        }
        
        .copy-button:hover {
          background: #2d3748;
        }
        
        .demo-section {
          background: #f7fafc;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }
        
        .button-group {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .button-group button {
          background: #4299e1;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .button-group button:hover {
          background: #3182ce;
        }
        
        .results {
          margin-top: 15px;
        }
        
        .user-posts {
          margin-bottom: 15px;
          padding: 10px;
          background: white;
          border-radius: 4px;
        }
        
        .error {
          color: #e53e3e;
          margin-top: 10px;
        }
        
        .resources {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
        
        .resources ul {
          list-style-type: none;
          padding-left: 0;
        }
        
        .resources li {
          margin-bottom: 8px;
        }
        
        .resources a {
          color: #3182ce;
          text-decoration: none;
        }
        
        .resources a:hover {
          text-decoration: underline;
        }
        
        code {
          background: #edf2f7;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.9em;
        }
      `}</style>
    </div>
  );
};

export default PrismaExamples;