/**
 * CORS (Cross-Origin Resource Sharing) Examples
 * 
 * CORS is a security mechanism that allows a server to indicate any
 * origins (domains, ports, or methods) other than its own from which a browser
 * should permit requests. It's implemented through HTTP headers.
 */

// Example 1: Basic CORS setup with Express.js
/*
// server.js
const express = require('express');
const cors = require('cors');

const app = express();

// Configure CORS with default options
app.use(cors({
  origin: ['http://localhost:3000', 'https://example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Custom CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from specific origins
    const allowedOrigins = ['http://localhost:3000', 'https://example.com'];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Apply custom CORS options
app.use(cors(corsOptions));

// Route handler
app.get('/api/data', (req, res) => {
  res.json({ message: 'This is CORS-enabled data' });
});

app.post('/api/data', (req, res) => {
  res.json({ message: 'Data received via CORS POST' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with CORS enabled`);
});
*/

// Example 2: CORS with preflight requests
/*
// server.js
const express = require('express');
const cors = require('cors');

const app = express();

// Configure CORS to handle preflight requests
app.use(cors({
  origin: ['http://localhost:3000', 'https://example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: true, // Respond to preflight requests with 200 status
  optionsSuccessStatus: 204 // Respond to successful preflight with 204 status
}));

// Custom preflight handler
app.options('*', (req, res) => {
  console.log('Preflight request to:', req.method, req.headers.origin);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
  res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(204).send();
});

// Route handler
app.get('/api/data', (req, res) => {
  res.json({ message: 'This is CORS-enabled data with preflight support' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with CORS and preflight support`);
});
*/

// Example 3: CORS with dynamic origins
/*
// server.js
const express = require('express');
const cors = require('cors');

const app = express();

// Dynamic origin validation
const isOriginAllowed = (origin) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://example.com',
    'https://api.example.com'
  ];
  
  return allowedOrigins.includes(origin);
};

// CORS configuration with dynamic origin validation
app.use(cors({
  origin: isOriginAllowed,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Route handler
app.get('/api/data', (req, res) => {
  const origin = req.headers.origin;
  
  if (!isOriginAllowed(origin)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  
  res.json({ 
    message: 'This is CORS-enabled data',
    origin: origin
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with dynamic CORS origin validation`);
});
*/

// Example 4: CORS with specific routes
/*
// server.js
const express = require('express');
const cors = require('cors');

const app = express();

// Different CORS options for different routes
const publicCorsOptions = {
  origin: '*',
  methods: ['GET', 'HEAD'],
  allowedHeaders: ['Content-Type']
};

const privateCorsOptions = {
  origin: ['http://localhost:3000', 'https://example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Apply CORS to public routes
app.use('/api/public', cors(publicCorsOptions), (req, res, next) => {
  res.json({ message: 'This is a public API endpoint' });
});

// Apply CORS to private routes
app.use('/api/private', cors(privateCorsOptions), (req, res, next) => {
  res.json({ message: 'This is a private API endpoint' });
});

// Route handlers
app.get('/api/public/data', (req, res) => {
  res.json({ data: 'Public data accessible from any origin' });
});

app.get('/api/private/data', (req, res) => {
  const origin = req.headers.origin;
  
  // Check if origin is allowed for private routes
  const allowedOrigins = ['http://localhost:3000', 'https://example.com'];
  
  if (!allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'Origin not allowed for private endpoint' });
  }
  
  res.json({ data: 'Private data accessible from allowed origins' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with route-specific CORS`);
});
*/

// Example 5: CORS with credentials and cookies
/*
// server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// CORS configuration with credentials
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
  credentials: true, // Allow cookies to be sent with requests
  exposedHeaders: ['Set-Cookie', 'Clear-Site-Data'] // Expose specific headers to client
}));

// Parse cookies
app.use(cookieParser());

// Route that sets a cookie
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  
  // Set a cookie
  res.cookie('user', username, {
    maxAge: 86400 * 30, // 30 days
    httpOnly: false, // Allow client-side access
    secure: process.env.NODE_ENV === 'production' // Only send over HTTPS in production
  });
  
  res.json({ message: 'Login successful', user: username });
});

// Route that reads a cookie
app.get('/api/profile', (req, res) => {
  const username = req.cookies.user;
  
  if (!username) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  res.json({ message: 'Profile retrieved', user: username });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with CORS and cookie support`);
});
*/

// Example 6: CORS with caching
/*
// server.js
const express = require('express');
const cors = require('cors');
const mcache = require('memory-cache');

const app = express();
const cache = new mcache({ ttl: 1000 }); // Cache for 1 second

// CORS configuration with caching
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Cache middleware
const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  
  // Check cache first
  const cachedData = cache.get(key);
  if (cachedData) {
    console.log('Cache hit for:', key);
    return res.json(cachedData);
  }
  
  // Continue to next middleware
  next();
};

// Route with caching
app.get('/api/data', cacheMiddleware, (req, res) => {
  // Simulate expensive data fetching
  setTimeout(() => {
    const data = {
      id: Date.now(),
      message: 'This is expensive data',
      timestamp: new Date().toISOString()
    };
    
    // Cache the data
    cache.set(key, data, { ttl: 5000 }); // Cache for 5 seconds
    
    res.json(data);
  }, 1000); // Simulate 1 second delay
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with CORS and caching`);
});
*/

// Example 7: CORS with rate limiting
/*
// server.js
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// CORS configuration with rate limiting
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Apply rate limiting to all requests
app.use(limiter);

// Route handler
app.get('/api/data', (req, res) => {
  res.json({ message: 'This is rate-limited data' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with CORS and rate limiting`);
});
*/

// Example 8: CORS with conditional headers
/*
// server.js
const express = require('express');
const cors = require('cors');

const app = express();

// Conditional CORS configuration
const corsOptions = (req, res, next) => {
  const origin = req.headers.origin;
  const userAgent = req.headers['user-agent'];
  
  // Allow different origins based on user agent
  let allowedOrigins = ['http://localhost:3000'];
  
  if (userAgent && userAgent.includes('Mozilla')) {
    allowedOrigins.push('https://example.com');
  }
  
  // Allow different headers based on request method
  let allowedHeaders = ['Content-Type'];
  
  if (req.method === 'POST') {
    allowedHeaders.push('X-Custom-Header');
  }
  
  return {
    origin: allowedOrigins.includes(origin) ? origin : false,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders,
    credentials: true
  };
};

// Apply conditional CORS
app.use(cors(corsOptions));

// Route handler
app.get('/api/data', (req, res) => {
  const origin = req.headers.origin;
  const userAgent = req.headers['user-agent'];
  
  res.json({ 
    message: 'This is conditional CORS data',
    origin,
    userAgent
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with conditional CORS`);
});
*/

// Example 9: CORS with security headers
/*
// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration with security
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Route handler
app.get('/api/data', (req, res) => {
  res.json({ 
    message: 'This is secure CORS data',
    securityHeaders: res.getHeaders()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with CORS and security headers`);
});
*/

// Example 10: CORS with environment-specific configuration
/*
// server.js
const express = require('express');
const cors = require('cors');

const app = express();

// Environment-specific CORS configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const corsOptions = {
  origin: isDevelopment 
    ? ['http://localhost:3000', 'http://localhost:3001'] // Allow multiple origins in development
    : ['https://example.com'], // Only allow production origin in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Apply CORS
app.use(cors(corsOptions));

// Development-only middleware
if (isDevelopment) {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`, req.body);
    next();
  });
}

// Route handler
app.get('/api/data', (req, res) => {
  res.json({ 
    message: 'This is environment-specific CORS data',
    environment: process.env.NODE_ENV
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with environment-specific CORS`);
});
*/

// Example 11: CORS with custom error handling
/*
// server.js
const express = require('express');
const cors = require('cors');

const app = express();

// Custom CORS error handler
const corsErrorHandler = (err, req, res, next) => {
  console.error('CORS error:', err);
  
  if (err) {
    return res.status(500).json({ 
      error: 'CORS configuration error',
      message: err.message
    });
  }
  
  next();
};

// CORS configuration with custom error handler
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  onError: corsErrorHandler
}));

// Route handler
app.get('/api/data', (req, res) => {
  res.json({ 
    message: 'This is CORS data with custom error handling'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with custom CORS error handling`);
});
*/

// Example 12: CORS with proxy middleware
/*
// server.js
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Proxy configuration
const proxyOptions = {
  target: 'https://api.example.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/backend'
  }
};

// Apply proxy middleware
app.use('/api', createProxyMiddleware(proxyOptions));

// Route handler
app.get('/api/data', (req, res) => {
  res.json({ 
    message: 'This is proxied data'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with CORS and proxy middleware`);
});
*/

// Example 13: CORS with WebSocket support
/*
// server.js
const express = require('express');
const http = require('http');
const { Server } = require('ws');

const app = express();
const server = new Server({ noServer: true });

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// WebSocket upgrade handler
server.on('upgrade', (request, socket, head) => {
  // Handle WebSocket upgrade
  if (request.headers.upgrade === 'websocket') {
    server.handleUpgrade(request, socket, head, (ws) => {
      // Handle WebSocket connection
      ws.on('message', (message) => {
        console.log('Received message:', message);
        ws.send(JSON.stringify({ type: 'response', data: message }));
      });
    });
  }
});

// Route handler
app.get('/api/data', (req, res) => {
  res.json({ 
    message: 'This is CORS data with WebSocket support'
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with CORS and WebSocket support`);
});
*/

// Example 14: CORS with file uploads
/*
// server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();

// File upload configuration
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  }
});

// CORS configuration for file uploads
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Route handler for file upload
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  res.json({ 
    message: 'File uploaded successfully',
    filename: req.file.filename,
    size: req.file.size
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with CORS and file upload support`);
});
*/

// Example 15: CORS with authentication
/*
// server.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const secretKey = 'your-secret-key';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// CORS configuration with authentication
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Apply authentication middleware to protected routes
app.use('/api/protected', authenticateToken);

// Protected route handler
app.get('/api/protected/data', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  res.json({ 
    message: 'This is protected data',
    user: {
      id: req.user.id,
      username: req.user.username
    }
  });
});

// Public route handler
app.get('/api/public/data', (req, res) => {
  res.json({ 
    message: 'This is public data'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with CORS and JWT authentication`);
});
*/

export const corsExamples = {
  description: "Examples of implementing CORS (Cross-Origin Resource Sharing) in web applications",
  concepts: [
    "Same-origin policy",
    "Preflight requests",
    "Access-Control headers",
    "Credentials and cookies",
    "Dynamic origin validation",
    "Rate limiting",
    "Security headers"
  ],
  benefits: [
    "Enables cross-origin requests",
    "Protects against CSRF attacks",
    "Allows controlled resource sharing",
    "Standardized security mechanism"
  ],
  patterns: [
    "Express.js middleware",
    "Origin validation",
    "Route-specific CORS",
    "Cookie and credential handling",
    "Caching with CORS",
    "Rate limiting",
    "Security headers",
    "WebSocket support",
    "File uploads",
    "JWT authentication"
  ],
  bestPractices: [
    "Be specific about allowed origins",
    "Use HTTPS in production",
    "Validate and sanitize inputs",
    "Implement proper authentication",
    "Use appropriate HTTP methods",
    "Set proper cache headers",
    "Handle preflight requests correctly",
    "Consider security implications of CORS"
  ]
};