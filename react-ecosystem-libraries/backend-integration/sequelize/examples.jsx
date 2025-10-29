import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-tomorrow.css';

// Sequelize Examples Component
const SequelizeExamples = () => {
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

  // Example 1: Model Definition
  const ModelDefinitionExample = () => (
    <div className="example-section">
      <h3>Model Definition</h3>
      <p>Define your database models using Sequelize:</p>
      <div className="code-container">
        <button 
          className="copy-button" 
          onClick={() => copyToClipboard(modelDefinitionCode)}
        >
          {copiedCode === modelDefinitionCode ? 'Copied!' : 'Copy'}
        </button>
        <SyntaxHighlighter language="javascript" style={tomorrow}>
          {modelDefinitionCode}
        </SyntaxHighlighter>
      </div>
      <p>This example shows two ways to define models in Sequelize:</p>
      <ul>
        <li>Using <code>sequelize.define()</code> for inline definition</li>
        <li>Extending the <code>Model</code> class for a more object-oriented approach</li>
      </ul>
    </div>
  );

  // Example 2: Basic CRUD Operations
  const CrudExample = () => (
    <div className="example-section">
      <h3>Basic CRUD Operations</h3>
      <p>Perform create, read, update, and delete operations with Sequelize:</p>
      <div className="code-container">
        <button 
          className="copy-button" 
          onClick={() => copyToClipboard(crudCode)}
        >
          {copiedCode === crudCode ? 'Copied!' : 'Copy'}
        </button>
        <SyntaxHighlighter language="javascript" style={tomorrow}>
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

  // Example 3: Associations
  const AssociationsExample = () => (
    <div className="example-section">
      <h3>Model Associations</h3>
      <p>Define relationships between models using Sequelize associations:</p>
      <div className="code-container">
        <button 
          className="copy-button" 
          onClick={() => copyToClipboard(associationsCode)}
        >
          {copiedCode === associationsCode ? 'Copied!' : 'Copy'}
        </button>
        <SyntaxHighlighter language="javascript" style={tomorrow}>
          {associationsCode}
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

  // Example 4: Querying and Filtering
  const QueryingExample = () => (
    <div className="example-section">
      <h3>Querying and Filtering</h3>
      <p>Query and filter data using Sequelize's powerful query API:</p>
      <div className="code-container">
        <button 
          className="copy-button" 
          onClick={() => copyToClipboard(queryingCode)}
        >
          {copiedCode === queryingCode ? 'Copied!' : 'Copy'}
        </button>
        <SyntaxHighlighter language="javascript" style={tomorrow}>
          {queryingCode}
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
        <SyntaxHighlighter language="javascript" style={tomorrow}>
          {transactionsCode}
        </SyntaxHighlighter>
      </div>
      <p>Transactions ensure that all operations succeed or fail together, maintaining data integrity.</p>
    </div>
  );

  // Example 6: Raw SQL Queries
  const RawQueriesExample = () => (
    <div className="example-section">
      <h3>Raw SQL Queries</h3>
      <p>Execute raw SQL queries when you need more control:</p>
      <div className="code-container">
        <button 
          className="copy-button" 
          onClick={() => copyToClipboard(rawQueriesCode)}
        >
          {copiedCode === rawQueriesCode ? 'Copied!' : 'Copy'}
        </button>
        <SyntaxHighlighter language="javascript" style={tomorrow}>
          {rawQueriesCode}
        </SyntaxHighlighter>
      </div>
      <p>Raw queries are useful for complex operations that might be difficult to express with Sequelize's query API.</p>
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
  const modelDefinitionCode = `const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql' // or 'postgres', 'sqlite', 'mariadb', 'mssql'
});

// Method 1: Using sequelize.define
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  age: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 150
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: true, // adds createdAt, updatedAt
  paranoid: true,   // adds deletedAt for soft deletes
  underscored: true // use snake_case column names
});

// Method 2: Extending Model class
class Product extends Model {}

Product.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  inStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Product'
});

// Sync models to database (creates tables)
await sequelize.sync(); // Creates tables if they don't exist
await sequelize.sync({ force: true }); // Drops and recreates tables
await sequelize.sync({ alter: true }); // Alters tables to match models`;

  const crudCode = `const { Op } = require('sequelize');

// Create a new user
const createUser = async () => {
  const user = await User.create({
    username: 'john_doe',
    email: 'john@example.com',
    age: 30
  });
  return user;
};

// Read all users
const getAllUsers = async () => {
  const users = await User.findAll();
  return users;
};

// Read a specific user
const getUserById = async (id) => {
  const user = await User.findByPk(id);
  return user;
};

// Find users with conditions
const findActiveUsers = async () => {
  const users = await User.findAll({
    where: {
      isActive: true,
      age: {
        [Op.gte]: 18
      }
    }
  });
  return users;
};

// Update a user
const updateUser = async (id, data) => {
  const user = await User.update(data, {
    where: { id }
  });
  return user;
};

// Delete a user
const deleteUser = async (id) => {
  const result = await User.destroy({
    where: { id }
  });
  return result;
};

// Soft delete (if paranoid is enabled)
const softDeleteUser = async (id) => {
  const result = await User.destroy({
    where: { id }
  });
  return result;
};

// Restore soft deleted user
const restoreUser = async (id) => {
  const result = await User.restore({
    where: { id }
  });
  return result;
};`;

  const associationsCode = `// Define associations between models

// One-to-One: User has one Profile
User.hasOne(Profile, {
  foreignKey: 'userId',
  as: 'profile',
  onDelete: 'CASCADE'
});

Profile.belongsTo(User, {
  foreignKey: 'userId'
});

// One-to-Many: User has many Posts
User.hasMany(Post, {
  foreignKey: 'userId',
  as: 'posts',
  onDelete: 'CASCADE'
});

Post.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author'
});

// Many-to-Many: User belongs to many Projects
User.belongsToMany(Project, {
  through: 'UserProjects',
  foreignKey: 'userId',
  otherKey: 'projectId',
  as: 'projects'
});

Project.belongsToMany(User, {
  through: 'UserProjects',
  foreignKey: 'projectId',
  otherKey: 'userId',
  as: 'members'
});

// Create with associations
const createUserWithProfile = async () => {
  const user = await User.create({
    username: 'john_doe',
    email: 'john@example.com',
    profile: {
      bio: 'Software developer',
      avatarUrl: 'https://example.com/avatar.jpg'
    }
  }, {
    include: [Profile]
  });
  return user;
};

// Eager loading
const getUserWithPosts = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [{
      model: Post,
      as: 'posts',
      where: { published: true },
      order: [['createdAt', 'DESC']]
    }]
  });
  return user;
};

// Lazy loading
const getUserAndLoadPosts = async (userId) => {
  const user = await User.findByPk(userId);
  const posts = await user.getPosts();
  return { user, posts };
};

// Create associated record
const createPostForUser = async (userId, postData) => {
  const user = await User.findByPk(userId);
  const post = await user.createPost(postData);
  return post;
};

// Set associations
const setUserProfile = async (userId, profileId) => {
  const user = await User.findByPk(userId);
  const profile = await Profile.findByPk(profileId);
  await user.setProfile(profile);
  return { user, profile };
};`;

  const queryingCode = `const { Op } = require('sequelize');

// Basic filtering
const getActiveUsers = async () => {
  const users = await User.findAll({
    where: {
      isActive: true
    }
  });
  return users;
};

// Complex filtering with operators
const getUsersByAgeRange = async (minAge, maxAge) => {
  const users = await User.findAll({
    where: {
      age: {
        [Op.between]: [minAge, maxAge]
      }
    }
  });
  return users;
};

// Using OR conditions
const searchUsers = async (query) => {
  const users = await User.findAll({
    where: {
      [Op.or]: [
        { username: { [Op.like]: \`%\${query}%\` } },
        { email: { [Op.like]: \`%\${query}%\` } }
      ]
    }
  });
  return users;
};

// Ordering and limiting
const getRecentPosts = async (limit = 10) => {
  const posts = await Post.findAll({
    order: [['createdAt', 'DESC']],
    limit
  });
  return posts;
};

// Pagination
const getPaginatedPosts = async (page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await Post.findAndCountAll({
    offset,
    limit: pageSize,
    order: [['createdAt', 'DESC']]
  });
  
  return {
    posts: rows,
    pagination: {
      page,
      pageSize,
      totalCount: count,
      totalPages: Math.ceil(count / pageSize)
    }
  };
};

// Selecting specific attributes
const getUserSummaries = async () => {
  const users = await User.findAll({
    attributes: ['id', 'username', 'email'],
    where: { isActive: true }
  });
  return users;
};

// Counting records
const countActiveUsers = async () => {
  const count = await User.count({
    where: { isActive: true }
  });
  return count;
};

// Using functions in queries
const getUserStats = async () => {
  const stats = await User.findAll({
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'totalUsers'],
      [sequelize.fn('AVG', sequelize.col('age')), 'averageAge']
    ]
  });
  return stats;
};`;

  const transactionsCode = `// Managed transaction (auto-commit/rollback)
const transferFunds = async (fromAccountId, toAccountId, amount) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      // Decrement from account
      const fromAccount = await Account.findByPk(fromAccountId, { transaction: t });
      await fromAccount.update({
        balance: fromAccount.balance - amount
      }, { transaction: t });
      
      // Increment to account
      const toAccount = await Account.findByPk(toAccountId, { transaction: t });
      await toAccount.update({
        balance: toAccount.balance + amount
      }, { transaction: t });
      
      return { fromAccount, toAccount };
    });
    
    return result;
  } catch (error) {
    // Transaction will be automatically rolled back
    throw error;
  }
};

// Unmanaged transaction (manual commit/rollback)
const transferFundsUnmanaged = async (fromAccountId, toAccountId, amount) => {
  const t = await sequelize.transaction();
  
  try {
    // Decrement from account
    const fromAccount = await Account.findByPk(fromAccountId, { transaction: t });
    await fromAccount.update({
      balance: fromAccount.balance - amount
    }, { transaction: t });
    
    // Increment to account
    const toAccount = await Account.findByPk(toAccountId, { transaction: t });
    await toAccount.update({
      balance: toAccount.balance + amount
    }, { transaction: t });
    
    // Commit the transaction
    await t.commit();
    
    return { fromAccount, toAccount };
  } catch (error) {
    // Rollback the transaction
    await t.rollback();
    throw error;
  }
};

// Create user with posts in a transaction
const createUserWithPostsTransaction = async (userData, postsData) => {
  const result = await sequelize.transaction(async (t) => {
    // Create the user
    const user = await User.create(userData, { transaction: t });
    
    // Create all posts
    const posts = await Promise.all(
      postsData.map(postData =>
        Post.create({
          ...postData,
          userId: user.id
        }, { transaction: t })
      )
    );
    
    return { user, posts };
  });
  
  return result;
};`;

  const rawQueriesCode = `const { QueryTypes } = require('sequelize');

// Basic raw query
const getUsersOlderThan = async (age) => {
  const users = await sequelize.query(
    'SELECT * FROM users WHERE age > ?',
    {
      replacements: [age],
      type: QueryTypes.SELECT
    }
  );
  return users;
};

// Named replacements
const getUsersByStatus = async (status) => {
  const users = await sequelize.query(
    'SELECT * FROM users WHERE status = :status',
    {
      replacements: { status },
      type: QueryTypes.SELECT
    }
  );
  return users;
};

// Bind parameters (PostgreSQL)
const getUsersByAgeRange = async (minAge, maxAge) => {
  const users = await sequelize.query(
    'SELECT * FROM users WHERE age BETWEEN $1 AND $2',
    {
      bind: [minAge, maxAge],
      type: QueryTypes.SELECT
    }
  );
  return users;
};

// Return model instances
const getUserModels = async () => {
  const users = await sequelize.query(
    'SELECT * FROM users',
    {
      model: User,
      mapToModel: true
    }
  );
  return users;
};

// INSERT query
const insertUser = async (userData) => {
  const [results, metadata] = await sequelize.query(
    'INSERT INTO users (username, email, age) VALUES (:username, :email, :age)',
    {
      replacements: userData,
      type: QueryTypes.INSERT
    }
  );
  return { results, metadata };
};

// UPDATE query
const updateUserStatus = async (userId, status) => {
  const [results, metadata] = await sequelize.query(
    'UPDATE users SET status = :status WHERE id = :id',
    {
      replacements: { status, id: userId },
      type: QueryTypes.UPDATE
    }
  );
  return { results, metadata };
};

// DELETE query
const deleteUser = async (userId) => {
  const [results, metadata] = await sequelize.query(
    'DELETE FROM users WHERE id = :id',
    {
      replacements: { id: userId },
      type: QueryTypes.DELETE
    }
  );
  return { results, metadata };
};

// Raw query with transaction
const transferBalance = async (fromId, toId, amount) => {
  const t = await sequelize.transaction();
  
  try {
    await sequelize.query(
      'UPDATE accounts SET balance = balance - :amount WHERE id = :fromId',
      {
        replacements: { amount, fromId },
        type: QueryTypes.UPDATE,
        transaction: t
      }
    );

    await sequelize.query(
      'UPDATE accounts SET balance = balance + :amount WHERE id = :toId',
      {
        replacements: { amount, toId },
        type: QueryTypes.UPDATE,
        transaction: t
      }
    );

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
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

  // Render the appropriate example based on activeExample
  const renderExample = () => {
    switch (activeExample) {
      case 'setup':
        return <ModelDefinitionExample />;
      case 'crud':
        return <CrudExample />;
      case 'associations':
        return <AssociationsExample />;
      case 'querying':
        return <QueryingExample />;
      case 'transactions':
        return <TransactionsExample />;
      case 'raw-queries':
        return <RawQueriesExample />;
      default:
        return <ModelDefinitionExample />;
    }
  };

  return (
    <div className="sequelize-examples">
      <h1>Sequelize ORM Examples</h1>
      <p>Sequelize is a promise-based Node.js ORM for SQL databases like PostgreSQL, MySQL, MariaDB, SQLite, and MSSQL.</p>
      
      <div className="example-navigation">
        <button 
          className={activeExample === 'setup' ? 'active' : ''}
          onClick={() => setActiveExample('setup')}
        >
          Model Definition
        </button>
        <button 
          className={activeExample === 'crud' ? 'active' : ''}
          onClick={() => setActiveExample('crud')}
        >
          CRUD Operations
        </button>
        <button 
          className={activeExample === 'associations' ? 'active' : ''}
          onClick={() => setActiveExample('associations')}
        >
          Associations
        </button>
        <button 
          className={activeExample === 'querying' ? 'active' : ''}
          onClick={() => setActiveExample('querying')}
        >
          Querying & Filtering
        </button>
        <button 
          className={activeExample === 'transactions' ? 'active' : ''}
          onClick={() => setActiveExample('transactions')}
        >
          Transactions
        </button>
        <button 
          className={activeExample === 'raw-queries' ? 'active' : ''}
          onClick={() => setActiveExample('raw-queries')}
        >
          Raw SQL Queries
        </button>
      </div>
      
      <div className="example-content">
        {renderExample()}
      </div>
      
      <div className="resources">
        <h2>Additional Resources</h2>
        <ul>
          <li><a href="https://sequelize.org/docs/v6/" target="_blank" rel="noopener noreferrer">Official Documentation</a></li>
          <li><a href="https://sequelize.org/docs/v6/getting-started/" target="_blank" rel="noopener noreferrer">Getting Started</a></li>
          <li><a href="https://sequelize.org/docs/v6/core-concepts/model-basics/" target="_blank" rel="noopener noreferrer">Model Basics</a></li>
          <li><a href="https://sequelize.org/docs/v6/core-concepts/assocs/" target="_blank" rel="noopener noreferrer">Associations</a></li>
        </ul>
      </div>
      
      <style jsx>{`
        .sequelize-examples {
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

export default SequelizeExamples;