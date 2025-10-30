# Zod TypeScript Examples

This folder contains comprehensive examples of using Zod for schema validation and type inference in TypeScript applications.

## 📚 What is Zod?

Zod is a TypeScript-first schema declaration and validation library. It allows you to define schemas for your data structures and automatically infer TypeScript types from them.

## 🚀 Key Features Demonstrated

### 1. Basic Schema Validation
- String validation with regex patterns
- Number validation with ranges and constraints
- Email and URL validation
- Date parsing and transformation
- Phone number formatting

### 2. Advanced Schema Patterns
- Object schemas with nested validation
- Array and tuple validation
- Union and discriminated union types
- Optional and nullable fields
- Default values

### 3. Schema Composition
- Schema extension and inheritance
- Schema merging and composition
- Partial and pick/omit operations
- Schema transformation pipelines

### 4. Custom Validation
- Custom refinement functions
- Cross-field validation
- Async validation
- Conditional validation logic

### 5. Error Handling
- Detailed error messages
- Custom error formatting
- Localization support
- Error path tracking

## 📁 File Structure

```
zod/
├── README.md              # This documentation
├── examples.ts            # Comprehensive Zod examples
└── exercises/             # Practice exercises (coming soon)
    ├── basic-validation/
    ├── advanced-patterns/
    └── real-world-scenarios/
```

## 🛠️ Installation

```bash
npm install zod
npm install @hookform/resolvers zod react-hook-form  # For React integration
```

## 📖 Usage Examples

### Basic Validation

```typescript
import { z } from 'zod';

// Define a schema
const UserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().min(18).max(120),
});

// Infer TypeScript type
type User = z.infer<typeof UserSchema>;

// Validate data
const user = UserSchema.parse({
  name: "John Doe",
  email: "john@example.com",
  age: 30
});
```

### Advanced Validation

```typescript
// Custom validation
const PasswordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain uppercase letter")
  .regex(/[a-z]/, "Must contain lowercase letter")
  .regex(/[0-9]/, "Must contain number")
  .regex(/[^A-Za-z0-9]/, "Must contain special character");

// Cross-field validation
const PasswordConfirmationSchema = z.object({
  password: PasswordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
```

### Schema Composition

```typescript
// Base schema
const BaseUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});

// Extended schema
const AdminUserSchema = BaseUserSchema.extend({
  role: z.literal('admin'),
  permissions: z.array(z.string()),
});

// Partial schema for updates
const UserUpdateSchema = BaseUserSchema.partial();
```

### Error Handling

```typescript
// Safe parsing
const result = UserSchema.safeParse(data);

if (result.success) {
  // Data is valid
  console.log(result.data);
} else {
  // Handle validation errors
  console.error(result.error.errors);
  console.error(result.error.format());
}
```

## 🎯 Real-World Applications

### 1. API Validation
- Request body validation
- Response schema validation
- Query parameter validation
- Environment variable validation

### 2. Form Validation
- React Hook Form integration
- Multi-step forms
- Conditional validation
- Real-time validation

### 3. Database Models
- Type-safe database operations
- Data transformation
- Migration schemas
- Validation layers

### 4. Configuration Management
- Environment variable validation
- Configuration file parsing
- Default value handling
- Type-safe configuration

## 🔧 Advanced Patterns

### Discriminated Unions

```typescript
const EventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('user.created'),
    userId: z.string().uuid(),
    userName: z.string(),
  }),
  z.object({
    type: z.literal('user.updated'),
    userId: z.string().uuid(),
    changes: z.record(z.string(), z.any()),
  }),
]);
```

### Schema Transformation

```typescript
const TrimmedStringSchema = z.string()
  .transform((val) => val.trim())
  .transform((val) => val.replace(/\s+/g, ' '));

const CapitalizedNameSchema = z.string()
  .transform((val) => val.trim())
  .transform((val) => val.toLowerCase())
  .transform((val) => val.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' '));
```

### Async Validation

```typescript
const UniqueEmailSchema = z.string()
  .email()
  .refine(
    async (email) => {
      // Check database for existing email
      const exists = await checkEmailExists(email);
      return !exists;
    },
    {
      message: "Email is already taken",
    }
  );
```

## 🧪 Testing with Zod

```typescript
import { z } from 'zod';

// Test schema validation
describe('UserSchema', () => {
  it('should validate valid user data', () => {
    const validUser = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
    };
    
    expect(() => UserSchema.parse(validUser)).not.toThrow();
  });

  it('should reject invalid email', () => {
    const invalidUser = {
      name: 'John Doe',
      email: 'invalid-email',
      age: 30,
    };
    
    expect(() => UserSchema.parse(invalidUser)).toThrow();
  });
});
```

## 🔗 Integration Examples

### React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Express.js Middleware

```typescript
import express from 'express';
import { z } from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

const validateRequest = (schema: z.ZodSchema) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors,
        });
      } else {
        next(error);
      }
    }
  };
};

app.post('/users', validateRequest(CreateUserSchema), (req, res) => {
  // req.body is now validated and typed
  res.json({ success: true, user: req.body });
});
```

## 📋 Best Practices

### 1. Schema Organization
- Keep schemas in separate files
- Export related schemas together
- Use descriptive names
- Add descriptions for documentation

### 2. Error Handling
- Use safeParse for user input
- Provide clear error messages
- Format errors for UI display
- Log validation errors for debugging

### 3. Performance
- Reuse schemas when possible
- Use lazy validation for large objects
- Cache validation results
- Avoid unnecessary transformations

### 4. Type Safety
- Always infer types from schemas
- Use branded types for IDs
- Validate external data at boundaries
- Keep types and schemas in sync

## 🚀 Advanced Topics

### 1. Schema Composition Patterns
- Mixin patterns for reusable validation
- Plugin architecture for extensible schemas
- Conditional schema building
- Dynamic schema generation

### 2. Performance Optimization
- Validation caching strategies
- Lazy evaluation techniques
- Batch validation operations
- Memory-efficient validation

### 3. Integration Patterns
- Database ORM integration
- API client validation
- Form library integration
- Testing framework integration

### 4. Error Handling Strategies
- Custom error types
- Error aggregation
- Localization support
- User-friendly error messages

## 📚 Additional Resources

### Official Documentation
- [Zod Documentation](https://zod.dev/)
- [Zod GitHub](https://github.com/colinhacks/zod)
- [Zod Discord](https://discord.gg/zod)

### Community Resources
- [Zod Examples](https://github.com/colinhacks/zod/tree/master/examples)
- [Zod Recipes](https://github.com/colinhacks/zod/discussions/categories/recipes)
- [Zod Stack Overflow](https://stackoverflow.com/questions/tagged/zod)

### Integration Guides
- [React Hook Form + Zod](https://react-hook-form.com/get-started#TypeScript)
- [Express.js + Zod](https://github.com/total-typescript/zod-express)
- [Fastify + Zod](https://github.com/fastify/fastify-type-provider-zod)

## 🤝 Contributing

When contributing to this examples repository:

1. Follow the existing code style
2. Add comprehensive comments
3. Include TypeScript types
4. Provide usage examples
5. Add tests for new schemas

## 📄 License

This project is for educational purposes and follows the MIT license.