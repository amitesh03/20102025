import React, { useState } from 'react';
import { CodeBlock, InteractiveDemo, NavigationTabs } from '../../components';

const KnexExamples = () => {
  const [activeTab, setActiveTab] = useState('setup');

  const tabs = [
    { id: 'setup', label: 'Setup' },
    { id: 'basic-queries', label: 'Basic Queries' },
    { id: 'advanced-queries', label: 'Advanced Queries' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'schema', label: 'Schema Builder' },
    { id: 'json', label: 'JSON Operations' },
    { id: 'raw-sql', label: 'Raw SQL' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'setup':
        return (
          <div>
            <h3>Knex.js Setup</h3>
            <p>Knex.js is a SQL query builder for Node.js. Here's how to set it up:</p>
            
            <CodeBlock
              title="Basic Knex Setup"
              language="javascript"
              code={`// Install Knex and database driver
// npm install knex pg  // For PostgreSQL
// npm install knex mysql2  // For MySQL
// npm install knex sqlite3  // For SQLite

// Initialize Knex
const knex = require('knex')({
  client: 'pg', // or 'mysql', 'sqlite3', etc.
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'your_username',
    password: 'your_password',
    database: 'your_database'
  },
  pool: {
    min: 2,
    max: 10
  }
});

// Test the connection
knex.raw('SELECT 1')
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });`}
            />
            
            <CodeBlock
              title="Environment-based Configuration"
              language="javascript"
              code={`// knexfile.js
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
    useNullAsDefault: true
  },
  
  staging: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds/production'
    }
  }
};

// Usage
const knex = require('knex');
const knexInstance = knex(require('./knexfile')[process.env.NODE_ENV || 'development']);`}
            />
          </div>
        );
        
      case 'basic-queries':
        return (
          <div>
            <h3>Basic Queries</h3>
            <p>Fundamental query operations with Knex:</p>
            
            <CodeBlock
              title="SELECT Queries"
              language="javascript"
              code={`// Basic SELECT
knex('users').select('*');
// SELECT * FROM users

// SELECT with specific columns
knex('users').select('id', 'name', 'email');
// SELECT id, name, email FROM users

// SELECT with alias
knex('users').select('name as user_name');
// SELECT name as user_name FROM users

// WHERE clause
knex('users').where('id', 1);
// SELECT * FROM users WHERE id = 1

// WHERE with operators
knex('users').where('votes', '>', 100);
// SELECT * FROM users WHERE votes > 100

// WHERE with LIKE
knex('users').where('name', 'like', '%john%');
// SELECT * FROM users WHERE name LIKE '%john%'

// Multiple WHERE conditions
knex('users')
  .where('status', 'active')
  .andWhere('votes', '>', 50);
// SELECT * FROM users WHERE status = 'active' AND votes > 50

// WHERE IN
knex('users').whereIn('id', [1, 2, 3]);
// SELECT * FROM users WHERE id IN (1, 2, 3)

// WHERE NOT IN
knex('users').whereNotIn('id', [1, 2, 3]);
// SELECT * FROM users WHERE id NOT IN (1, 2, 3)

// WHERE NULL
knex('users').whereNull('deleted_at');
// SELECT * FROM users WHERE deleted_at IS NULL

// WHERE NOT NULL
knex('users').whereNotNull('email');
// SELECT * FROM users WHERE email IS NOT NULL`}
            />
            
            <CodeBlock
              title="INSERT, UPDATE, DELETE"
              language="javascript"
              code={`// INSERT single record
knex('users').insert({
  name: 'John Doe',
  email: 'john@example.com',
  created_at: new Date()
});
// INSERT INTO users (name, email, created_at) VALUES ('John Doe', 'john@example.com', '2023-01-01...')

// INSERT multiple records
knex('users').insert([
  { name: 'John Doe', email: 'john@example.com' },
  { name: 'Jane Smith', email: 'jane@example.com' }
]);

// UPDATE
knex('users')
  .where('id', 1)
  .update({
    name: 'John Updated',
    updated_at: new Date()
  });
// UPDATE users SET name = 'John Updated', updated_at = '2023-01-01...' WHERE id = 1

// DELETE
knex('users').where('id', 1).del();
// DELETE FROM users WHERE id = 1

// TRUNCATE
knex('users').truncate();
// TRUNCATE TABLE users`}
            />
            
            <CodeBlock
              title="JOIN Operations"
              language="javascript"
              code={`// INNER JOIN
knex('users')
  .join('posts', 'users.id', '=', 'posts.user_id')
  .select('users.name', 'posts.title');
// SELECT users.name, posts.title FROM users INNER JOIN posts ON users.id = posts.user_id

// LEFT JOIN
knex('users')
  .leftJoin('posts', 'users.id', '=', 'posts.user_id')
  .select('users.*', 'posts.title as post_title');

// Multiple JOINs
knex('users')
  .join('posts', 'users.id', '=', 'posts.user_id')
  .join('comments', 'posts.id', '=', 'comments.post_id')
  .select('users.name', 'posts.title', 'comments.content');

// JOIN with callback for complex conditions
knex('users')
  .join('posts', function() {
    this.on('users.id', '=', 'posts.user_id')
        .andOn('posts.status', '=', 'published');
  })
  .select('users.name', 'posts.title');`}
            />
            
            <CodeBlock
              title="Ordering, Limiting, and Grouping"
              language="javascript"
              code={`// ORDER BY
knex('users').orderBy('name', 'asc');
// SELECT * FROM users ORDER BY name ASC

// Multiple ORDER BY
knex('users')
  .orderBy('name', 'asc')
  .orderBy('created_at', 'desc');

// LIMIT
knex('users').limit(10);
// SELECT * FROM users LIMIT 10

// OFFSET
knex('users').offset(20);
// SELECT * FROM users OFFSET 20

// LIMIT with OFFSET (pagination)
knex('users').limit(10).offset(20);
// SELECT * FROM users LIMIT 10 OFFSET 20

// GROUP BY
knex('posts')
  .select('user_id')
  .count('* as post_count')
  .groupBy('user_id');
// SELECT user_id, COUNT(*) as post_count FROM posts GROUP BY user_id

// HAVING
knex('posts')
  .select('user_id')
  .count('* as post_count')
  .groupBy('user_id')
  .having('post_count', '>', 5);
// SELECT user_id, COUNT(*) as post_count FROM posts GROUP BY user_id HAVING post_count > 5`}
            />
          </div>
        );
        
      case 'advanced-queries':
        return (
          <div>
            <h3>Advanced Queries</h3>
            <p>Complex query operations with Knex:</p>
            
            <CodeBlock
              title="Subqueries"
              language="javascript"
              code={`// Subquery in WHERE clause
const subquery = knex('posts')
  .where('user_id', 1)
  .select('id');

knex('comments')
  .whereIn('post_id', subquery);
// SELECT * FROM comments WHERE post_id IN (SELECT id FROM posts WHERE user_id = 1)

// Subquery in FROM clause
const userPosts = knex('posts')
  .where('status', 'published')
  .as('user_posts');

knex.select('*').from(userPosts);
// SELECT * FROM (SELECT * FROM posts WHERE status = 'published') AS user_posts

// Subquery with callback
knex('users').whereIn('account_id', function() {
  this.select('id').from('accounts');
});
// SELECT * FROM users WHERE account_id IN (SELECT id FROM accounts)

// EXISTS subquery
knex('users').whereExists(function() {
  this.select('*')
    .from('posts')
    .whereRaw('users.id = posts.user_id');
});
// SELECT * FROM users WHERE EXISTS (SELECT * FROM posts WHERE users.id = posts.user_id)`}
            />
            
            <CodeBlock
              title="UNION, INTERSECT, EXCEPT"
              language="javascript"
              code={`// UNION
knex('users')
  .select('name', 'email')
  .where('status', 'active')
  .union(function() {
    this.select('name', 'email')
      .from('users')
      .where('status', 'pending');
  });

// UNION ALL
knex('users')
  .select('name', 'email')
  .where('status', 'active')
  .unionAll(function() {
    this.select('name', 'email')
      .from('users')
      .where('status', 'pending');
  });

// INTERSECT (PostgreSQL, SQLite)
knex('users')
  .select('name')
  .whereNull('last_name')
  .intersect(function() {
    this.select('name')
      .from('users')
      .whereNull('first_name');
  });

// EXCEPT (PostgreSQL, SQLite)
knex('users')
  .select('*')
  .whereNull('last_name')
  .except(function() {
    this.select('*')
      .from('users')
      .whereNull('first_name');
  });`}
            />
            
            <CodeBlock
              title="Complex WHERE Conditions"
              language="javascript"
              code={`// Using parentheses with AND/OR
knex('users')
  .where('status', 'active')
  .andWhere(function() {
    this.where('first_name', 'like', '%john%')
        .orWhere('last_name', 'like', '%john%');
  });
// SELECT * FROM users WHERE status = 'active' AND (first_name LIKE '%john%' OR last_name LIKE '%john%')

// Nested OR conditions
knex('users')
  .where(function() {
    this.where('status', 'active')
        .orWhere('role', 'admin');
  })
  .andWhere('verified', true);
// SELECT * FROM users WHERE (status = 'active' OR role = 'admin') AND verified = true

// WHERE with raw SQL
knex('users').whereRaw('LOWER(name) = ?', ['john doe']);
// SELECT * FROM users WHERE LOWER(name) = 'john doe'

// Complex conditions with operators
knex('users')
  .where('age', '>=', 18)
  .andWhere('age', '<=', 65)
  .andWhereNot('status', 'banned');`}
            />
            
            <CodeBlock
              title="WITH Clauses (CTE)"
              language="javascript"
              code={`// Basic WITH clause
knex
  .with(
    'active_users',
    knex('users').where('status', 'active')
  )
  .select('*')
  .from('active_users');
// WITH active_users AS (SELECT * FROM users WHERE status = 'active') SELECT * FROM active_users

// WITH with specific columns
knex
  .with(
    'user_stats',
    ['user_id', 'post_count'],
    knex('posts')
      .select('user_id')
      .count('* as post_count')
      .groupBy('user_id')
  )
  .select('*')
  .from('user_stats');

// Materialized WITH (PostgreSQL)
knex
  .withMaterialized(
    'user_posts',
    knex('posts').where('published', true)
  )
  .select('*')
  .from('user_posts');

// Non-materialized WITH (PostgreSQL)
knex
  .withNotMaterialized(
    'user_posts',
    knex('posts').where('published', true)
  )
  .select('*')
  .from('user_posts');`}
            />
          </div>
        );
        
      case 'transactions':
        return (
          <div>
            <h3>Transactions</h3>
            <p>Managing database transactions with Knex:</p>
            
            <CodeBlock
              title="Basic Transaction"
              language="javascript"
              code={`// Simple transaction
knex.transaction(function(trx) {
  // All queries within this function run in the same transaction
  return knex('accounts')
    .transacting(trx)
    .insert({ name: 'Account 1' })
    .then(function(resp) {
      const id = resp[0];
      return knex('transactions')
        .transacting(trx)
        .insert({ account_id: id, amount: 100 });
    });
})
.then(function() {
  console.log('Transaction complete');
})
.catch(function(err) {
  console.error('Transaction failed:', err);
});`}
            />
            
            <CodeBlock
              title="Transaction with Manual Commit/Rollback"
              language="javascript"
              code={`// Transaction with manual control
knex.transaction(function(trx) {
  return knex('books')
    .transacting(trx)
    .insert({ title: 'Old Books' })
    .then(function(resp) {
      const id = resp[0];
      return someExternalMethod(id, trx);
    })
    .then(trx.commit)
    .catch(trx.rollback);
})
.then(function(resp) {
  console.log('Transaction complete.');
})
.catch(function(err) {
  console.error(err);
});`}
            />
            
            <CodeBlock
              title="Async/Await Transaction"
              language="javascript"
              code={`// Using async/await with transactions
async function transferFunds(fromAccountId, toAccountId, amount) {
  try {
    await knex.transaction(async (trx) => {
      // Debit from source account
      await knex('accounts')
        .transacting(trx)
        .where('id', fromAccountId)
        .decrement('balance', amount);
      
      // Credit to destination account
      await knex('accounts')
        .transacting(trx)
        .where('id', toAccountId)
        .increment('balance', amount);
      
      // Record the transaction
      await knex('transactions')
        .transacting(trx)
        .insert({
          from_account_id: fromAccountId,
          to_account_id: toAccountId,
          amount: amount,
          timestamp: new Date()
        });
    });
    
    console.log('Transfer completed successfully');
  } catch (error) {
    console.error('Transfer failed:', error);
    throw error;
  }
}

// Usage
transferFunds(1, 2, 100);`}
            />
            
            <CodeBlock
              title="Transaction with Savepoints"
              language="javascript"
              code={`// Transaction with savepoints (PostgreSQL, MySQL, SQLite)
knex.transaction(async (trx) => {
  try {
    // First operation
    await knex('users').transacting(trx).insert({ name: 'User 1' });
    
    // Create a savepoint
    await trx.savepoint('sp1');
    
    try {
      // Operation that might fail
      await knex('users').transacting(trx).insert({ name: 'User 2' });
      // Some other operation that might fail
      await someRiskyOperation();
    } catch (error) {
      // Rollback to savepoint if something fails
      await trx.rollbackTo('sp1');
      console.log('Rolled back to savepoint sp1');
    }
    
    // Continue with other operations
    await knex('users').transacting(trx).insert({ name: 'User 3' });
    
    // Commit the transaction
    await trx.commit();
  } catch (error) {
    // Rollback the entire transaction
    await trx.rollback();
    throw error;
  }
});`}
            />
          </div>
        );
        
      case 'schema':
        return (
          <div>
            <h3>Schema Builder</h3>
            <p>Creating and modifying database schemas with Knex:</p>
            
            <CodeBlock
              title="Create Tables"
              language="javascript"
              code={`// Create a new table
knex.schema.createTable('users', function(table) {
  table.increments('id').primary();
  table.string('name', 100).notNullable();
  table.string('email', 255).unique().notNullable();
  table.string('password', 255).notNullable();
  table.timestamps(true, true); // adds created_at and updated_at
});

// Create table with various column types
knex.schema.createTable('posts', function(table) {
  table.increments('id').primary();
  table.string('title', 255).notNullable();
  table.text('content');
  table.integer('user_id').unsigned().notNullable();
  table.enum('status', ['draft', 'published', 'archived']).defaultTo('draft');
  table.timestamp('published_at').nullable();
  table.timestamps(true, true);
  
  // Foreign key constraint
  table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
});

// Create table with indexes
knex.schema.createTable('products', function(table) {
  table.increments('id').primary();
  table.string('name', 255).notNullable();
  table.decimal('price', 10, 2).notNullable();
  table.string('category', 100);
  
  // Create indexes
  table.index(['name'], 'idx_products_name');
  table.index(['category', 'price'], 'idx_products_category_price');
});`}
            />
            
            <CodeBlock
              title="Modify Tables"
              language="javascript"
              code={`// Add a column
knex.schema.table('users', function(table) {
  table.string('phone', 20).nullable();
});

// Add multiple columns
knex.schema.table('users', function(table) {
  table.string('address', 255).nullable();
  table.date('birth_date').nullable();
  table.boolean('verified').defaultTo(false);
});

// Drop a column
knex.schema.table('users', function(table) {
  table.dropColumn('phone');
});

// Rename a column
knex.schema.table('users', function(table) {
  table.renameColumn('name', 'full_name');
});

// Modify a column (PostgreSQL, MySQL)
knex.schema.table('users', function(table) {
  table.string('email', 300).alter();
});

// Add foreign key
knex.schema.table('posts', function(table) {
  table.foreign('user_id').references('id').inTable('users');
});

// Drop foreign key
knex.schema.table('posts', function(table) {
  table.dropForeign('user_id');
});`}
            />
            
            <CodeBlock
              title="Create and Drop Tables"
              language="javascript"
              code={`// Drop a table
knex.schema.dropTable('users');

// Drop table if it exists
knex.schema.dropTableIfExists('users');

// Drop multiple tables
knex.schema.dropTable(['users', 'posts', 'comments']);

// Rename a table
knex.schema.renameTable('users', 'accounts');

// Check if table exists
knex.schema.hasTable('users').then(function(exists) {
  console.log('Users table exists:', exists);
});

// Check if column exists
knex.schema.hasColumn('users', 'email').then(function(exists) {
  console.log('Email column exists:', exists);
});`}
            />
            
            <CodeBlock
              title="Create Views"
              language="javascript"
              code={`// Create a view
knex.schema.createView('active_users', function(view) {
  view.columns(['id', 'name', 'email']);
  view.as(knex('users').select('*').where('status', 'active'));
});

// Create a view with a complex query
knex.schema.createView('user_post_counts', function(view) {
  view.columns(['user_id', 'name', 'post_count']);
  view.as(
    knex('users')
      .select('users.id', 'users.name')
      .count('posts.id as post_count')
      .leftJoin('posts', 'users.id', '=', 'posts.user_id')
      .groupBy('users.id', 'users.name')
  );
});

// Drop a view
knex.schema.dropView('active_users');

// Drop view if it exists
knex.schema.dropViewIfExists('active_users');

// Rename a view
knex.schema.renameView('active_users', 'current_users');`}
            />
          </div>
        );
        
      case 'json':
        return (
          <div>
            <h3>JSON Operations</h3>
            <p>Working with JSON data in PostgreSQL, MySQL, and SQLite:</p>
            
            <CodeBlock
              title="JSON Extraction"
              language="javascript"
              code={`// Extract JSON value
knex('users').jsonExtract('profile', '$.name');
// SELECT json_extract(profile, '$.name') FROM users

// Extract JSON with alias
knex('users').jsonExtract('profile', '$.name', 'user_name');
// SELECT json_extract(profile, '$.name') as user_name FROM users

// Extract multiple JSON values
knex('users').jsonExtract([
  ['profile', '$.name', 'user_name'],
  ['profile', '$.email', 'user_email'],
  ['profile', '$.age', 'user_age']
]);

// Extract nested JSON
knex('products').jsonExtract('attributes', '$.dimensions.height', 'height');
// SELECT json_extract(attributes, '$.dimensions.height') as height FROM products`}
            />
            
            <CodeBlock
              title="JSON Manipulation"
              language="javascript"
              code={`// Set JSON value
knex('users')
  .where('id', 1)
  .update({
    profile: knex.jsonSet('profile', '$.name', 'John Updated')
  });

// Set nested JSON value
knex('users')
  .where('id', 1)
  .update({
    profile: knex.jsonSet('profile', '$.address.city', 'New York')
  });

// Set JSON value with alias
knex('users')
  .where('id', 1)
  .update({
    profile: knex.jsonSet('profile', '$.name', 'John Updated', 'updated_profile')
  })
  .returning('updated_profile');

// Remove JSON property
knex('users')
  .where('id', 1)
  .update({
    profile: knex.jsonRemove('profile', '$.password')
  });`}
            />
            
            <CodeBlock
              title="JSON Queries"
              language="javascript"
              code={`// Query JSON properties
knex('users').whereJsonObject('profile', { name: 'John' });
// SELECT * FROM users WHERE profile = '{"name": "John"}'

// Query nested JSON
knex('users').whereJsonObject('profile', { 
  address: { city: 'New York' } 
});

// JSON path queries (PostgreSQL)
knex('users').where('profile->>$.name', 'John');
// SELECT * FROM users WHERE profile->>'$.name' = 'John'

// JSON contains (PostgreSQL)
knex('users').where('profile', '@>', { name: 'John' });
// SELECT * FROM users WHERE profile @> '{"name": "John"}'

// JSON contains any key (PostgreSQL)
knex('users').where('profile', '?', 'name');
// SELECT * FROM users WHERE profile ? 'name'`}
            />
          </div>
        );
        
      case 'raw-sql':
        return (
          <div>
            <h3>Raw SQL</h3>
            <p>Using raw SQL with Knex for complex queries:</p>
            
            <CodeBlock
              title="Basic Raw Queries"
              language="javascript"
              code={`// Raw SELECT
knex.raw('SELECT * FROM users WHERE created_at > ?', [date]);

// Raw INSERT
knex.raw('INSERT INTO users (name, email) VALUES (?, ?)', ['John', 'john@example.com']);

// Raw UPDATE
knex.raw('UPDATE users SET status = ? WHERE id IN (?)', ['active', [1, 2, 3]]);

// Raw DELETE
knex.raw('DELETE FROM users WHERE created_at < ?', [cutoffDate]);`}
            />
            
            <CodeBlock
              title="Raw with Query Builder"
              language="javascript"
              code={`// Raw WHERE clause
knex('users').whereRaw('LOWER(name) = ?', ['john doe']);

// Raw JOIN condition
knex('users')
  .join('posts', function() {
    this.on(knex.raw('users.id = posts.user_id AND posts.status = ?', ['published']));
  });

// Raw ORDER BY
knex('users').orderByRaw('RANDOM()');

// Raw GROUP BY
knex('posts')
  .select('user_id', knex.raw('COUNT(*) as post_count'))
  .groupByRaw('user_id, DATE(created_at)');

// Raw HAVING
knex('posts')
  .select('user_id')
  .count('* as post_count')
  .groupBy('user_id')
  .havingRaw('COUNT(*) > ?', [5]);`}
            />
            
            <CodeBlock
              title="Complex Raw Queries"
              language="javascript"
              code={`// Window functions
knex('posts')
  .select([
    'title',
    'user_id',
    knex.raw('ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as row_num')
  ])
  .whereRaw('row_num = 1');

// Common Table Expressions with raw
knex.raw(\`
  WITH user_posts AS (
    SELECT user_id, COUNT(*) as post_count
    FROM posts
    GROUP BY user_id
  )
  SELECT u.name, up.post_count
  FROM users u
  JOIN user_posts up ON u.id = up.user_id
  WHERE up.post_count > ?
\`, [5]);

// Full-text search (PostgreSQL)
knex('posts')
  .select('*')
  .whereRaw('to_tsvector(title || \' \' || content) @@ to_tsquery(?)', ['search & terms']);`}
            />
            
            <CodeBlock
              title="Raw with Bindings"
              language="javascript"
              code={`// Named bindings
knex.raw('SELECT * FROM users WHERE name = :name AND email = :email', {
  name: 'John',
  email: 'john@example.com'
});

// Multiple bindings
knex.raw(\`
  INSERT INTO users (name, email, created_at) 
  VALUES (?, ?, ?)
\`, ['John', 'john@example.com', new Date()]);

// Raw with subquery
knex.raw(\`
  SELECT * FROM users 
  WHERE id IN (SELECT user_id FROM posts WHERE created_at > ?)
\`, [date]);

// Raw for database-specific functions
knex('users')
  .select('*')
  .whereRaw('DATE(created_at) = ?', [today])
  .orderByRaw('EXTRACT(EPOCH FROM created_at) DESC');`}
            />
          </div>
        );
        
      default:
        return <div>Select a tab to view examples</div>;
    }
  };

  return (
    <div className="examples-container">
      <h2>Knex.js Examples</h2>
      <p>
        Knex.js is a flexible, portable, and fun-to-use SQL query builder for Node.js. 
        It supports multiple database dialects including PostgreSQL, MySQL, SQLite3, Oracle, and MSSQL 
        with features like transactions, connection pooling, and streaming queries.
      </p>
      
      <NavigationTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="tab-content">
        {renderContent()}
      </div>
      
      <div className="additional-resources">
        <h3>Additional Resources</h3>
        <ul>
          <li><a href="https://knexjs.org/" target="_blank" rel="noopener noreferrer">Official Knex.js Documentation</a></li>
          <li><a href="https://github.com/knex/knex" target="_blank" rel="noopener noreferrer">Knex.js GitHub Repository</a></li>
          <li><a href="https://knexjs.org/guide/" target="_blank" rel="noopener noreferrer">Knex.js Guide</a></li>
        </ul>
      </div>
    </div>
  );
};

export default KnexExamples;