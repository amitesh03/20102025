// Swagger TypeScript Examples - Advanced API Documentation with Swagger/OpenAPI
// This file demonstrates comprehensive TypeScript usage with Swagger/OpenAPI

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express, Request, Response, NextFunction } from 'express';

// ===== BASIC TYPES =====

// Swagger configuration
interface SwaggerConfig {
  definition: {
    openapi: string;
    info: {
      title: string;
      version: string;
      description?: string;
      termsOfService?: string;
      contact?: {
        name: string;
        url: string;
        email: string;
      };
      license?: {
        name: string;
        url: string;
      };
    };
    servers?: Array<{
      url: string;
      description: string;
    }>;
    components?: {
      schemas?: Record<string, any>;
      responses?: Record<string, any>;
      parameters?: Record<string, any>;
      examples?: Record<string, any>;
      requestBodies?: Record<string, any>;
      headers?: Record<string, any>;
      securitySchemes?: Record<string, any>;
      links?: Record<string, any>;
      callbacks?: Record<string, any>;
    };
    security?: Array<Record<string, string[]>>;
    tags?: Array<{
      name: string;
      description?: string;
      externalDocs?: {
        description: string;
        url: string;
      };
    }>;
    externalDocs?: {
      description: string;
      url: string;
    };
  };
  apis: string[];
}

// API documentation options
interface ApiDocOptions {
  title: string;
  version: string;
  description?: string;
  servers?: Array<{
    url: string;
    description: string;
  }>;
  tags?: Array<{
    name: string;
    description?: string;
  }>;
  security?: Array<{
    type: string;
    scheme?: string;
    bearerFormat?: string;
    description?: string;
  }>;
  components?: {
    schemas?: Record<string, any>;
    responses?: Record<string, any>;
    parameters?: Record<string, any>;
  };
}

// Route documentation
interface RouteDoc {
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: Array<{
    name: string;
    in: 'path' | 'query' | 'header' | 'cookie';
    description?: string;
    required?: boolean;
    schema: any;
    example?: any;
  }>;
  requestBody?: {
    description?: string;
    required?: boolean;
    content: Record<string, {
      schema: any;
      example?: any;
      examples?: Record<string, any>;
    }>;
  };
  responses?: Record<string, {
    description: string;
    content?: Record<string, {
      schema: any;
      example?: any;
      examples?: Record<string, any>;
    }>;
    headers?: Record<string, {
      description: string;
      schema: any;
    }>;
  }>;
  security?: Array<Record<string, string[]>>;
  deprecated?: boolean;
  operationId?: string;
}

// Schema definition
interface SchemaDefinition {
  type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
  format?: string;
  description?: string;
  example?: any;
  enum?: any[];
  items?: any;
  properties?: Record<string, any>;
  required?: string[];
  additionalProperties?: boolean | any;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  allOf?: any[];
  oneOf?: any[];
  anyOf?: any[];
  not?: any;
  $ref?: string;
}

// ===== SWAGGER MANAGER =====

class SwaggerManager {
  private config: SwaggerConfig;
  private specs: any;
  private schemas: Map<string, SchemaDefinition> = new Map();
  private routes: Map<string, RouteDoc> = new Map();

  constructor(options: ApiDocOptions) {
    this.config = this.buildSwaggerConfig(options);
    this.schemas = new Map();
    this.routes = new Map();
  }

  // ===== CONFIGURATION =====

  // Build Swagger configuration
  private buildSwaggerConfig(options: ApiDocOptions): SwaggerConfig {
    const securitySchemes: Record<string, any> = {};
    
    if (options.security) {
      for (const sec of options.security) {
        securitySchemes[sec.type] = {
          type: sec.type,
          scheme: sec.scheme,
          bearerFormat: sec.bearerFormat,
          description: sec.description,
        };
      }
    }

    return {
      definition: {
        openapi: '3.0.0',
        info: {
          title: options.title,
          version: options.version,
          description: options.description,
        },
        servers: options.servers || [
          {
            url: 'http://localhost:3000',
            description: 'Development server',
          },
        ],
        tags: options.tags || [],
        components: {
          schemas: options.components?.schemas || {},
          responses: options.components?.responses || {},
          parameters: options.components?.parameters || {},
          securitySchemes: Object.keys(securitySchemes).length > 0 ? securitySchemes : undefined,
        },
        security: options.security ? options.security.map(sec => ({ [sec.type]: [] })) : [],
      },
      apis: ['./src/routes/*.ts'], // Path to API routes
    };
  }

  // Generate Swagger specs
  generateSpecs(): any {
    this.specs = swaggerJsdoc(this.config);
    return this.specs;
  }

  // Setup Swagger UI middleware
  setupSwaggerUI(app: Express, path: string = '/api-docs'): void {
    if (!this.specs) {
      this.generateSpecs();
    }

    app.use(path, swaggerUi.serve);
    app.get(path, swaggerUi.setup(this.specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'API Documentation',
    }));
  }

  // Setup JSON specs endpoint
  setupSpecsEndpoint(app: Express, path: string = '/api-docs.json'): void {
    if (!this.specs) {
      this.generateSpecs();
    }

    app.get(path, (req: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(this.specs);
    });
  }

  // ===== SCHEMA MANAGEMENT =====

  // Register schema
  registerSchema(name: string, schema: SchemaDefinition): void {
    this.schemas.set(name, schema);
    
    // Update config with new schema
    if (!this.config.definition.components) {
      this.config.definition.components = {};
    }
    if (!this.config.definition.components.schemas) {
      this.config.definition.components.schemas = {};
    }
    
    this.config.definition.components.schemas[name] = schema;
  }

  // Get schema
  getSchema(name: string): SchemaDefinition | undefined {
    return this.schemas.get(name);
  }

  // Create common schemas
  createCommonSchemas(): void {
    // Error response schema
    this.registerSchema('ErrorResponse', {
      type: 'object',
      properties: {
        error: {
          type: 'string',
          description: 'Error message',
        },
        code: {
          type: 'string',
          description: 'Error code',
        },
        details: {
          type: 'object',
          description: 'Additional error details',
        },
      },
      required: ['error', 'code'],
    });

    // Success response schema
    this.registerSchema('SuccessResponse', {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          description: 'Success flag',
        },
        data: {
          type: 'object',
          description: 'Response data',
        },
        message: {
          type: 'string',
          description: 'Success message',
        },
      },
      required: ['success'],
    });

    // Pagination schema
    this.registerSchema('Pagination', {
      type: 'object',
      properties: {
        page: {
          type: 'integer',
          description: 'Current page number',
        },
        limit: {
          type: 'integer',
          description: 'Items per page',
        },
        total: {
          type: 'integer',
          description: 'Total number of items',
        },
        totalPages: {
          type: 'integer',
          description: 'Total number of pages',
        },
      },
      required: ['page', 'limit', 'total', 'totalPages'],
    });

    // User schema
    this.registerSchema('User', {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: 'User ID',
        },
        email: {
          type: 'string',
          format: 'email',
          description: 'User email',
        },
        name: {
          type: 'string',
          description: 'User name',
        },
        role: {
          type: 'string',
          enum: ['admin', 'user', 'moderator'],
          description: 'User role',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Creation date',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Last update date',
        },
      },
      required: ['id', 'email', 'name', 'role'],
    });
  }

  // ===== ROUTE DOCUMENTATION =====

  // Document route
  documentRoute(path: string, method: string, doc: RouteDoc): void {
    const key = `${method.toUpperCase()}:${path}`;
    this.routes.set(key, doc);
  }

  // Get route documentation
  getRouteDoc(path: string, method: string): RouteDoc | undefined {
    const key = `${method.toUpperCase()}:${path}`;
    return this.routes.get(key);
  }

  // Create route decorators
  createRouteDecorators(): any {
    return {
      // GET decorator
      Get: (path: string, doc?: RouteDoc) => {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
          this.documentRoute(path, 'GET', doc);
          return descriptor;
        };
      },

      // POST decorator
      Post: (path: string, doc?: RouteDoc) => {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
          this.documentRoute(path, 'POST', doc);
          return descriptor;
        };
      },

      // PUT decorator
      Put: (path: string, doc?: RouteDoc) => {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
          this.documentRoute(path, 'PUT', doc);
          return descriptor;
        };
      },

      // DELETE decorator
      Delete: (path: string, doc?: RouteDoc) => {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
          this.documentRoute(path, 'DELETE', doc);
          return descriptor;
        };
      },
    };
  }

  // ===== MIDDLEWARE =====

  // Create validation middleware
  createValidationMiddleware(schema: SchemaDefinition) {
    return (req: Request, res: Response, next: NextFunction) => {
      // Basic validation logic (in production, use a validation library like Joi or Zod)
      const { error } = this.validateRequest(req.body, schema);
      
      if (error) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error,
        });
      }
      
      next();
    };
  }

  // Validate request
  private validateRequest(data: any, schema: SchemaDefinition): { error?: string } {
    // Simplified validation - in production, use proper validation library
    if (schema.required) {
      for (const field of schema.required) {
        if (!(field in data)) {
          return { error: `Missing required field: ${field}` };
        }
      }
    }
    
    return {};
  }

  // ===== UTILITY METHODS =====

  // Generate example from schema
  generateExample(schema: SchemaDefinition): any {
    if (schema.example) {
      return schema.example;
    }

    switch (schema.type) {
      case 'string':
        return schema.format === 'email' ? 'user@example.com' : 'example string';
      case 'number':
      case 'integer':
        return 0;
      case 'boolean':
        return true;
      case 'array':
        return schema.items ? [this.generateExample(schema.items)] : [];
      case 'object':
        const example: any = {};
        if (schema.properties) {
          for (const [key, prop] of Object.entries(schema.properties)) {
            example[key] = this.generateExample(prop as SchemaDefinition);
          }
        }
        return example;
      default:
        return null;
    }
  }

  // Get configuration
  getConfig(): SwaggerConfig {
    return this.config;
  }

  // Get specs
  getSpecs(): any {
    if (!this.specs) {
      this.generateSpecs();
    }
    return this.specs;
  }

  // Update configuration
  updateConfig(updates: Partial<ApiDocOptions>): void {
    this.config = this.buildSwaggerConfig({
      title: this.config.definition.info.title,
      version: this.config.definition.info.version,
      description: this.config.definition.info.description,
      servers: this.config.definition.servers,
      tags: this.config.definition.tags,
      security: this.config.definition.security?.map(sec => {
        const type = Object.keys(sec)[0];
        return { type };
      }),
      components: this.config.definition.components,
      ...updates,
    });
  }
}

// ===== SWAGGER SERVICE =====

class SwaggerService {
  private manager: SwaggerManager;

  constructor(options: ApiDocOptions) {
    this.manager = new SwaggerManager(options);
  }

  // Initialize service
  initialize(app: Express): void {
    // Create common schemas
    this.manager.createCommonSchemas();

    // Setup Swagger UI
    this.manager.setupSwaggerUI(app);

    // Setup specs endpoint
    this.manager.setupSpecsEndpoint(app);
  }

  // Register schema
  registerSchema(name: string, schema: SchemaDefinition): void {
    this.manager.registerSchema(name, schema);
  }

  // Document route
  documentRoute(path: string, method: string, doc: RouteDoc): void {
    this.manager.documentRoute(path, method, doc);
  }

  // Create validation middleware
  createValidationMiddleware(schema: SchemaDefinition) {
    return this.manager.createValidationMiddleware(schema);
  }

  // Get decorators
  getDecorators() {
    return this.manager.createRouteDecorators();
  }

  // Get specs
  getSpecs() {
    return this.manager.getSpecs();
  }
}

// ===== EXAMPLE CONTROLLER =====

class UserController {
  private swaggerService: SwaggerService;

  constructor(swaggerService: SwaggerService) {
    this.swaggerService = swaggerService;
  }

  // Get user by ID
  async getUserById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    // Mock implementation
    const user = {
      id,
      email: 'user@example.com',
      name: 'John Doe',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: user,
    });
  }

  // Create user
  async createUser(req: Request, res: Response): Promise<void> {
    const userData = req.body;
    
    // Mock implementation
    const user = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully',
    });
  }

  // Update user
  async updateUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updateData = req.body;
    
    // Mock implementation
    const user = {
      id,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: user,
      message: 'User updated successfully',
    });
  }

  // Delete user
  async deleteUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    // Mock implementation
    res.json({
      success: true,
      message: `User ${id} deleted successfully`,
    });
  }

  // Get users list
  async getUsers(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 10 } = req.query;
    
    // Mock implementation
    const users = [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'user1@example.com',
        name: 'John Doe',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        email: 'user2@example.com',
        name: 'Jane Smith',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    res.json({
      success: true,
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: users.length,
        totalPages: Math.ceil(users.length / Number(limit)),
      },
    });
  }
}

// ===== ROUTE SETUP =====

function setupUserRoutes(app: Express, swaggerService: SwaggerService): void {
  const userController = new UserController(swaggerService);
  const decorators = swaggerService.getDecorators();

  // Document routes
  swaggerService.documentRoute('/users/{id}', 'GET', {
    summary: 'Get user by ID',
    description: 'Retrieve a user by their unique ID',
    tags: ['Users'],
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        description: 'User ID',
        schema: { type: 'string', format: 'uuid' },
      },
    ],
    responses: {
      '200': {
        description: 'User retrieved successfully',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/SuccessResponse' },
            example: {
              success: true,
              data: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                email: 'user@example.com',
                name: 'John Doe',
                role: 'user',
              },
            },
          },
        },
      },
      '404': {
        description: 'User not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: {
              error: 'User not found',
              code: 'USER_NOT_FOUND',
            },
          },
        },
      },
    },
  });

  swaggerService.documentRoute('/users', 'POST', {
    summary: 'Create a new user',
    description: 'Create a new user with the provided data',
    tags: ['Users'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/User' },
          example: {
            email: 'newuser@example.com',
            name: 'New User',
            role: 'user',
          },
        },
      },
    },
    responses: {
      '201': {
        description: 'User created successfully',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/SuccessResponse' },
          },
        },
      },
      '400': {
        description: 'Invalid input data',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
    },
  });

  // Setup routes
  app.get('/users/:id', userController.getUserById.bind(userController));
  app.post('/users', 
    swaggerService.createValidationMiddleware({
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        name: { type: 'string' },
        role: { type: 'string', enum: ['admin', 'user', 'moderator'] },
      },
      required: ['email', 'name', 'role'],
    }),
    userController.createUser.bind(userController)
  );
  app.put('/users/:id', userController.updateUser.bind(userController));
  app.delete('/users/:id', userController.deleteUser.bind(userController));
  app.get('/users', userController.getUsers.bind(userController));
}

// ===== EXERCISES =====

/*
EXERCISE 1: Create a Swagger plugin system that:
- Supports custom schema validators
- Provides middleware for authentication
- Implements response transformation
- Supports custom UI themes
- Is fully typed

EXERCISE 2: Build a Swagger code generator that:
- Generates TypeScript interfaces from schemas
- Creates API client code
- Generates mock data from schemas
- Supports multiple output formats
- Is fully typed

EXERCISE 3: Create a Swagger testing system that:
- Generates test cases from API specs
- Supports automated API testing
- Provides test data generation
- Implements test reporting
- Is fully typed

EXERCISE 4: Build a Swagger documentation system that:
- Supports multi-language documentation
- Provides interactive API exploration
- Implements versioning support
- Supports custom documentation themes
- Is fully typed

EXERCISE 5: Create a Swagger analytics system that:
- Tracks API usage from documentation
- Provides usage analytics
- Monitors API performance
- Supports custom metrics collection
- Is fully typed
*/

// Export classes and interfaces
export { SwaggerManager, SwaggerService, UserController };

// Export types
export type {
  SwaggerConfig,
  ApiDocOptions,
  RouteDoc,
  SchemaDefinition,
};