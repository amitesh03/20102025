import React, { useState } from 'react';
import { CodeBlock, InteractiveDemo, NavigationTabs } from '../../components';

const NestJSExamples = () => {
  const [activeTab, setActiveTab] = useState('setup');

  const tabs = [
    { id: 'setup', label: 'Setup' },
    { id: 'controllers', label: 'Controllers' },
    { id: 'services', label: 'Services' },
    { id: 'modules', label: 'Modules' },
    { id: 'dependency-injection', label: 'Dependency Injection' },
    { id: 'middleware', label: 'Middleware' },
    { id: 'decorators', label: 'Decorators' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'setup':
        return (
          <div>
            <h3>NestJS Setup</h3>
            <p>NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications:</p>
            
            <CodeBlock
              title="Install NestJS CLI"
              language="bash"
              code={`# Install NestJS CLI globally
npm i -g @nestjs/cli

# Create a new NestJS project
nest new project-name

# Navigate to project directory
cd project-name

# Install dependencies
npm install

# Run the application
npm run start:dev`}
            />
            
            <CodeBlock
              title="Basic NestJS Application Structure"
              language="typescript"
              code={`// src/main.ts - Application entry point
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();

// src/app.module.ts - Root module
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}`}
            />
            
            <CodeBlock
              title="Package.json Scripts"
              language="json"
              code={`{
  "name": "nest-app",
  "version": "0.0.1",
  "description": "NestJS application example",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand"
  }
}`}
            />
          </div>
        );
        
      case 'controllers':
        return (
          <div>
            <h3>Controllers in NestJS</h3>
            <p>Controllers handle incoming requests and return responses to the client:</p>
            
            <CodeBlock
              title="Basic Controller"
              language="typescript"
              code={`import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('users')
export class UsersController {
  constructor(private readonly appService: AppService) {}

  @Get()
  findAll() {
    return this.appService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: any) {
    return this.appService.create(createUserDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.appService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appService.remove(id);
  }
}`}
            />
            
            <CodeBlock
              title="Controller with Response Status Codes"
              language="typescript"
              code={`import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return { users: [] };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: any) {
    return { message: 'User created', user: createUserDto };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const user = { id, name: \`User \${id}\` };
    return user;
  }

  @Post(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    // Update user logic
    return;
  }
}`}
            />
            
            <CodeBlock
              title="Controller with Headers and Cookies"
              language="typescript"
              code={`import { Controller, Get, Post, Body, Res, Req, Headers } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('profile')
  getProfile(@Headers('authorization') authorization: string) {
    // Process authorization header
    if (!authorization) {
      return { error: 'No authorization header' };
    }
    
    // Validate token and return user profile
    return { user: { id: 1, name: 'John Doe' } };
  }

  @Post('login')
  login(
    @Body() loginDto: any,
    @Res({ passthrough: true }) response: any
  ) {
    // Authenticate user
    const token = 'jwt-token-example';
    
    // Set cookie
    response.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3600 * 1000 // 1 hour
    });
    
    return { message: 'Login successful' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: any) {
    // Clear cookie
    response.clearCookie('access_token');
    return { message: 'Logout successful' };
  }
}`}
            />
          </div>
        );
        
      case 'services':
        return (
          <div>
            <h3>Services in NestJS</h3>
            <p>Services contain business logic and are typically injected into controllers:</p>
            
            <CodeBlock
              title="Basic Service"
              language="typescript"
              code={`import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    return this.users.find(user => user.id === parseInt(id));
  }

  create(createUserDto: any) {
    const newUser = {
      id: this.users.length + 1,
      ...createUserDto,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: string, updateUserDto: any) {
    const userIndex = this.users.findIndex(user => user.id === parseInt(id));
    if (userIndex >= 0) {
      this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
      return this.users[userIndex];
    }
    return null;
  }

  remove(id: string) {
    const userIndex = this.users.findIndex(user => user.id === parseInt(id));
    if (userIndex >= 0) {
      this.users.splice(userIndex, 1);
      return true;
    }
    return false;
  }
}`}
            />
            
            <CodeBlock
              title="Service with External Dependencies"
              language="typescript"
              code={`import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    return await this.databaseService.query('SELECT * FROM users');
  }

  async findOne(id: string) {
    const result = await this.databaseService.query(
      'SELECT * FROM users WHERE id = ?', 
      [id]
    );
    return result[0] || null;
  }

  async create(createUserDto: any) {
    const { name, email } = createUserDto;
    const result = await this.databaseService.query(
      'INSERT INTO users (name, email, created_at) VALUES (?, ?, ?) RETURNING *',
      [name, email, new Date()]
    );
    return result[0];
  }

  async update(id: string, updateUserDto: any) {
    const fields = Object.keys(updateUserDto)
      .map((key, index) => \`\${key} = ?\`)
      .join(', ');
    
    const values = Object.values(updateUserDto);
    values.push(id);
    
    await this.databaseService.query(
      \`UPDATE users SET \${fields} WHERE id = ?\`,
      values
    );
    
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.databaseService.query(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return true;
  }
}`}
            />
            
            <CodeBlock
              title="Service with Error Handling"
              language="typescript"
              code={`import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';

@Injectable()
export class UserService {
  async findOne(id: string) {
    const user = await this.findUserById(id);
    
    if (!user) {
      throw new NotFoundException(\`User with ID \${id} not found\`);
    }
    
    return user;
  }

  async create(createUserDto: any) {
    const existingUser = await this.findUserByEmail(createUserDto.email);
    
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    
    const newUser = await this.createUserInDatabase(createUserDto);
    return newUser;
  }

  private async findUserById(id: string) {
    // Database query to find user by ID
    return { id, name: 'John Doe' }; // Simplified
  }

  private async findUserByEmail(email: string) {
    // Database query to find user by email
    return null; // Simplified
  }

  private async createUserInDatabase(createUserDto: any) {
    // Database query to create user
    return { id: 1, ...createUserDto, createdAt: new Date() }; // Simplified
  }
}`}
            />
          </div>
        );
        
      case 'modules':
        return (
          <div>
            <h3>Modules in NestJS</h3>
            <p>Modules are the basic building blocks of a NestJS application:</p>
            
            <CodeBlock
              title="Basic Module"
              language="typescript"
              code={`import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}`}
            />
            
            <CodeBlock
              title="Module with Imports and Exports"
              language="typescript"
              code={`import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}`}
            />
            
            <CodeBlock
              title="Dynamic Module"
              language="typescript"
              code={`import { Module, DynamicModule } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({})
export class DatabaseModule {
  static forRoot(config: any): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_CONFIG',
          useValue: config,
        },
      ],
      exports: ['DATABASE_CONFIG'],
    };
  }

  static forFeature(feature: string): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_FEATURE',
          useValue: feature,
        },
      ],
      exports: ['DATABASE_FEATURE'],
    };
  }
}

// Usage in another module
@Module({
  imports: [
    DatabaseModule.forRoot({
      host: 'localhost',
      port: 5432,
      database: 'myapp',
    }),
    DatabaseModule.forFeature('users'),
  ],
})
export class AppModule {}`}
            />
            
            <CodeBlock
              title="Global Module"
              language="typescript"
              code={`import { Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}

// Now ConfigService is available throughout the application
// without needing to import ConfigModule in other modules`}
            />
          </div>
        );
        
      case 'dependency-injection':
        return (
          <div>
            <h3>Dependency Injection in NestJS</h3>
            <p>NestJS uses a powerful dependency injection system based on TypeScript decorators:</p>
            
            <CodeBlock
              title="Constructor Injection"
              language="typescript"
              code={`import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}
  
  async findAll() {
    return await this.databaseService.query('SELECT * FROM users');
  }
}

@Injectable()
export class UsersController {
  constructor(private readonly userService: UserService) {}
  
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }
}`}
            />
            
            <CodeBlock
              title="Property Injection"
              language="typescript"
              code={`import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(@Inject('DATABASE_CONNECTION') private readonly db: any) {}
  
  async findAll() {
    return await this.db.query('SELECT * FROM users');
  }
}

// In module
@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useValue: databaseConnection,
    },
    UserService,
  ],
})
export class UsersModule {}`}
            />
            
            <CodeBlock
              title="Custom Provider"
              language="typescript"
              code={`import { Module, Provider } from '@nestjs/common';

// Factory provider
const databaseProvider: Provider = {
  provide: 'DATABASE_CONNECTION',
  useFactory: async (configService: ConfigService) => {
    const config = configService.getDatabaseConfig();
    return await createDatabaseConnection(config);
  },
  inject: [ConfigService],
};

// Class provider
const configProvider: Provider = {
  provide: ConfigService,
  useClass: ConfigService,
};

// Value provider
const apiKeyProvider: Provider = {
  provide: 'API_KEY',
  useValue: process.env.API_KEY,
};

@Module({
  providers: [
    databaseProvider,
    configProvider,
    apiKeyProvider,
  ],
})
export class AppModule {}`}
            />
            
            <CodeBlock
              title="Async Provider"
              language="typescript"
              code={`import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: 'ASYNC_CONNECTION',
      useFactory: async () => {
        // Async initialization
        const connection = await createAsyncConnection();
        return connection;
      },
    },
  ],
})
export class DatabaseModule {}

// Or with async factory
@Module({
  providers: [
    {
      provide: 'ASYNC_CONNECTION',
      useFactory: async (options: any) => {
        return await createConnectionWithConfig(options);
      },
      inject: ['CONNECTION_OPTIONS'],
    },
  ],
})
export class DatabaseModule {}`}
            />
          </div>
        );
        
      case 'middleware':
        return (
          <div>
            <h3>Middleware in NestJS</h3>
            <p>Middleware functions are executed before the route handler and can modify the request and response:</p>
            
            <CodeBlock
              title="Basic Middleware"
              language="typescript"
              code={`import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(\`\${req.method} \${req.url}\`);
    next();
  }
}

// Apply middleware in module
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';

@Module({
  // ...
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}`}
            />
            
            <CodeBlock
              title="Route-specific Middleware"
              language="typescript"
              code={`import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Verify token (simplified)
    try {
      req.user = { id: 1, name: 'John Doe' };
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
}

// Apply to specific routes
@Module({
  // ...
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('users')
      .exclude(
        { path: 'users/login', method: RequestMethod.POST },
        { path: 'users/register', method: RequestMethod.POST }
      );
  }
}`}
            />
            
            <CodeBlock
              title="Functional Middleware"
              language="typescript"
              code={`import { NestModule, MiddlewareConsumer } from '@nestjs/common';

// Functional middleware
export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(\`\${req.method} \${req.url}\`);
  next();
}

// Apply functional middleware
@Module({
  // ...
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(logger)
      .forRoutes('*');
  }
}`}
            />
          </div>
        );
        
      case 'decorators':
        return (
          <div>
            <h3>Decorators in NestJS</h3>
            <p>NestJS uses decorators to define routes, parameters, and other metadata:</p>
            
            <CodeBlock
              title="HTTP Method Decorators"
              language="typescript"
              code={`import { Controller, Get, Post, Put, Delete, Patch, Headers, Param, Query, Body } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return [];
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id, name: \`User \${id}\` };
  }

  @Post()
  create(@Body() createUserDto: any) {
    return { message: 'User created', user: createUserDto };
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: any
  ) {
    return { message: \`User \${id} updated\`, user: updateUserDto };
  }

  @Patch(':id')
  partialUpdate(
    @Param('id') id: string,
    @Body() updateUserDto: any
  ) {
    return { message: \`User \${id} partially updated\`, user: updateUserDto };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return { message: \`User \${id} deleted\` };
  }

  @Get('search')
  search(@Query('q') query: string) {
    return { results: [\`Results for \${query}\`] };
  }

  @Get('profile')
  getProfile(@Headers('authorization') auth: string) {
    return { token: auth };
  }
}`}
            />
            
            <CodeBlock
              title="Custom Decorators"
              language="typescript"
              code={`import { SetMetadata } from '@nestjs/common';

// Custom decorator for roles
export const Roles = (...roles: string[]) => SetMetadata('roles', roles, target);

// Custom decorator for validation
export const Validate = (schema: any) => SetMetadata('validation', schema, target);

// Usage
@Controller('admin')
@Roles('admin')
export class AdminController {
  @Get()
  @Validate(userSchema)
  getUsers() {
    return [];
  }
}

// Custom parameter decorator
export const User = () => (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
  SetMetadata('user', true, target, propertyKey);
};

// Usage
@Controller()
export class UsersController {
  @Get()
  getUser(@User() user: any) {
    return user;
  }
}`}
            />
            
            <CodeBlock
              title="Response Decorators"
              language="typescript"
              code={`import { Controller, Get, Post, Body, HttpCode, HttpStatus, Header, Redirect } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'no-cache')
  findAll() {
    return [];
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Location', '/users/1')
  create(@Body() createUserDto: any) {
    return { message: 'User created', user: createUserDto };
  }

  @Get('old-path')
  @Redirect('/new-path', 301)
  oldPath() {
    return 'This page has moved';
  }

  @Get('download')
  download(@Res({ passthrough: true }) res: any) {
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="file.txt"',
    });
    
    res.end('File content');
    return;
  }
}`}
            />
          </div>
        );
        
      default:
        return <div>Select a tab to view examples</div>;
    }
  };

  return (
    <div className="examples-container">
      <h2>NestJS Examples</h2>
      <p>
        NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. 
        It uses TypeScript, combines elements of OOP, FP, and FRP, and is built with Express or Fastify.
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
          <li><a href="https://nestjs.com/" target="_blank" rel="noopener noreferrer">Official NestJS Documentation</a></li>
          <li><a href="https://github.com/nestjs/nest" target="_blank" rel="noopener noreferrer">NestJS GitHub Repository</a></li>
          <li><a href="https://docs.nestjs.com/" target="_blank" rel="noopener noreferrer">NestJS API Reference</a></li>
        </ul>
      </div>
    </div>
  );
};

export default NestJSExamples;