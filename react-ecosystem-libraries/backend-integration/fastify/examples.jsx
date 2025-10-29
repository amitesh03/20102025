import React, { useState } from 'react';
import { CodeBlock, InteractiveDemo, NavigationTabs } from '../../components';

const FastifyExamples = () => {
  const [activeTab, setActiveTab] = useState('basic-setup');

  const tabs = [
    { id: 'basic-setup', label: 'Basic Setup' },
    { id: 'routing', label: 'Routing' },
    { id: 'plugins', label: 'Plugins' },
    { id: 'middleware', label: 'Middleware' },
    { id: 'validation', label: 'Validation' },
    { id: 'hooks', label: 'Hooks' },
    { id: 'typescript', label: 'TypeScript' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'basic-setup':
        return (
          <div>
            <h3>Basic Fastify Server Setup</h3>
            <p>Fastify is a fast and low overhead web framework for Node.js. Here's how to set up a basic server:</p>
            
            <CodeBlock
              title="Basic Server Setup (CommonJS)"
              language="javascript"
              code={`// Require the framework and instantiate it
const fastify = require('fastify')({
  logger: true
})

// Declare a route
fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on \${address}
})`}
            />
            
            <CodeBlock
              title="Basic Server Setup (ESM)"
              language="javascript"
              code={`// ESM
import Fastify from 'fastify'

const fastify = Fastify({
  logger: true
})

// Declare a route
fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})

// Run the server!
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  // Server is now listening on \${address}
})`}
            />
            
            <CodeBlock
              title="Async/Await Server Setup"
              language="javascript"
              code={`// ESM
import Fastify from 'fastify'

const fastify = Fastify({
  logger: true
})

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()`}
            />
          </div>
        );
        
      case 'routing':
        return (
          <div>
            <h3>Routing in Fastify</h3>
            <p>Fastify provides a flexible routing system with support for parameters, wildcards, and more:</p>
            
            <CodeBlock
              title="Basic Routes"
              language="javascript"
              code={`// Shorthand methods
fastify.get('/', (request, reply) => {
  reply.send({ hello: 'world' })
})

fastify.post('/', (request, reply) => {
  reply.send({ received: true })
})

// With schema validation
const opts = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          hello: { type: 'string' }
        }
      }
    }
  }
}
fastify.get('/with-schema', opts, (request, reply) => {
  reply.send({ hello: 'world' })
})`}
            />
            
            <CodeBlock
              title="Parametric and Wildcard Routes"
              language="javascript"
              code={`// Parametric routes
fastify.get('/example/:userId', function (request, reply) {
  // curl \${app-url}/example/12345
  // userId === '12345'
  const { userId } = request.params;
  reply.send({ userId });
})

fastify.get('/example/:userId/:secretToken', function (request, reply) {
  // curl \${app-url}/example/12345/abc.zHi
  // userId === '12345'
  // secretToken === 'abc.zHi'
  const { userId, secretToken } = request.params;
  reply.send({ userId, secretToken });
})

// Wildcard routes
fastify.get('/example/*', function (request, reply) {
  // Matches /example/anything/here
  reply.send({ wildcard: true });
})`}
            />
            
            <CodeBlock
              title="Route Configuration"
              language="javascript"
              code={`function handler (req, reply) {
  reply.send(reply.routeOptions.config.output)
}

fastify.get('/en', { 
  config: { output: 'hello world!' } 
}, handler)

fastify.get('/it', { 
  config: { output: 'ciao mondo!' } 
}, handler)

// Using the generic route method
fastify.route({
  method: 'GET',
  url: '/example',
  handler: async (request, reply) => {
    reply.send({ message: 'Hello World' })
  }
})`}
            />
          </div>
        );
        
      case 'plugins':
        return (
          <div>
            <h3>Using Plugins in Fastify</h3>
            <p>Fastify's plugin system allows you to encapsulate functionality and share it across your application:</p>
            
            <CodeBlock
              title="Creating a Plugin"
              language="javascript"
              code={`const fp = require('fastify-plugin')

// A simple plugin that decorates the server
async function myPlugin(fastify, options) {
  fastify.decorate('utility', () => {
    return 'Hello from utility!'
  })
}

module.exports = fp(myPlugin)`}
            />
            
            <CodeBlock
              title="Registering Plugins"
              language="javascript"
              code={`// Register a plugin
fastify.register(require('./my-plugin'))

// Register with options
fastify.register(require('./another-plugin'), {
  option1: 'value1',
  option2: 'value2'
})

// Register with a prefix
fastify.register(require('./user-routes'), { prefix: '/api/v1' })

// ESM version
import myPlugin from './my-plugin.js'
fastify.register(myPlugin)`}
            />
            
            <CodeBlock
              title="Database Plugin Example"
              language="javascript"
              code={`const fp = require('fastify-plugin')
const { Client } = require('pg')

async function dbPlugin(fastify, options) {
  const client = new Client({
    connectionString: options.connectionString
  })
  
  await client.connect()
  
  fastify.decorate('db', {
    query: async (text, params) => {
      try {
        const result = await client.query(text, params)
        return result.rows
      } catch (error) {
        throw error
      }
    },
    close: async () => {
      await client.end()
    }
  })
  
  // Clean up when server closes
  fastify.addHook('onClose', async () => {
    await client.end()
  })
}

module.exports = fp(dbPlugin)`}
            />
          </div>
        );
        
      case 'middleware':
        return (
          <div>
            <h3>Middleware in Fastify</h3>
            <p>Fastify uses hooks instead of traditional middleware, providing more control over the request lifecycle:</p>
            
            <CodeBlock
              title="Request Hooks"
              language="javascript"
              code={`// onRequest hook - runs before request handling
fastify.addHook('onRequest', (request, reply, done) => {
  // Add custom header to all responses
  reply.header('X-Custom-Header', 'fastify-example')
  done()
})

// preHandler hook - runs before the route handler
fastify.addHook('preHandler', (request, reply, done) => {
  // Log all requests
  request.log.info({ 
    method: request.method, 
    url: request.url 
  })
  done()
})

// onResponse hook - runs after response is sent
fastify.addHook('onResponse', (request, reply, done) => {
  // Log response time
  request.log.info({
    responseTime: reply.getResponseTime()
  })
  done()
})`}
            />
            
            <CodeBlock
              title="Route-specific Hooks"
              language="javascript"
              code={`// Hooks can be applied to specific routes
fastify.get('/protected', {
  preHandler: (request, reply, done) => {
    // Authentication check
    if (!request.headers.authorization) {
      reply.code(401).send({ error: 'Unauthorized' })
      return
    }
    done()
  }
}, (request, reply) => {
  reply.send({ message: 'Protected data' })
})

// Multiple hooks
fastify.get('/multi-hook', {
  preHandler: [
    (request, reply, done) => {
      // First hook
      request.user = { id: 1, name: 'John' }
      done()
    },
    (request, reply, done) => {
      // Second hook
      request.log.info({ user: request.user })
      done()
    }
  ]
}, (request, reply) => {
  reply.send({ user: request.user })
})`}
            />
          </div>
        );
        
      case 'validation':
        return (
          <div>
            <h3>Validation in Fastify</h3>
            <p>Fastify has built-in support for JSON Schema validation for request and response data:</p>
            
            <CodeBlock
              title="Request Validation"
              language="javascript"
              code={`const schema = {
  body: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string', minLength: 3 },
      password: { type: 'string', minLength: 8 },
      email: { type: 'string', format: 'email' }
    }
  },
  querystring: {
    type: 'object',
    properties: {
      role: { type: 'string', enum: ['user', 'admin'] }
    }
  },
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' }
    }
  }
}

fastify.post('/users/:id', { schema }, (request, reply) => {
  // If validation fails, Fastify automatically returns a 400 response
  const { username, password, email } = request.body
  const { role } = request.query
  const { id } = request.params
  
  reply.send({ 
    id, 
    username, 
    email, 
    role,
    created: true 
  })
})`}
            />
            
            <CodeBlock
              title="Response Validation"
              language="javascript"
              code={`const responseSchema = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          email: { type: 'string' }
        }
      },
      404: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  }
}

fastify.get('/users/:id', responseSchema, async (request, reply) => {
  const { id } = request.params
  
  // Simulate database lookup
  const user = await findUserById(id)
  
  if (!user) {
    reply.code(404).send({ error: 'User not found' })
    return
  }
  
  // Response will be validated against the schema
  reply.send(user)
})`}
            />
          </div>
        );
        
      case 'hooks':
        return (
          <div>
            <h3>Advanced Hooks in Fastify</h3>
            <p>Fastify provides a comprehensive set of hooks to control the request lifecycle:</p>
            
            <CodeBlock
              title="Application Hooks"
              language="javascript"
              code={`// onReady - Called when all plugins are loaded
fastify.addHook('onReady', async () => {
  console.log('Application is ready')
})

// onClose - Called when the server is closing
fastify.addHook('onClose', async (instance) => {
  console.log('Server is closing')
  // Clean up resources
})

// preValidation - Runs before validation
fastify.addHook('preValidation', async (request, reply) => {
  // Transform request data before validation
  if (request.body && request.body.email) {
    request.body.email = request.body.email.toLowerCase()
  }
})

// preSerialization - Runs before response serialization
fastify.addHook('preSerialization', async (request, reply, payload) => {
  // Transform response data
  if (payload.password) {
    delete payload.password
  }
  return payload
})`}
            />
            
            <CodeBlock
              title="Error Handling with Hooks"
              language="javascript"
              code={`// onError hook for centralized error handling
fastify.addHook('onError', async (request, reply, error) => {
  // Log all errors
  fastify.log.error({
    error: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method
  })
  
  // Add custom error headers
  reply.header('X-Error-ID', generateErrorId())
})

// Custom error handler
fastify.setErrorHandler((error, request, reply) => {
  // Handle validation errors
  if (error.validation) {
    reply.status(400).send({
      error: 'Validation failed',
      details: error.validation
    })
    return
  }
  
  // Handle other errors
  reply.status(500).send({
    error: 'Internal Server Error'
  })
})`}
            />
          </div>
        );
        
      case 'typescript':
        return (
          <div>
            <h3>TypeScript Support in Fastify</h3>
            <p>Fastify has excellent TypeScript support with type inference and validation:</p>
            
            <CodeBlock
              title="Basic TypeScript Server"
              language="typescript"
              code={`import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

const server: FastifyInstance = fastify({
  logger: true
})

server.get('/ping', async (request: FastifyRequest, reply: FastifyReply) => {
  return 'pong\\n'
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(\`Server listening at \${address}\`)
})`}
            />
            
            <CodeBlock
              title="Type-safe Routes with JSON Schema"
              language="typescript"
              code={`import fastify from 'fastify'
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts'

const server = fastify().withTypeProvider<JsonSchemaToTsProvider>()

server.get('/route', {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        foo: { type: 'number' },
        bar: { type: 'string' },
      },
      required: ['foo', 'bar']
    }
  }
}, (request, reply) => {
  // type Query = { foo: number, bar: string }
  const { foo, bar } = request.query // type safe!
  
  return { foo, bar }
})`}
            />
            
            <CodeBlock
              title="Type-safe Plugin"
              language="typescript"
              code={`import { FastifyPluginAsync } from 'fastify'

const plugin: FastifyPluginAsync = async (fastify, opts) => {
  fastify.decorate('db', {
    query: async (text: string, params?: any[]) => {
      // Database query implementation
      return []
    }
  })
}

// Type-safe usage
declare module 'fastify' {
  export interface FastifyInstance {
    db: {
      query: (text: string, params?: any[]) => Promise<any[]>
    }
  }
}

export default plugin`}
            />
          </div>
        );
        
      default:
        return <div>Select a tab to view examples</div>;
    }
  };

  return (
    <div className="examples-container">
      <h2>Fastify Examples</h2>
      <p>
        Fastify is a fast and low overhead web framework for Node.js. These examples demonstrate
        how to set up a Fastify server, define routes, use plugins, and implement various features.
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
          <li><a href="https://www.fastify.io/docs/latest/" target="_blank" rel="noopener noreferrer">Official Fastify Documentation</a></li>
          <li><a href="https://github.com/fastify/fastify" target="_blank" rel="noopener noreferrer">Fastify GitHub Repository</a></li>
          <li><a href="https://www.fastify.io/ecosystem/" target="_blank" rel="noopener noreferrer">Fastify Ecosystem</a></li>
        </ul>
      </div>
    </div>
  );
};

export default FastifyExamples;