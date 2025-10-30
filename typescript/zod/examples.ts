// Zod Examples - Advanced Schema Validation and Type Inference
// This file demonstrates comprehensive Zod features for modern TypeScript development

import { z } from 'zod';

// ===== BASIC SCHEMAS =====

// String schema with comprehensive validation
const NameSchema = z.string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
  .transform((val: string) => val.trim())
  .describe("User's full name");

// Number schema with advanced validation
const AgeSchema = z.number()
  .min(18, "Must be at least 18 years old")
  .max(120, "Must be less than 120 years old")
  .int("Age must be an integer")
  .positive("Age must be positive")
  .describe("User's age in years");

// Email schema with domain validation
const EmailSchema = z.string()
  .email("Invalid email address")
  .refine((email: string) => {
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com'];
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain || '');
  }, "Email domain not allowed")
  .transform((email: string) => email.toLowerCase())
  .describe("User's email address");

// Phone number schema
const PhoneSchema = z.string()
  .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
  .min(10, "Phone number must be at least 10 digits")
  .max(20, "Phone number too long")
  .transform((phone: string) => phone.replace(/\s/g, ''))
  .describe("User's phone number");

// URL schema with protocol validation
const UrlSchema = z.string()
  .url("Invalid URL format")
  .refine((url: string) => url.startsWith('https://'), "URL must use HTTPS")
  .describe("Secure URL");

// Date schema with multiple formats
const DateSchema = z.string()
  .refine((date: string) => {
    // Check ISO format
    if (!isNaN(Date.parse(date))) return true;
    
    // Check DD/MM/YYYY format
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(date)) return false;
    
    const [day, month, year] = date.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.getDate() === day && dateObj.getMonth() === month - 1 && dateObj.getFullYear() === year;
  }, {
    message: "Invalid date format. Use ISO format or DD/MM/YYYY",
  })
  .transform((date: string) => {
    // Convert to ISO format
    if (date.includes('/')) {
      const [day, month, year] = date.split('/');
      return new Date(`${year}-${month}-${day}`).toISOString();
    }
    return new Date(date).toISOString();
  })
  .describe("Date in ISO or DD/MM/YYYY format");

// ===== OBJECT SCHEMAS =====

// User schema with comprehensive validation
const UserSchema = z.object({
  id: z.string().uuid("Invalid UUID format").describe("Unique user identifier"),
  name: NameSchema,
  age: AgeSchema,
  email: EmailSchema,
  phone: PhoneSchema.optional().nullable(),
  avatar: UrlSchema.optional().nullable(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
  isActive: z.boolean().default(true).describe("Account status"),
  role: z.enum(['admin', 'user', 'moderator', 'guest'], {
    errorMap: (issue: any, ctx: any) => ({
      message: "Invalid role. Must be: admin, user, moderator, or guest"
    })
  }).default('user').describe("User role"),
  tags: z.array(z.string().min(1).max(20)).default([]).describe("User tags"),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']).default('light'),
    language: z.string().min(2).max(5).default('en'),
    notifications: z.boolean().default(true),
    privacy: z.enum(['public', 'friends', 'private']).default('private'),
  }).default({}).describe("User preferences"),
  metadata: z.record(z.string(), z.any()).optional().describe("Additional metadata"),
});

// Infer TypeScript type from schema
type User = z.infer<typeof UserSchema>;

// ===== ADVANCED SCHEMAS =====

// Schema with conditional validation
const PasswordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
  .transform((password: string) => password.trim())
  .describe("Secure password");

// Password confirmation with cross-field validation
const PasswordConfirmationSchema = z.object({
  password: PasswordSchema,
  confirmPassword: z.string(),
}).refine((data: any) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Schema with unions and discriminated unions
const StatusSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('pending'),
    reason: z.string().optional(),
  }),
  z.object({
    type: z.literal('approved'),
    approvedBy: z.string(),
    approvedAt: z.date(),
  }),
  z.object({
    type: z.literal('rejected'),
    reason: z.string(),
    rejectedBy: z.string(),
    rejectedAt: z.date(),
  }),
]);

// Schema with intersections
const BaseUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
});

const AdminUserSchema = BaseUserSchema.extend({
  role: z.literal('admin'),
  permissions: z.array(z.string()),
  adminLevel: z.number().min(1).max(10),
  lastLoginAt: z.date().optional(),
});

const RegularUserSchema = BaseUserSchema.extend({
  role: z.literal('user'),
  subscription: z.enum(['free', 'premium', 'enterprise']),
  subscriptionExpiresAt: z.date().optional(),
});

// Schema with transformations
const TrimmedStringSchema = z.string()
  .transform((val: string) => val.trim())
  .transform((val: string) => val.replace(/\s+/g, ' '));

const LowercaseEmailSchema = z.string()
  .email()
  .transform((val: string) => val.toLowerCase().trim());

const CapitalizedNameSchema = z.string()
  .transform((val: string) => val.trim())
  .transform((val: string) => val.toLowerCase())
  .transform((val: string) => val.split(' ').map((word: string) => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' '));

// Schema with async validation
const UniqueEmailSchema = z.string()
  .email()
  .refine(
    async (email: string) => {
      // Simulate async database check
      await new Promise(resolve => setTimeout(resolve, 100));
      const takenEmails = ['taken@example.com', 'used@example.com'];
      return !takenEmails.includes(email);
    },
    {
      message: "Email is already taken",
    }
  );

// ===== NESTED SCHEMAS =====

// Address schema
const AddressSchema = z.object({
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  country: z.string().default('US'),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
});

// Complete user profile with nested address
const UserProfileSchema = UserSchema.extend({
  profile: z.object({
    bio: z.string().max(500).optional(),
    avatar: UrlSchema.nullable(),
    socialLinks: z.object({
      twitter: z.string().optional(),
      github: z.string().optional(),
      linkedin: z.string().optional(),
    }).optional(),
  }),
  address: AddressSchema,
  preferences: z.object({
    theme: z.enum(['light', 'dark']).default('light'),
    notifications: z.boolean().default(true),
    language: z.string().default('en'),
    timezone: z.string().default('UTC'),
  }),
});

// ===== ARRAY AND TUPLE SCHEMAS =====

// Array schema with validation
const TagsSchema = z.array(z.string().min(1).max(20)).min(1).max(5);
const ScoresSchema = z.array(z.number().min(0).max(100));

// Tuple schema (fixed length array)
const CoordinatesSchema = z.tuple([
  z.number(), // x
  z.number(), // y
  z.number().optional(), // z (optional)
]);

// ===== RECORD AND MAP SCHEMAS =====

// Record schema (object with dynamic keys)
const MetadataSchema = z.record(z.string(), z.string());

// Map schema
const UserMapSchema = z.map(z.string(), UserSchema);

// ===== DISCRIMINATED UNIONS =====

// Schema for polymorphic data
const BaseEventSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.date(),
  type: z.string(),
});

const UserCreatedEventSchema = BaseEventSchema.extend({
  type: z.literal('user.created'),
  userId: z.string().uuid(),
  userName: z.string(),
  userEmail: z.string().email(),
});

const UserUpdatedEventSchema = BaseEventSchema.extend({
  type: z.literal('user.updated'),
  userId: z.string().uuid(),
  changes: z.record(z.string(), z.any()),
});

const UserDeletedEventSchema = BaseEventSchema.extend({
  type: z.literal('user.deleted'),
  userId: z.string().uuid(),
  deletedBy: z.string().uuid(),
});

const EventSchema = z.discriminatedUnion('type', [
  UserCreatedEventSchema,
  UserUpdatedEventSchema,
  UserDeletedEventSchema,
]);

// ===== USAGE EXAMPLES =====

// Example 1: Basic validation with detailed error handling
function validateUser(data: unknown): User {
  try {
    return UserSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors);
      
      // Format errors for user display
      const formattedErrors = error.errors.reduce((acc, err) => {
        const path = err.path.join('.');
        acc[path] = err.message;
        return acc;
      }, {} as Record<string, string>);
      
      throw new Error(`Validation failed: ${JSON.stringify(formattedErrors)}`);
    }
    throw error;
  }
}

// Example 2: Safe parsing with result object
function safeValidateUser(data: unknown) {
  const result = UserSchema.safeParse(data);
  
  if (result.success) {
    return { 
      success: true, 
      data: result.data,
      warnings: [] as string[]
    };
  } else {
    return { 
      success: false, 
      errors: result.error.errors,
      formattedErrors: result.error.format(),
      summary: result.error.issues.map(issue => issue.message).join(', ')
    };
  }
}

// Example 3: Partial updates with type safety
const UserUpdateSchema = UserSchema.partial();
type UserUpdate = z.infer<typeof UserUpdateSchema>;

function updateUser(userId: string, updates: UserUpdate): User {
  // Validate partial update data
  const validatedUpdates = UserUpdateSchema.parse(updates);
  
  // Mock user update logic
  console.log(`Updating user ${userId} with:`, validatedUpdates);
  
  // Return updated user (mock)
  return {
    id: userId,
    name: 'John Doe',
    age: 30,
    email: 'john@example.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    role: 'user',
    tags: [],
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: true,
      privacy: 'private',
    },
    ...validatedUpdates,
  };
}

// Example 4: Schema composition and reuse
const CreateUserSchema = UserSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
}).extend({
  password: PasswordSchema,
  confirmPassword: z.string(),
}).refine((data: any) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CreateUser = z.infer<typeof CreateUserSchema>;

function createUser(userData: CreateUser): User {
  const validatedData = CreateUserSchema.parse(userData);
  
  // Remove confirmPassword before creating user
  const { confirmPassword, ...userDataWithoutConfirm } = validatedData;
  
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...userDataWithoutConfirm,
  };
}

// Example 5: API request/response schemas with validation
const ApiRequestSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  url: z.string().url(),
  headers: z.record(z.string()).optional(),
  body: z.unknown().optional(),
  timeout: z.number().positive().optional(),
});

const ApiResponseSchema = z.object({
  status: z.number(),
  statusText: z.string(),
  data: z.unknown(),
  headers: z.record(z.string()),
  timestamp: z.string().datetime(),
});

// Example 6: Form validation with real-world scenarios
const LoginFormSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
  twoFactorCode: z.string().optional(),
}).refine((data: any) => {
  // Require 2FA code for certain domains
  if (data.email.endsWith('@company.com') && !data.twoFactorCode) {
    return false;
  }
  return true;
}, {
  message: "Two-factor authentication code required for company accounts",
  path: ["twoFactorCode"],
});

type LoginFormData = z.infer<typeof LoginFormSchema>;

function validateLoginForm(formData: unknown): LoginFormData {
  return LoginFormSchema.parse(formData);
}

// Example 7: Environment variables validation with defaults
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().min(1000).max(65535)).default('3000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, "JWT secret must be at least 32 characters"),
  API_KEY: z.string().optional(),
  CORS_ORIGINS: z.string().transform((val: string) => val.split(',')).default(['http://localhost:3000']),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  RATE_LIMIT_WINDOW: z.string().transform(Number).pipe(z.number().positive()).default('900000'),
  RATE_LIMIT_MAX: z.string().transform(Number).pipe(z.number().positive()).default('100'),
});

function validateEnv(env: Record<string, unknown>) {
  return EnvSchema.parse(env);
}

// Example 8: Custom error messages and localization
const createLocalizedSchema = (locale: 'en' | 'es' | 'fr') => {
  const messages = {
    en: {
      required: "This field is required",
      email: "Invalid email address",
      minLength: "Must be at least {min} characters",
      maxLength: "Must be less than {max} characters",
    },
    es: {
      required: "Este campo es obligatorio",
      email: "Correo electrónico inválido",
      minLength: "Debe tener al menos {min} caracteres",
      maxLength: "Debe tener menos de {max} caracteres",
    },
    fr: {
      required: "Ce champ est obligatoire",
      email: "Adresse email invalide",
      minLength: "Doit contenir au moins {min} caractères",
      maxLength: "Doit contenir moins de {max} caractères",
    },
  };

  return z.object({
    name: z.string()
      .min(2, messages[locale].minLength.replace('{min}', '2'))
      .max(50, messages[locale].maxLength.replace('{max}', '50'))
      .describe("User name"),
    email: z.string()
      .email(messages[locale].email)
      .describe("User email"),
  });
};

// Example 9: Schema refinement with complex business logic
const OrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().positive(),
    price: z.number().positive(),
  })).min(1, "Order must contain at least one item"),
  shippingAddress: AddressSchema,
  paymentMethod: z.enum(['credit_card', 'paypal', 'bank_transfer']),
  discountCode: z.string().optional(),
}).refine((data: any) => {
  // Business rule: Total order value must be at least $10
  const total = data.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  return total >= 10;
}, {
  message: "Order total must be at least $10",
  path: ["items"],
}).refine((data: any) => {
  // Business rule: PayPal not available for orders over $1000
  const total = data.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  return !(data.paymentMethod === 'paypal' && total > 1000);
}, {
  message: "PayPal not available for orders over $1000",
  path: ["paymentMethod"],
});

// Example 10: Brand types with Zod for type safety
const UserIdSchema = z.string().uuid();
type UserId = z.infer<typeof UserIdSchema>;

const ProductIdSchema = z.string().uuid();
type ProductId = z.infer<typeof ProductIdSchema>;

const OrderIdSchema = z.string().uuid();
type OrderId = z.infer<typeof OrderIdSchema>;

// Create branded type utilities
const createBrandedType = <T extends z.ZodTypeAny>(schema: T, name: string) => {
  return schema.brand(name);
};

const UserIdBrand = createBrandedType(UserIdSchema, 'UserId');
const ProductIdBrand = createBrandedType(ProductIdSchema, 'ProductId');

// ===== UTILITY FUNCTIONS =====

// Type-safe schema builder
const createSchemaBuilder = () => {
  const fields: Record<string, z.ZodTypeAny> = {};
  
  return {
    addField: <K extends string>(name: K, schema: z.ZodTypeAny) => {
      fields[name] = schema;
      return createSchemaBuilder();
    },
    build: () => z.object(fields),
  };
};

// Schema validator factory
const createValidator = <T>(schema: z.ZodSchema<T>) => {
  return {
    validate: (data: unknown): T => schema.parse(data),
    safeValidate: (data: unknown) => schema.safeParse(data),
    validateAsync: async (data: unknown): Promise<T> => {
      const result = schema.safeParse(data);
      if (!result.success) {
        throw new Error(`Validation failed: ${result.error.message}`);
      }
      return result.data;
    },
  };
};

// ===== EXERCISES =====

/*
EXERCISE 1: Create a comprehensive blog post schema with:
- Title (string, 5-100 characters, unique)
- Content (string, min 50 characters, max 10000)
- Author (object with name, email, bio)
- Tags (array of strings, max 10 tags, unique)
- Published (boolean, default false)
- PublishedAt (optional date, auto-set when published)
- Category (enum: 'tech', 'lifestyle', 'business', 'other')
- SEO metadata (optional object with title, description, keywords)
- Comments (array of comment objects with validation)

EXERCISE 2: Create a shopping cart schema with:
- Items (array of product objects with id, name, price, quantity)
- Total (calculated from items, must be positive)
- Discount (optional percentage, 0-100)
- Shipping address (nested object with validation)
- Payment method (enum with validation rules)
- Order status (discriminated union with different states)

EXERCISE 3: Create an API pagination schema with:
- Page (number, min 1, default 1)
- Limit (number, min 1, max 100, default 20)
- Sort (enum of allowed fields)
- Order (enum: 'asc', 'desc')
- Filters (optional object with dynamic keys)
- Search (optional string with min length)
- Include (optional array of fields to include)

EXERCISE 4: Create a configuration schema that:
- Has required and optional sections
- Validates nested configurations
- Provides default values
- Supports environment-specific overrides
- Includes validation for data types and ranges
- Handles circular references safely

EXERCISE 5: Create a form wizard schema with:
- Multiple steps with different validation rules
- Conditional validation based on previous steps
- Progress tracking
- Step-specific error messages
- Ability to jump between steps with validation
- Final summary with all data
*/

// Export schemas for use in other files
export {
  // Basic schemas
  NameSchema,
  AgeSchema,
  EmailSchema,
  PhoneSchema,
  UrlSchema,
  DateSchema,
  PasswordSchema,
  
  // Object schemas
  UserSchema,
  UserProfileSchema,
  AddressSchema,
  CreateUserSchema,
  UserUpdateSchema,
  PasswordConfirmationSchema,
  
  // Advanced schemas
  StatusSchema,
  BaseUserSchema,
  AdminUserSchema,
  RegularUserSchema,
  EventSchema,
  
  // Array and collection schemas
  TagsSchema,
  ScoresSchema,
  CoordinatesSchema,
  MetadataSchema,
  UserMapSchema,
  
  // API and form schemas
  ApiRequestSchema,
  ApiResponseSchema,
  LoginFormSchema,
  OrderSchema,
  EnvSchema,
  
  // Utility schemas
  TrimmedStringSchema,
  LowercaseEmailSchema,
  CapitalizedNameSchema,
  UniqueEmailSchema,
  
  // Branded types
  UserIdSchema,
  ProductIdSchema,
  OrderIdSchema,
};

// Export types
export type {
  User,
  CreateUser,
  UserUpdate,
  LoginFormData,
  UserId,
  ProductId,
  OrderId,
};

// Export utility functions
export {
  validateUser,
  safeValidateUser,
  updateUser,
  createUser,
  validateLoginForm,
  validateEnv,
  createLocalizedSchema,
  createSchemaBuilder,
  createValidator,
};
