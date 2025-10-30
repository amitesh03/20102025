# OpenAPI Specification with TypeScript

This folder contains comprehensive TypeScript examples for implementing API documentation using OpenAPI specifications. Each example demonstrates best practices, advanced patterns, and production-ready implementations.

## 📁 Folder Structure

```
openapi-spec/
├── README.md                    # This file - comprehensive documentation
├── swagger-examples.ts           # Swagger/OpenAPI documentation
├── openapi-generator-examples.ts # Code generation from OpenAPI specs
└── redoc-examples.ts            # ReDoc documentation generation
```

## 🚀 OpenAPI Technologies Covered

### 1. Swagger/OpenAPI
- **File**: `swagger-examples.ts`
- **Features**: API documentation, schema definitions, middleware
- **Use Case**: Interactive API documentation and validation

### 2. OpenAPI Generator
- **File**: `openapi-generator-examples.ts`
- **Features**: Code generation, custom templates, multiple languages
- **Use Case**: Generate client SDKs and server stubs

### 3. ReDoc
- **File**: `redoc-examples.ts`
- **Features**: Beautiful documentation, custom themes, templates
- **Use Case**: Modern API documentation portals

## 🚀 Quick Start

### Installation

```bash
# Install Swagger dependencies
npm install swagger-jsdoc swagger-ui-express express

# Install OpenAPI Generator
npm install -g @openapitools/openapi-generator-cli

# Install ReDoc
npm install redoc

# Install TypeScript types
npm install -D @types/express @types/node
```

### Basic Swagger Example

```typescript
import { SwaggerService } from './swagger-examples';

const swaggerService = new SwaggerService({
  title: 'My API',
  version: '1.0.0',
  description: 'A comprehensive API documentation',
  servers: [
    { url: 'http://localhost:3000', description: 'Development server' },
    { url: 'https://api.example.com', description: 'Production server' },
  ],
  tags: [
    { name: 'Users', description: 'User management operations' },
    { name: 'Auth', description: 'Authentication operations' },
  ],
});

// Initialize with Express
import express from 'express';
const app = express();

swaggerService.initialize(app);
```

### Basic OpenAPI Generator Example

```typescript
import { CodeGenerationService } from './openapi-generator-examples';

const generator = new CodeGenerationService({
  inputSpec: './api-spec.yaml',
  outputDir: './generated-client',
  generatorName: 'typescript-axios',
});

// Generate TypeScript client
await generator.generateTypeScriptClient('./api-spec.yaml', './generated-client', {
  modelPropertyNaming: 'camelCase',
  enumValueNaming: 'PascalCase',
  withInterfaces: true,
  prettier: true,
});
```

### Basic ReDoc Example

```typescript
import { ReDocService } from './redoc-examples';

const redocService = new ReDocService({
  spec: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'A comprehensive API',
    },
    paths: {
      '/users': {
        get: {
          summary: 'Get users',
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  title: 'My API Documentation',
  theme: {
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
    },
  },
});

redocService.initialize();
redocService.generateDocumentation('./docs/index.html');
```

## 📚 Detailed Examples

### Swagger/OpenAPI Implementation

The Swagger implementation includes:

- **Configuration Management**: Complete OpenAPI 3.0 specification support
- **Schema Definitions**: Reusable schema components and validation
- **Route Documentation**: Automatic documentation from decorators
- **Middleware Integration**: Express middleware for validation
- **Security Schemes**: Authentication and authorization documentation
- **Custom Templates**: Flexible template system for customization

```typescript
// Advanced Swagger usage
const swaggerService = new SwaggerService({
  title: 'E-commerce API',
  version: '2.0.0',
  description: 'Complete e-commerce platform API',
  security: [
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT Authentication',
    },
    {
      type: 'apiKey',
      scheme: 'apiKey',
      description: 'API Key Authentication',
    },
  ],
  components: {
    schemas: {
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', minLength: 1, maxLength: 100 },
          price: { type: 'number', minimum: 0 },
          category: { type: 'string', enum: ['electronics', 'clothing', 'books'] },
          inStock: { type: 'boolean' },
        },
        required: ['id', 'name', 'price', 'category'],
      },
    },
  },
});

// Document routes with decorators
class ProductController {
  @Get('/products/{id}', {
    summary: 'Get product by ID',
    tags: ['Products'],
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string', format: 'uuid' },
      },
    ],
    responses: {
      '200': {
        description: 'Product retrieved successfully',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Product' },
          },
        },
      },
    },
  })
  async getProduct(req: Request, res: Response) {
    const { id } = req.params;
    const product = await productService.getById(id);
    res.json({ success: true, data: product });
  }
}
```

### OpenAPI Generator Implementation

The OpenAPI Generator implementation includes:

- **Multi-Language Support**: Generate clients for various languages
- **Custom Templates**: Template system for customization
- **Configuration Management**: Flexible configuration options
- **Post-Processing**: Code formatting, linting, and testing
- **CI/CD Integration**: Automated generation pipelines

```typescript
// Advanced OpenAPI Generator usage
const generator = new CodeGenerationService({
  inputSpec: './api-spec.yaml',
  outputDir: './generated',
  generatorName: 'typescript-axios',
});

// Generate with custom templates
await generator.generateProject({
  specPath: './api-spec.yaml',
  outputDir: './generated-project',
  generator: 'typescript-axios',
  config: {
    modelPropertyNaming: 'camelCase',
    enumValueNaming: 'PascalCase',
    withInterfaces: true,
    prettier: true,
    npmName: 'my-api-client',
    npmVersion: '1.0.0',
  },
  templates: [
    {
      name: 'react-hooks',
      description: 'React hooks for API calls',
      files: [
        {
          path: 'src/hooks/useApi.ts',
          type: 'supporting',
          content: `
import { useState, useEffect } from 'react';
import { ApiClient } from '../api';

export function useApi<T>(apiCall: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiCall]);

  return { data, loading, error };
}
          `,
        },
      ],
    },
  ],
  postProcessing: [
    { type: 'format', command: 'prettier --write' },
    { type: 'lint', command: 'eslint --fix' },
    { type: 'test', command: 'npm test' },
    { type: 'build', command: 'npm run build' },
  ],
});
```

### ReDoc Implementation

The ReDoc implementation includes:

- **Theme System**: Customizable themes and styling
- **Template Management**: Flexible template system
- **Configuration Options**: Extensive customization options
- **Multi-Language Support**: Internationalization capabilities
- **Interactive Features**: Search, filtering, and navigation

```typescript
// Advanced ReDoc usage
const redocService = new ReDocService({
  spec: apiSpec,
  title: 'API Documentation',
  description: 'Interactive API documentation',
  logo: {
    src: '/logo.png',
    href: 'https://example.com',
    altText: 'Company Logo',
  },
  theme: {
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545',
      link: '#007bff',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
      lineHeight: '1.6',
      fontWeight: '400',
    },
    spacing: {
      unit: 8,
      sectionHorizontal: 40,
      sectionVertical: 40,
    },
  },
  hideDownloadButton: false,
  expandSingleSchemaField: true,
  requiredPropsFirst: true,
  sortPropsAlphabetically: true,
  sortOperationsAlphabetically: true,
  sortTagsAlphabetically: true,
});

// Create custom template
redocService.registerTemplate({
  name: 'corporate',
  description: 'Corporate-style documentation',
  template: `
<!DOCTYPE html>
<html>
<head>
  <title>{{title}} - API Documentation</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Inter:300,400,700" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Inter, sans-serif;
      background-color: #f8f9fa;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{title}}</h1>
    <p>{{description}}</p>
  </div>
  <redoc spec-url="spec.json" hide-download-button></redoc>
  <script src="https://cdn.jsdelivr.net/npm/redoc@2.0.0/bundles/redoc.standalone.js"></script>
</body>
</html>
  `,
});

redocService.generateWithTemplate('corporate', './docs/corporate.html');
```

## 🔒 Security Best Practices

### API Documentation Security
- Use HTTPS for all documentation endpoints
- Implement authentication for sensitive APIs
- Sanitize all user inputs in examples
- Use proper CORS policies
- Implement rate limiting for documentation

### Code Generation Security
- Validate generated code for security vulnerabilities
- Use secure defaults for authentication
- Implement proper input validation
- Use secure HTTP clients
- Follow security best practices for target languages

### Documentation Access Control
- Implement role-based access to documentation
- Use API keys for documentation access
- Implement audit logging for documentation access
- Use secure hosting for documentation
- Implement proper authentication flows

## 🧪 Testing

### Unit Testing

```typescript
import { SwaggerService } from './swagger-examples';

describe('Swagger Service', () => {
  let swaggerService: SwaggerService;

  beforeEach(() => {
    swaggerService = new SwaggerService({
      title: 'Test API',
      version: '1.0.0',
    });
  });

  test('should generate valid OpenAPI spec', () => {
    const specs = swaggerService.getSpecs();
    
    expect(specs).toBeDefined();
    expect(specs.openapi).toBe('3.0.0');
    expect(specs.info.title).toBe('Test API');
  });

  test('should register schema correctly', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
      },
    };

    swaggerService.registerSchema('User', schema);
    const registeredSchema = swaggerService.getSchema('User');
    
    expect(registeredSchema).toEqual(schema);
  });
});
```

### Integration Testing

```typescript
import request from 'supertest';
import { app } from './app';

describe('API Documentation', () => {
  test('should serve Swagger UI', async () => {
    const response = await request(app)
      .get('/api-docs')
      .expect(200);
    
    expect(response.text).toContain('swagger-ui');
  });

  test('should serve OpenAPI JSON', async () => {
    const response = await request(app)
      .get('/api-docs.json')
      .expect(200);
    
    const spec = JSON.parse(response.text);
    expect(spec.openapi).toBe('3.0.0');
  });
});
```

## 📊 Monitoring and Analytics

### Documentation Usage Tracking

```typescript
// Track documentation usage
class DocumentationAnalytics {
  private events: Array<{
    type: string;
    timestamp: Date;
    data: any;
  }> = [];

  trackEvent(type: string, data: any): void {
    this.events.push({
      type,
      timestamp: new Date(),
      data,
    });
  }

  trackPageView(page: string): void {
    this.trackEvent('page_view', { page });
  }

  trackApiCall(endpoint: string, method: string): void {
    this.trackEvent('api_call', { endpoint, method });
  }

  trackSearch(query: string): void {
    this.trackEvent('search', { query });
  }

  getAnalytics(): any {
    const pageViews = this.events.filter(e => e.type === 'page_view').length;
    const apiCalls = this.events.filter(e => e.type === 'api_call').length;
    const searches = this.events.filter(e => e.type === 'search').length;

    return {
      pageViews,
      apiCalls,
      searches,
      totalEvents: this.events.length,
    };
  }
}
```

### Performance Monitoring

```typescript
// Monitor documentation performance
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  startTimer(name: string): () => void {
    const start = Date.now();
    return () => {
      const duration = Date.now() - start;
      
      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }
      
      this.metrics.get(name)!.push(duration);
    };
  }

  getMetrics(): any {
    const result: any = {};
    
    for (const [name, times] of this.metrics.entries()) {
      const total = times.reduce((sum, time) => sum + time, 0);
      const average = total / times.length;
      const min = Math.min(...times);
      const max = Math.max(...times);
      
      result[name] = {
        count: times.length,
        total,
        average,
        min,
        max,
      };
    }
    
    return result;
  }
}
```

## 🚀 Production Deployment

### Environment Configuration

```bash
# Swagger/OpenAPI
SWAGGER_TITLE=My API
SWAGGER_VERSION=1.0.0
SWAGGER_DESCRIPTION=API Documentation
SWAGGER_SERVERS=http://localhost:3000,https://api.example.com

# OpenAPI Generator
GENERATOR_INPUT_SPEC=./api-spec.yaml
GENERATOR_OUTPUT_DIR=./generated
GENERATOR_CONFIG_FILE=./generator-config.json

# ReDoc
REDOC_TITLE=API Documentation
REDOC_THEME=corporate
REDOC_HIDE_DOWNLOAD=false
```

### Docker Configuration

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Generate documentation
RUN npm run generate-docs

EXPOSE 3000

CMD ["npm", "start"]
```

### CI/CD Pipeline

```yaml
# GitHub Actions example
name: Generate API Documentation

on:
  push:
    paths:
      - 'api-spec.yaml'

jobs:
  generate-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Generate documentation
        run: npm run generate-docs
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

## 🛠️ Advanced Patterns

### Multi-Version Documentation

```typescript
// Support multiple API versions
class MultiVersionDocumentation {
  private versions: Map<string, any> = new Map();
  private defaultVersion: string = 'v1';

  addVersion(version: string, spec: any): void {
    this.versions.set(version, spec);
  }

  setDefaultVersion(version: string): void {
    if (this.versions.has(version)) {
      this.defaultVersion = version;
    }
  }

  getVersion(version?: string): any {
    return this.versions.get(version || this.defaultVersion);
  }

  getAllVersions(): string[] {
    return Array.from(this.versions.keys());
  }

  generateVersionedDocs(outputDir: string): void {
    for (const [version, spec] of this.versions.entries()) {
      const versionOutputDir = `${outputDir}/${version}`;
      // Generate documentation for each version
      this.generateDocumentation(spec, versionOutputDir);
    }
  }
}
```

### Dynamic Documentation

```typescript
// Dynamic documentation generation
class DynamicDocumentation {
  private specs: Map<string, any> = new Map();
  private watchers: Map<string, any> = new Map();

  watchSpec(specPath: string, callback: (spec: any) => void): void {
    const watcher = require('chokidar').watch(specPath);
    
    watcher.on('change', async () => {
      const spec = await this.loadSpec(specPath);
      this.specs.set(specPath, spec);
      callback(spec);
    });
    
    this.watchers.set(specPath, watcher);
  }

  async loadSpec(specPath: string): Promise<any> {
    const content = await require('fs').promises.readFile(specPath, 'utf8');
    return JSON.parse(content);
  }

  stopWatching(specPath: string): void {
    const watcher = this.watchers.get(specPath);
    if (watcher) {
      watcher.close();
      this.watchers.delete(specPath);
    }
  }
}
```

## 📚 Additional Resources

### Documentation
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger Documentation](https://swagger.io/tools/swagger-ui/)
- [OpenAPI Generator](https://openapi-generator.tech/)
- [ReDoc Documentation](https://redocly.github.io/redoc/)

### Best Practices
- [OpenAPI Best Practices](https://swagger.io/blog/api-design-best-practices/)
- [API Documentation Guidelines](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
- [REST API Design Guide](https://restfulapi.net/)

### Tools and Libraries
- [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc)
- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
- [@openapitools/openapi-generator-cli](https://www.npmjs.com/package/@openapitools/openapi-generator-cli)
- [redoc](https://www.npmjs.com/package/redoc)

## 🤝 Contributing

When contributing to this OpenAPI examples folder:

1. Follow OpenAPI 3.0 specification standards
2. Include comprehensive type definitions
3. Add proper validation and error handling
4. Include security considerations
5. Add tests for new functionality
6. Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: These examples are for educational purposes. Always review and adapt implementations for your specific use case and requirements.