import React, { useState } from 'react';
import { CodeBlock, InteractiveDemo, NavigationTabs } from '../../components';

const KoaExamples = () => {
  const [activeTab, setActiveTab] = useState('setup');

  const tabs = [
    { id: 'setup', label: 'Setup' },
    { id: 'middleware', label: 'Middleware' },
    { id: 'routing', label: 'Routing' },
    { id: 'context', label: 'Context' },
    { id: 'error-handling', label: 'Error Handling' },
    { id: 'async', label: 'Async/Await' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'setup':
        return (
          <div>
            <h3>Koa.js Setup</h3>
            <p>Koa is a next generation web framework for Node.js. Here's how to set up a basic Koa application:</p>
            
            <CodeBlock
              title="Basic Koa Application"
              language="javascript"
              code={`// Install Koa
// npm install koa

// Basic Koa application
const Koa = require('koa');
const app = new Koa();

// Simple middleware
app.use(async ctx => {
  ctx.body = 'Hello Koa';
});

app.listen(3000);
console.log('Server running on http://localhost:3000');`}
            />
            
            <CodeBlock
              title="Koa with ES Modules"
              language="javascript"
              code={`// Using ES modules
import Koa from 'koa';

const app = new Koa();

// Middleware with async/await
app.use(async ctx => {
  ctx.body = 'Hello Koa with ES Modules';
});

app.listen(3000);`}
            />
            
            <CodeBlock
              title="Koa with Common Middleware"
              language="javascript"
              code={`const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const app = new Koa();
const router = new Router();

// Middleware setup
app.use(cors());
app.use(bodyParser());

// Routes
router.get('/', ctx => {
  ctx.body = { message: 'Hello World' };
});

router.get('/api/users', ctx => {
  ctx.body = { users: [] };
});

// Apply routes
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);`}
            />
          </div>
        );
        
      case 'middleware':
        return (
          <div>
            <h3>Middleware in Koa</h3>
            <p>Koa middleware functions are organized in a stack and executed in sequence:</p>
            
            <CodeBlock
              title="Basic Middleware"
              language="javascript"
              code={`const Koa = require('koa');
const app = new Koa();

// Logger middleware
app.use(async (ctx, next) => {
  console.log(\`\${ctx.method} \${ctx.url}\`);
  await next();
});

// Response time middleware
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', \`\${ms}ms\`);
});

// Main handler
app.use(async ctx => {
  ctx.body = 'Hello Middleware';
});

app.listen(3000);`}
            />
            
            <CodeBlock
              title="Middleware with Options"
              language="javascript"
              code={`// Middleware factory with options
function logger(format) {
  format = format || ':method :url';
  
  return async (ctx, next) => {
    const str = format
      .replace(':method', ctx.method)
      .replace(':url', ctx.url);
    
    console.log(str);
    await next();
  };
}

// Usage with custom format
app.use(logger(':method - :url'));

// Middleware with configuration
app.use(async (ctx, next) => {
  ctx.state.user = { id: 1, name: 'John' };
  await next();
});

app.use(async ctx => {
  ctx.body = \`Hello \${ctx.state.user.name}\`;
});`}
            />
            
            <CodeBlock
              title="Conditional Middleware"
              language="javascript"
              code={`// Middleware that runs conditionally
app.use(async (ctx, next) => {
  // Skip middleware for certain paths
  if (ctx.path.startsWith('/skip')) {
    return await next();
  }
  
  // Run only for API routes
  if (ctx.path.startsWith('/api')) {
    ctx.set('X-API-Version', '1.0');
  }
  
  await next();
});

// Authentication middleware
app.use(async (ctx, next) => {
  // Skip authentication for public routes
  if (ctx.path === '/login' || ctx.path === '/register') {
    return await next();
  }
  
  // Check for auth token
  const token = ctx.headers.authorization;
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: 'Unauthorized' };
    return;
  }
  
  // Verify token (simplified)
  try {
    ctx.state.user = { id: 1, name: 'John' };
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid token' };
  }
});`}
            />
            
            <CodeBlock
              title="Composing Middleware"
              language="javascript"
              code={`const compose = require('koa-compose');

// Individual middleware functions
async function middleware1(ctx, next) {
  console.log('Middleware 1 - Before');
  await next();
  console.log('Middleware 1 - After');
}

async function middleware2(ctx, next) {
  console.log('Middleware 2 - Before');
  await next();
  console.log('Middleware 2 - After');
}

// Compose middleware
const composedMiddleware = compose([middleware1, middleware2]);

// Use composed middleware
app.use(composedMiddleware);

// Main handler
app.use(async ctx => {
  ctx.body = 'Composed Middleware Example';
});`}
            />
          </div>
        );
        
      case 'routing':
        return (
          <div>
            <h3>Routing in Koa</h3>
            <p>Koa doesn't include a router by default. Here are examples using popular routing libraries:</p>
            
            <CodeBlock
              title="Basic Routing with @koa/router"
              language="javascript"
              code={`const Koa = require('koa');
const Router = require('@koa/router');

const app = new Koa();
const router = new Router();

// Basic routes
router.get('/', ctx => {
  ctx.body = 'Home Page';
});

router.get('/about', ctx => {
  ctx.body = 'About Page';
});

// Route with parameters
router.get('/users/:id', ctx => {
  const { id } = ctx.params;
  ctx.body = \`User ID: \${id}\`;
});

// POST route
router.post('/users', async ctx => {
  const body = ctx.request.body;
  // Process user data
  ctx.body = { success: true, user: body };
});

// Apply routes
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);`}
            />
            
            <CodeBlock
              title="Route Middleware"
              language="javascript"
              code={`// Middleware for specific routes
router.get('/admin', 
  async (ctx, next) => {
    // Check admin permissions
    if (!ctx.state.user || !ctx.state.user.isAdmin) {
      ctx.status = 403;
      ctx.body = { error: 'Access denied' };
      return;
    }
    await next();
  },
  async ctx => {
    ctx.body = 'Admin Dashboard';
  }
);

// Multiple middleware for a route
router.get('/protected',
  async (ctx, next) => {
    // Authentication check
    if (!ctx.state.user) {
      ctx.status = 401;
      ctx.body = { error: 'Unauthorized' };
      return;
    }
    await next();
  },
  async (ctx, next) => {
    // Authorization check
    if (!ctx.state.user.canAccess) {
      ctx.status = 403;
      ctx.body = { error: 'Forbidden' };
      return;
    }
    await next();
  },
  async ctx => {
    ctx.body = 'Protected Resource';
  }
);`}
            />
            
            <CodeBlock
              title="Route Groups and Prefixes"
              language="javascript"
              code={`// Route groups with prefixes
const apiRouter = new Router({ prefix: '/api/v1' });

apiRouter.get('/users', ctx => {
  ctx.body = { users: [] };
});

apiRouter.post('/users', ctx => {
  ctx.body = { message: 'User created' };
});

apiRouter.get('/users/:id', ctx => {
  const { id } = ctx.params;
  ctx.body = { user: { id, name: \`User \${id}\` } };
});

// Admin routes
const adminRouter = new Router({ prefix: '/admin' });

adminRouter.get('/dashboard', ctx => {
  ctx.body = 'Admin Dashboard';
});

adminRouter.get('/users', ctx => {
  ctx.body = { adminUsers: [] };
});

// Apply all routers
app.use(apiRouter.routes());
app.use(adminRouter.routes());
app.use(router.allowedMethods());`}
            />
            
            <CodeBlock
              title="Nested Routes"
              language="javascript"
              code={`// Nested routing structure
const userRouter = new Router();

userRouter.get('/', ctx => {
  ctx.body = { users: [] };
});

userRouter.get('/:id', ctx => {
  const { id } = ctx.params;
  ctx.body = { user: { id } };
});

userRouter.post('/', ctx => {
  ctx.body = { message: 'User created' };
});

// Mount user router under main router
router.use('/users', userRouter.routes());

// This creates:
// GET /users
// GET /users/:id
// POST /users

app.use(router.routes());
app.use(router.allowedMethods());`}
            />
          </div>
        );
        
      case 'context':
        return (
          <div>
            <h3>Koa Context</h3>
            <p>The Koa Context object encapsulates Node's request and response objects:</p>
            
            <CodeBlock
              title="Context Properties"
              language="javascript"
              code={`app.use(async ctx => {
  // Request information
  console.log(ctx.method);     // HTTP method
  console.log(ctx.url);        // Request URL
  console.log(ctx.path);       // Path without query string
  console.log(ctx.query);       // Parsed query string
  console.log(ctx.headers);     // Request headers
  console.log(ctx.ip);         // Client IP
  
  // Response methods
  ctx.body = 'Response body';
  ctx.status = 200;
  ctx.set('Content-Type', 'text/plain');
  ctx.redirect('/new-location');
  
  // State for passing data between middleware
  ctx.state.user = { id: 1 };
  ctx.state.data = { key: 'value' };
});`}
            />
            
            <CodeBlock
              title="Request Body Handling"
              language="javascript"
              code={`const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

app.use(async ctx => {
  // Access request body
  if (ctx.method === 'POST') {
    const body = ctx.request.body;
    console.log('Received body:', body);
    
    // Handle JSON body
    if (ctx.is('json')) {
      const data = ctx.request.body;
      ctx.body = { received: data };
    }
    
    // Handle form data
    if (ctx.is('urlencoded')) {
      const formData = ctx.request.body;
      ctx.body = { form: formData };
    }
  }
});

// File upload handling
const formidable = require('koa-formidable');

app.use(async (ctx, next) => {
  if (ctx.method === 'POST' && ctx.path === '/upload') {
    const form = formidable({ multiples: true });
    
    await new Promise((resolve, reject) => {
      form.parse(ctx.req, (err, fields, files) => {
        if (err) return reject(err);
        ctx.state.files = files;
        ctx.state.fields = fields;
        resolve();
      });
    });
    
    await next();
  }
});`}
            />
            
            <CodeBlock
              title="Response Methods"
              language="javascript"
              code={`// Different response types
app.use(async ctx => {
  const accept = ctx.accepts('json', 'html', 'text');
  
  if (accept === 'json') {
    ctx.body = { message: 'JSON response' };
  } else if (accept === 'html') {
    ctx.body = '<h1>HTML response</h1>';
  } else {
    ctx.body = 'Plain text response';
  }
});

// Streaming response
app.use(async ctx => {
  ctx.type = 'application/json';
  ctx.body = JSON.stringify({ data: [] });
});

// File download
const fs = require('fs');
const path = require('path');

app.use(async ctx => {
  const filePath = path.join(__dirname, 'file.txt');
  const file = fs.createReadStream(filePath);
  
  ctx.set('Content-Disposition', 'attachment; filename=file.txt');
  ctx.body = file;
});

// Cookie handling
app.use(async ctx => {
  // Set cookie
  ctx.cookies.set('name', 'value', {
    httpOnly: true,
    secure: true,
    maxAge: 86400000 // 24 hours
  });
  
  // Get cookie
  const name = ctx.cookies.get('name');
  ctx.body = { cookie: name };
});`}
            />
          </div>
        );
        
      case 'error-handling':
        return (
          <div>
            <h3>Error Handling in Koa</h3>
            <p>Koa provides centralized error handling through middleware:</p>
            
            <CodeBlock
              title="Basic Error Handling"
              language="javascript"
              code={`// Error handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    };
    
    // Emit error for logging
    ctx.app.emit('error', err, ctx);
  }
});

// Route that throws an error
app.use(async ctx => {
  if (ctx.path === '/error') {
    const error = new Error('Something went wrong');
    error.status = 400;
    throw error;
  }
  
  ctx.body = 'Success';
});`}
            />
            
            <CodeBlock
              title="Custom Error Classes"
              language="javascript"
              code={`// Custom error classes
class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    this.name = 'AppError';
  }
}

class ValidationError extends AppError {
  constructor(message, field) {
    super(message, 400);
    this.name = 'ValidationError';
    this.field = field;
  }
}

// Usage in routes
app.use(async ctx => {
  const { id } = ctx.params;
  
  if (!id || isNaN(id)) {
    throw new ValidationError('Invalid ID parameter', 'id');
  }
  
  if (id < 1) {
    throw new AppError('ID must be positive', 400);
  }
  
  ctx.body = { id: parseInt(id) };
});`}
            />
            
            <CodeBlock
              title="404 and 500 Error Pages"
              language="javascript"
              code={`// 404 handler
app.use(async (ctx, next) => {
  await next();
  
  if (ctx.status === 404) {
    ctx.status = 404;
    ctx.body = {
      error: 'Not Found',
      message: 'The requested resource was not found'
    };
  }
});

// Global error handler
app.on('error', (err, ctx) => {
  console.error('App error:', err);
  
  // Log to external service
  if (process.env.ERROR_LOGGING_URL) {
    // Send error to logging service
  }
});

// Uncaught exception handler
app.on('error', err => {
  console.error('Uncaught error:', err);
  process.exit(1);
});`}
            />
          </div>
        );
        
      case 'async':
        return (
          <div>
            <h3>Async/Await in Koa</h3>
            <p>Koa is built from the ground up to support and leverage async/await:</p>
            
            <CodeBlock
              title="Async Middleware"
              language="javascript"
              code={`// Async middleware with database operations
const db = require('./database');

app.use(async (ctx, next) => {
  // Async database query
  const users = await db.query('SELECT * FROM users');
  ctx.state.users = users;
  await next();
});

// Async route handler
app.use(async ctx => {
  const { id } = ctx.params;
  
  try {
    // Async database operation
    const user = await db.query(
      'SELECT * FROM users WHERE id = ?', 
      [id]
    );
    
    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }
    
    ctx.body = { user };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Database error' };
  }
});`}
            />
            
            <CodeBlock
              title="Parallel Async Operations"
              language="javascript"
              code={`// Parallel async operations
app.use(async ctx => {
  const { id } = ctx.params;
  
  try {
    // Run multiple async operations in parallel
    const [user, posts, comments] = await Promise.all([
      db.query('SELECT * FROM users WHERE id = ?', [id]),
      db.query('SELECT * FROM posts WHERE user_id = ?', [id]),
      db.query('SELECT * FROM comments WHERE user_id = ?', [id])
    ]);
    
    ctx.body = {
      user,
      posts,
      comments
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to load data' };
  }
});

// Async middleware with timeout
app.use(async (ctx, next) => {
  // Add timeout to async operations
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), 5000);
  });
  
  try {
    await Promise.race([next(), timeout]);
  } catch (error) {
    ctx.status = 408;
    ctx.body = { error: 'Request timeout' };
  }
});`}
            />
            
            <CodeBlock
              title="Async Error Handling"
              language="javascript"
              code={`// Error handling in async functions
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    // Handle different types of async errors
    if (error.name === 'ValidationError') {
      ctx.status = 400;
      ctx.body = { 
        error: 'Validation failed',
        field: error.field 
      };
    } else if (error.name === 'DatabaseError') {
      ctx.status = 500;
      ctx.body = { 
        error: 'Database operation failed' 
      };
    } else if (error.code === 'ECONNREFUSED') {
      ctx.status = 503;
      ctx.body = { 
        error: 'Service unavailable' 
      };
    } else {
      // Generic error
      ctx.status = error.status || 500;
      ctx.body = { 
        error: error.message || 'Internal server error' 
      };
    }
    
    // Log error
    console.error('Async error:', error);
  }
});`}
            />
          </div>
        );
        
      default:
        return <div>Select a tab to view examples</div>;
    }
  };

  return (
    <div className="examples-container">
      <h2>Koa.js Examples</h2>
      <p>
        Koa is a next generation web framework for Node.js. It uses async functions to eliminate 
        callbacks and greatly increase error-handling capabilities. Koa does not bundle any middleware 
        within its core, providing an elegant suite of methods that make writing servers fast and enjoyable.
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
          <li><a href="https://koajs.com/" target="_blank" rel="noopener noreferrer">Official Koa.js Documentation</a></li>
          <li><a href="https://github.com/koajs/koa" target="_blank" rel="noopener noreferrer">Koa.js GitHub Repository</a></li>
          <li><a href="https://koajs.com/#application" target="_blank" rel="noopener noreferrer">Koa.js API Reference</a></li>
        </ul>
      </div>
    </div>
  );
};

export default KoaExamples;