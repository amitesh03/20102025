import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-tomorrow.css';

// TypeORM Examples Component
const TypeORMExamples = () => {
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

  // Example 1: Entity Definition
  const EntityDefinitionExample = () => (
    <div className="example-section">
      <h3>Entity Definition</h3>
      <p>Define your database entities using TypeORM decorators:</p>
      <div className="code-container">
        <button 
          className="copy-button" 
          onClick={() => copyToClipboard(entityDefinitionCode)}
        >
          {copiedCode === entityDefinitionCode ? 'Copied!' : 'Copy'}
        </button>
        <SyntaxHighlighter language="typescript" style={tomorrow}>
          {entityDefinitionCode}
        </SyntaxHighlighter>
      </div>
      <p>This example shows how to define entities with TypeORM:</p>
      <ul>
        <li>Using <code>@Entity</code> decorator to mark a class as an entity</li>
        <li>Defining primary keys with <code>@PrimaryGeneratedColumn</code></li>
        <li>Adding columns with <code>@Column</code> decorator</li>
        <li>Setting up relationships with <code>@OneToMany</code> and <code>@ManyToOne</code></li>
        <li>Adding timestamps with <code>@CreateDateColumn</code> and <code>@UpdateDateColumn</code></li>
      </ul>
    </div>
  );

  // Example 2: DataSource Configuration
  const DataSourceExample = () => (
    <div className="example-section">
      <h3>DataSource Configuration</h3>
      <p>Configure and initialize the database connection:</p>
      <div className="code-container">
        <button 
          className="copy-button" 
          onClick={() => copyToClipboard(dataSourceCode)}
        >
          {copiedCode === dataSourceCode ? 'Copied!' : 'Copy'}
        </button>
        <SyntaxHighlighter language="typescript" style={tomorrow}>
          {dataSourceCode}
        </SyntaxHighlighter>
      </div>
      <p>The DataSource object is central to TypeORM, managing database connections and entity metadata.</p>
    </div>
  );

  // Example 3: Repository Operations
  const RepositoryExample = () => (
    <div className="example-section">
      <h3>Repository Operations</h3>
      <p>Perform CRUD operations using TypeORM repositories:</p>
      <div className="code-container">
        <button 
          className="copy-button" 
          onClick={() => copyToClipboard(repositoryCode)}
        >
          {copiedCode === repositoryCode ? 'Copied!' : 'Copy'}
        </button>
        <SyntaxHighlighter language="typescript" style={tomorrow}>
          {repositoryCode}
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

  // Example 4: Relations and Eager Loading
  const RelationsExample = () => (
    <div className="example-section">
      <h3>Relations and Eager Loading</h3>
      <p>Work with related entities using TypeORM's relation system:</p>
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

  // Example 5: Query Builder
  const QueryBuilderExample = () => (
    <div className="example-section">
      <h3>Query Builder</h3>
      <p>Build complex queries using TypeORM's QueryBuilder:</p>
      <div className="code-container">
        <button 
          className="copy-button" 
          onClick={() => copyToClipboard(queryBuilderCode)}
        >
          {copiedCode === queryBuilderCode ? 'Copied!' : 'Copy'}
        </button>
        <SyntaxHighlighter language="typescript" style={tomorrow}>
          {queryBuilderCode}
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

  // Example 6: Transactions
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
  const entityDefinitionCode = `import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToMany,
  ManyToOne
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  age: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  content: string;

  @Column({ default: false })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.posts)
  author: User;
}`;

  const dataSourceCode = `import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Post } from "./entity/Post";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "typeorm_example",
  synchronize: true, // Auto creates schema - don't use in production
  logging: true,
  entities: [User, Post],
  migrations: ["src/migration/*.ts"],
  subscribers: ["src/subscriber/*.ts"],
});

// Initialize the connection
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });`;

  const repositoryCode = `import { AppDataSource } from "./data-source";
import { User } from "./entity/User";

// Get repository for User entity
const userRepository = AppDataSource.getRepository(User);

// CREATE - with entity instance
const createUser = async () => {
  const user = new User();
  user.firstName = "John";
  user.lastName = "Doe";
  user.email = "john@example.com";
  user.age = 30;
  
  return await userRepository.save(user);
};

// CREATE - with plain object
const createUserFromObject = async () => {
  const userData = {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    age: 28
  };
  
  const user = userRepository.create(userData);
  return await userRepository.save(user);
};

// READ - find all
const getAllUsers = async () => {
  return await userRepository.find();
};

// READ - find with conditions
const getAdultUsers = async () => {
  return await userRepository.findBy({
    age: 18
  });
};

// READ - find one by ID
const getUserById = async (id: number) => {
  return await userRepository.findOneBy({ id });
};

// READ - find one with multiple conditions
const getUserByEmail = async (email: string) => {
  return await userRepository.findOneBy({ 
    email,
    isActive: true 
  });
};

// UPDATE
const updateUser = async (id: number, updates: Partial<User>) => {
  await userRepository.update(id, updates);
  return await userRepository.findOneBy({ id });
};

// DELETE
const deleteUser = async (id: number) => {
  return await userRepository.delete(id);
};

// SOFT DELETE (requires @DeleteDateColumn)
const softDeleteUser = async (id: number) => {
  return await userRepository.softDelete(id);
};

// RESTORE soft deleted
const restoreUser = async (id: number) => {
  return await userRepository.restore(id);
};`;

  const relationsCode = `import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { Post } from "./entity/Post";

const userRepository = AppDataSource.getRepository(User);
const postRepository = AppDataSource.getRepository(Post);

// Create user with posts
const createUserWithPosts = async () => {
  const user = new User();
  user.firstName = "John";
  user.lastName = "Doe";
  user.email = "john@example.com";
  
  const post1 = new Post();
  post1.title = "First Post";
  post1.content = "Content of first post";
  post1.published = true;
  
  const post2 = new Post();
  post2.title = "Second Post";
  post2.content = "Content of second post";
  post2.published = false;
  
  user.posts = [post1, post2];
  
  await userRepository.save(user);
  return user;
};

// Eager loading with relations
const getUsersWithPosts = async () => {
  return await userRepository.find({
    relations: {
      posts: true
    }
  });
};

// Eager loading with conditions on relations
const getUsersWithPublishedPosts = async () => {
  return await userRepository.find({
    relations: {
      posts: {
        where: {
          published: true
        }
      }
    }
  });
};

// Eager loading with nested relations
const getPostsWithAuthors = async () => {
  return await postRepository.find({
    relations: {
      author: true
    }
  });
};

// Lazy loading
const getUserAndLoadPosts = async (userId: number) => {
  const user = await userRepository.findOneBy({ id: userId });
  if (user) {
    const posts = await postRepository.findBy({
      author: {
        id: user.id
      }
    });
    return { user, posts };
  }
  return null;
};

// Create associated record
const createPostForUser = async (userId: number, postData: Partial<Post>) => {
  const user = await userRepository.findOneBy({ id: userId });
  if (user) {
    const post = postRepository.create(postData);
    post.author = user;
    return await postRepository.save(post);
  }
  return null;
};`;

  const queryBuilderCode = `import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { Post } from "./entity/Post";
import { MoreThan, LessThan, Like } from "typeorm";

const userRepository = AppDataSource.getRepository(User);
const postRepository = AppDataSource.getRepository(Post);

// Basic query builder
const getActiveUsers = async () => {
  return await userRepository
    .createQueryBuilder("user")
    .where("user.isActive = :isActive", { isActive: true })
    .orderBy("user.createdAt", "DESC")
    .getMany();
};

// Complex query with joins
const getUsersWithPostCount = async () => {
  return await userRepository
    .createQueryBuilder("user")
    .leftJoin("user.posts", "post")
    .select("user.id", "userId")
    .addSelect("user.firstName", "firstName")
    .addSelect("user.lastName", "lastName")
    .addSelect("COUNT(post.id)", "postCount")
    .groupBy("user.id")
    .getRawMany();
};

// Query with conditions
const getRecentPublishedPosts = async () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  return await postRepository
    .createQueryBuilder("post")
    .leftJoin("post.author", "author")
    .select(["post.id", "post.title", "post.createdAt"])
    .addSelect(["author.firstName", "author.lastName"])
    .where("post.published = :published", { published: true })
    .andWhere("post.createdAt > :date", { date: oneWeekAgo })
    .orderBy("post.createdAt", "DESC")
    .limit(10)
    .getMany();
};

// Search functionality
const searchPosts = async (query: string) => {
  return await postRepository
    .createQueryBuilder("post")
    .leftJoin("post.author", "author")
    .where("post.title LIKE :query", { query: \`%\${query}%\` })
    .orWhere("post.content LIKE :query", { query: \`%\${query}%\` })
    .orWhere("author.firstName LIKE :query", { query: \`%\${query}%\` })
    .orWhere("author.lastName LIKE :query", { query: \`%\${query}%\` })
    .orderBy("post.createdAt", "DESC")
    .getMany();
};

// Pagination
const getPaginatedPosts = async (page: number = 1, pageSize: number = 10) => {
  const skip = (page - 1) * pageSize;
  
  const [posts, total] = await postRepository
    .createQueryBuilder("post")
    .leftJoinAndSelect("post.author", "author")
    .where("post.published = :published", { published: true })
    .orderBy("post.createdAt", "DESC")
    .skip(skip)
    .take(pageSize)
    .getManyAndCount();
  
  return {
    posts,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  };
};`;

  const transactionsCode = `import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { Post } from "./entity/Post";

// Simple transaction
const transferFunds = async (fromUserId: number, toUserId: number, amount: number) => {
  await AppDataSource.transaction(async transactionalEntityManager => {
    const fromUser = await transactionalEntityManager.findOneBy(User, { id: fromUserId });
    const toUser = await transactionalEntityManager.findOneBy(User, { id: toUserId });
    
    if (!fromUser || !toUser) {
      throw new Error("User not found");
    }
    
    // Update balances
    fromUser.balance -= amount;
    toUser.balance += amount;
    
    await transactionalEntityManager.save(fromUser);
    await transactionalEntityManager.save(toUser);
  });
};

// Transaction with error handling
const createUserWithPostsTransaction = async (userData: Partial<User>, postsData: Partial<Post>[]) => {
  try {
    const result = await AppDataSource.transaction(async transactionalEntityManager => {
      // Create user
      const user = transactionalEntityManager.create(User, userData);
      await transactionalEntityManager.save(user);
      
      // Create posts
      const posts = postsData.map(postData => {
        const post = transactionalEntityManager.create(Post, postData);
        post.author = user;
        return post;
      });
      
      await transactionalEntityManager.save(posts);
      
      return { user, posts };
    });
    
    return result;
  } catch (error) {
    console.error("Transaction failed and was rolled back:", error);
    throw error;
  }
};

// Nested transactions
const complexOperation = async () => {
  await AppDataSource.transaction(async outerManager => {
    // First operation
    const user = outerManager.create(User, {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com"
    });
    await outerManager.save(user);
    
    // Nested transaction
    await outerManager.transaction(async innerManager => {
      // Create posts in nested transaction
      const post1 = innerManager.create(Post, {
        title: "First Post",
        content: "Content of first post",
        published: true,
        author: user
      });
      
      const post2 = innerManager.create(Post, {
        title: "Second Post",
        content: "Content of second post",
        published: false,
        author: user
      });
      
      await innerManager.save([post1, post2]);
    });
  });
};`;

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

  // Render appropriate example based on activeExample
  const renderExample = () => {
    switch (activeExample) {
      case 'entities':
        return <EntityDefinitionExample />;
      case 'datasource':
        return <DataSourceExample />;
      case 'repository':
        return <RepositoryExample />;
      case 'relations':
        return <RelationsExample />;
      case 'querybuilder':
        return <QueryBuilderExample />;
      case 'transactions':
        return <TransactionsExample />;
      default:
        return <EntityDefinitionExample />;
    }
  };

  return (
    <div className="typeorm-examples">
      <h1>TypeORM Examples</h1>
      <p>TypeORM is an ORM for TypeScript and JavaScript that supports MySQL, PostgreSQL, MariaDB, SQLite, MS SQL Server, Oracle, and more.</p>
      
      <div className="example-navigation">
        <button 
          className={activeExample === 'entities' ? 'active' : ''}
          onClick={() => setActiveExample('entities')}
        >
          Entity Definition
        </button>
        <button 
          className={activeExample === 'datasource' ? 'active' : ''}
          onClick={() => setActiveExample('datasource')}
        >
          DataSource
        </button>
        <button 
          className={activeExample === 'repository' ? 'active' : ''}
          onClick={() => setActiveExample('repository')}
        >
          Repository Operations
        </button>
        <button 
          className={activeExample === 'relations' ? 'active' : ''}
          onClick={() => setActiveExample('relations')}
        >
          Relations
        </button>
        <button 
          className={activeExample === 'querybuilder' ? 'active' : ''}
          onClick={() => setActiveExample('querybuilder')}
        >
          Query Builder
        </button>
        <button 
          className={activeExample === 'transactions' ? 'active' : ''}
          onClick={() => setActiveExample('transactions')}
        >
          Transactions
        </button>
      </div>
      
      <div className="example-content">
        {renderExample()}
      </div>
      
      <div className="resources">
        <h2>Additional Resources</h2>
        <ul>
          <li><a href="https://typeorm.io/" target="_blank" rel="noopener noreferrer">Official Documentation</a></li>
          <li><a href="https://typeorm.io/#/getting-started" target="_blank" rel="noopener noreferrer">Getting Started</a></li>
          <li><a href="https://typeorm.io/#/entities" target="_blank" rel="noopener noreferrer">Entities</a></li>
          <li><a href="https://typeorm.io/#/repository-api" target="_blank" rel="noopener noreferrer">Repository API</a></li>
        </ul>
      </div>
      
      <style jsx>{`
        .typeorm-examples {
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

export default TypeORMExamples;