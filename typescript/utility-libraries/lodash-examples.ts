// Lodash TypeScript Examples - Advanced Utility Patterns
// This file demonstrates comprehensive TypeScript usage with Lodash utility library

import {
  // Array utilities
  chunk,
  compact,
  concat,
  difference,
  differenceBy,
  differenceWith,
  drop,
  dropRight,
  dropRightWhile,
  dropWhile,
  fill,
  findIndex,
  findLastIndex,
  flatten,
  flattenDeep,
  flattenDepth,
  fromPairs,
  head,
  indexOf,
  initial,
  intersection,
  intersectionBy,
  intersectionWith,
  join,
  last,
  nth,
  pull,
  pullAll,
  pullAllBy,
  pullAllWith,
  pullAt,
  remove,
  reverse,
  slice,
  sortedIndex,
  sortedIndexBy,
  sortedIndexOf,
  sortedLastIndex,
  sortedLastIndexBy,
  sortedLastIndexOf,
  sortedUniq,
  sortedUniqBy,
  tail,
  take,
  takeRight,
  takeRightWhile,
  takeWhile,
  union,
  unionBy,
  unionWith,
  uniq,
  uniqBy,
  uniqWith,
  unzip,
  unzipWith,
  without,
  xor,
  xorBy,
  xorWith,
  zip,
  zipObject,
  zipObjectDeep,
  zipWith,

  // Collection utilities
  countBy,
  each,
  eachRight,
  every,
  filter,
  find,
  findLast,
  flatMap,
  flatMapDeep,
  flatMapDepth,
  forEach,
  forEachRight,
  groupBy,
  includes,
  invokeMap,
  keyBy,
  map,
  orderBy,
  partition,
  reduce,
  reduceRight,
  reject,
  sample,
  sampleSize,
  shuffle,
  size,
  some,
  sortBy,

  // Date utilities
  now,

  // Function utilities
  after,
  ary,
  before,
  bind,
  bindKey,
  curry,
  curryRight,
  debounce,
  defer,
  delay,
  flip,
  memoize,
  negate,
  once,
  overArgs,
  partial,
  partialRight,
  rearg,
  rest,
  spread,
  throttle,
  unary,
  wrap,

  // Lang utilities
  castArray,
  clone,
  cloneDeep,
  cloneDeepWith,
  cloneWith,
  conformsTo,
  eq,
  gt,
  gte,
  isArguments,
  isArray,
  isArrayBuffer,
  isArrayLike,
  isArrayLikeObject,
  isBoolean,
  isBuffer,
  isDate,
  isElement,
  isEmpty,
  isEqual,
  isEqualWith,
  isError,
  isFinite,
  isFunction,
  isInteger,
  isLength,
  isMap,
  isMatch,
  isMatchWith,
  isNaN,
  isNative,
  isNil,
  isNull,
  isNumber,
  isObject,
  isObjectLike,
  isPlainObject,
  isRegExp,
  isSafeInteger,
  isSet,
  isString,
  isSymbol,
  isTypedArray,
  isUndefined,
  isWeakMap,
  isWeakSet,
  lt,
  lte,
  toArray,
  toFinite,
  toInteger,
  toLength,
  toNumber,
  toPlainObject,
  toSafeInteger,
  toString,

  // Math utilities
  add,
  ceil,
  divide,
  floor,
  max,
  maxBy,
  mean,
  meanBy,
  min,
  minBy,
  multiply,
  round,
  subtract,
  sum,
  sumBy,

  // Number utilities
  clamp,
  inRange,
  random,

  // Object utilities
  assign,
  assignIn,
  assignInWith,
  assignWith,
  at,
  create,
  defaults,
  defaultsDeep,
  entries,
  entriesIn,
  extend,
  extendWith,
  forIn,
  forInRight,
  forOwn,
  forOwnRight,
  functions,
  functionsIn,
  get,
  has,
  hasIn,
  invert,
  invertBy,
  invoke,
  keys,
  keysIn,
  mapKeys,
  mapValues,
  merge,
  mergeWith,
  omit,
  omitBy,
  pick,
  pickBy,
  result,
  set,
  setWith,
  toPairs,
  toPairsIn,
  transform,
  unset,
  update,
  updateWith,
  values,
  valuesIn,

  // Seq utilities
  chain,
  tap,
  thru,
  prototype,

  // String utilities
  camelCase,
  capitalize,
  deburr,
  endsWith,
  escape,
  escapeRegExp,
  kebabCase,
  lowerCase,
  lowerFirst,
  pad,
  padEnd,
  padStart,
  parseInt,
  repeat,
  replace,
  snakeCase,
  split,
  startCase,
  startsWith,
  template,
  templateSettings,
  toLower,
  toUpper,
  trim,
  trimEnd,
  trimStart,
  truncate,
  unescape,
  upperCase,
  upperFirst,
  words,

  // Utility utilities
  attempt,
  bindAll,
  cond,
  constant,
  defaultTo,
  flow,
  flowRight,
  identity,
  iteratee,
  matches,
  matchesProperty,
  method,
  methodOf,
  mixin,
  noop,
  nthArg,
  over,
  overEvery,
  overSome,
  property,
  propertyOf,
  range,
  rangeRight,
  runInContext,
  stubArray,
  stubFalse,
  stubObject,
  stubString,
  stubTrue,
  times,
  toPath,
  uniqueId,
} from 'lodash';

// ===== BASIC TYPES =====

// Enhanced user interface with comprehensive fields
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  avatar?: string;
  role: 'admin' | 'user' | 'moderator';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
  profile?: UserProfile;
  tags: string[];
  scores: number[];
  metadata: Record<string, any>;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    showEmail: boolean;
    showPhone: boolean;
  };
}

interface UserProfile {
  bio: string;
  website?: string;
  location?: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

// Product interface for e-commerce examples
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  tags: string[];
  variants: ProductVariant[];
  reviews: Review[];
}

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  sku: string;
  inStock: boolean;
}

interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// Enhanced pagination interface
interface PaginationResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ===== ARRAY UTILITIES =====

// Advanced array manipulation with type safety
const processUserArray = (users: User[]): {
  activeUsers: User[];
  adminUsers: User[];
  usersByRole: Record<string, User[]>;
  userNames: string[];
  userAges: number[];
  averageAge: number;
  oldestUser: User | undefined;
  youngestUser: User | undefined;
  usersWithScores: User[];
  topScorers: User[];
} => {
  // Filter active users
  const activeUsers = filter(users, (user: User) => user.isActive);

  // Filter admin users
  const adminUsers = filter(users, { role: 'admin' });

  // Group users by role
  const usersByRole = groupBy(users, 'role');

  // Extract user names
  const userNames = map(users, 'name');

  // Extract user ages
  const userAges = map(users, 'age');

  // Calculate average age
  const averageAge = mean(userAges);

  // Find oldest and youngest users
  const oldestUser = maxBy(users, 'age');
  const youngestUser = minBy(users, 'age');

  // Filter users with scores
  const usersWithScores = filter(users, (user: User) => user.scores.length > 0);

  // Find top scorers (users with highest average score)
  const topScorers = orderBy(
    filter(usersWithScores, (user: User) => mean(user.scores) > 80),
    [(user: User) => mean(user.scores)],
    ['desc']
  );

  return {
    activeUsers,
    adminUsers,
    usersByRole,
    userNames,
    userAges,
    averageAge,
    oldestUser,
    youngestUser,
    usersWithScores,
    topScorers,
  };
};

// Advanced array operations
const advancedArrayOperations = (data: any[]): {
  chunked: any[][];
  compacted: any[];
  unique: any[];
  flattened: any[];
  shuffled: any[];
  sampled: any[];
  partitioned: [any[], any[]];
} => {
  // Chunk array into smaller arrays
  const chunked = chunk(data, 3);

  // Remove falsy values
  const compacted = compact(data);

  // Get unique values
  const unique = uniq(data);

  // Flatten nested arrays
  const flattened = flattenDeep(data);

  // Shuffle array
  const shuffled = shuffle(clone(data));

  // Sample random elements
  const sampled = sampleSize(data, 3);

  // Partition array based on condition
  const partitioned = partition(data, (item: any) => typeof item === 'string');

  return {
    chunked,
    compacted,
    unique,
    flattened,
    shuffled,
    sampled,
    partitioned,
  };
};

// ===== COLLECTION UTILITIES =====

// Advanced collection processing
const processProductCollection = (products: Product[]): {
  categories: string[];
  productsByCategory: Record<string, Product[]>;
  inStockProducts: Product[];
  outOfStockProducts: Product[];
  averagePrice: number;
  priceRange: { min: number; max: number };
  topRatedProducts: Product[];
  productsWithReviews: Product[];
  totalReviews: number;
  averageRating: number;
} => {
  // Get unique categories
  const categories = uniq(map(products, 'category'));

  // Group products by category
  const productsByCategory = groupBy(products, 'category');

  // Filter in-stock and out-of-stock products
  const inStockProducts = filter(products, 'inStock');
  const outOfStockProducts = reject(products, 'inStock');

  // Calculate price statistics
  const prices = map(products, 'price');
  const averagePrice = mean(prices);
  const minPrice = min(prices) || 0;
  const maxPrice = max(prices) || 0;

  // Find top-rated products (average rating > 4)
  const topRatedProducts = filter(products, (product: Product) => {
    const ratings = map(product.reviews, 'rating');
    return ratings.length > 0 && mean(ratings) > 4;
  });

  // Filter products with reviews
  const productsWithReviews = filter(products, (product: Product) => product.reviews.length > 0);

  // Calculate review statistics
  const allReviews = flatMap(products, 'reviews');
  const totalReviews = allReviews.length;
  const averageRating = totalReviews > 0 ? mean(map(allReviews, 'rating')) : 0;

  return {
    categories,
    productsByCategory,
    inStockProducts,
    outOfStockProducts,
    averagePrice,
    priceRange: { min: minPrice, max: maxPrice },
    topRatedProducts,
    productsWithReviews,
    totalReviews,
    averageRating,
  };
};

// ===== FUNCTION UTILITIES =====

// Advanced function composition and utilities
const createAdvancedFunctions = () => {
  // Curried function for user validation
  const validateUser = curry((field: string, value: any, user: User): boolean => {
    return get(user, field) === value;
  });

  // Memoized expensive function
  const expensiveCalculation = memoize((n: number): number => {
    console.log(`Calculating for ${n}...`);
    return n * n * n; // Simulate expensive operation
  });

  // Debounced search function
  const debouncedSearch = debounce((query: string, callback: (results: any[]) => void) => {
    // Simulate API call
    setTimeout(() => {
      callback([`Result 1 for ${query}`, `Result 2 for ${query}`]);
    }, 100);
  }, 300);

  // Throttled scroll handler
  const throttledScroll = throttle((event: Event) => {
    console.log('Scroll position:', (event.target as Window).scrollY);
  }, 100);

  // Function composition with flow
  const processUserData = flow(
    (users: User[]) => filter(users, 'isActive'),
    (activeUsers: User[]) => map(activeUsers, 'name'),
    (names: string[]) => map(names, (name: string) => name.toUpperCase()),
    (upperNames: string[]) => join(upperNames, ', ')
  );

  // Partial application
  const getUsersByRole = partial(filter, _, { role: 'admin' });

  // Function that creates validators
  const createValidator = (rules: Array<(value: any) => boolean>) => {
    return (value: any): boolean => {
      return every(rules, (rule: (value: any) => boolean) => rule(value));
    };
  };

  return {
    validateUser,
    expensiveCalculation,
    debouncedSearch,
    throttledScroll,
    processUserData,
    getUsersByRole,
    createValidator,
  };
};

// ===== OBJECT UTILITIES =====

// Advanced object manipulation
const processUserObject = (user: User): {
  userClone: User;
  userWithoutSensitive: Partial<User>;
  userWithDefaults: User;
  userPaths: string[];
  userKeys: string[];
  userValues: any[];
  userEntries: Array<[string, any]>;
  userInverted: Record<string, string>;
  userPicked: Partial<User>;
  userOmitted: Partial<User>;
} => {
  // Deep clone user object
  const userClone = cloneDeep(user);

  // Remove sensitive information
  const userWithoutSensitive = omit(user, ['id', 'email', 'metadata']);

  // Apply defaults
  const userWithDefaults = defaults(user, {
    avatar: '/default-avatar.png',
    isActive: true,
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: { email: true, push: true, sms: false },
      privacy: { profileVisibility: 'public', showEmail: false, showPhone: false },
    },
  });

  // Get object paths
  const userPaths = toPairs(user).map(([key]) => key);

  // Get keys and values
  const userKeys = keys(user);
  const userValues = values(user);
  const userEntries = toPairs(user);

  // Invert object (for simple key-value pairs)
  const userInverted = invert(pick(user, ['name', 'role']));

  // Pick specific properties
  const userPicked = pick(user, ['name', 'email', 'role', 'isActive']);

  // Omit specific properties
  const userOmitted = omit(user, ['metadata', 'preferences']);

  return {
    userClone,
    userWithoutSensitive,
    userWithDefaults,
    userPaths,
    userKeys,
    userValues,
    userEntries,
    userInverted,
    userPicked,
    userOmitted,
  };
};

// Advanced object transformation
const transformObject = (obj: Record<string, any>): {
  normalized: Record<string, any>;
  flattened: Record<string, any>;
  nested: Record<string, any>;
  merged: Record<string, any>;
  updated: Record<string, any>;
} => {
  // Normalize object keys
  const normalized = mapKeys(obj, (value: any, key: string) => camelCase(key));

  // Flatten nested object
  const flattened = transform(obj, (result: Record<string, any>, value: any, key: string) => {
    if (isObject(value) && !isArray(value)) {
      forOwn(value, (nestedValue: any, nestedKey: string) => {
        result[`${key}.${nestedKey}`] = nestedValue;
      });
    } else {
      result[key] = value;
    }
  }, {});

  // Create nested object from flat object
  const nested = {};
  forOwn(flattened, (value: any, path: string) => {
    set(nested, path, value);
  });

  // Merge with defaults
  const defaults = { theme: 'light', language: 'en', version: '1.0.0' };
  const merged = merge({}, defaults, obj);

  // Update nested property
  const updated = update(merged, 'preferences.theme', (theme: string) => 
    theme === 'light' ? 'dark' : 'light'
  );

  return {
    normalized,
    flattened,
    nested,
    merged,
    updated,
  };
};

// ===== STRING UTILITIES =====

// Advanced string manipulation
const processStrings = (texts: string[]): {
  camelCased: string[];
  kebabCased: string[];
  snakeCased: string[];
  capitalized: string[];
  truncated: string[];
  padded: string[];
  words: string[][];
  uniqueWords: string[];
  wordCounts: Record<string, number>;
} => {
  // Convert to different cases
  const camelCased = map(texts, (text: string) => camelCase(text));
  const kebabCased = map(texts, (text: string) => kebabCase(text));
  const snakeCased = map(texts, (text: string) => snakeCase(text));

  // Capitalize and truncate
  const capitalized = map(texts, (text: string) => capitalize(text));
  const truncated = map(texts, (text: string) => truncate(text, { length: 20 }));

  // Pad strings
  const padded = map(texts, (text: string) => pad(text, 20));

  // Extract words
  const wordsList = map(texts, (text: string) => words(text.toLowerCase()));
  const allWords = flatten(wordsList);
  const uniqueWords = uniq(allWords);

  // Count word frequency
  const wordCounts = countBy(allWords);

  return {
    camelCased,
    kebabCased,
    snakeCased,
    capitalized,
    truncated,
    padded,
    words: wordsList,
    uniqueWords,
    wordCounts,
  };
};

// ===== MATH UTILITIES =====

// Advanced mathematical operations
const performMathOperations = (numbers: number[]): {
  sum: number;
  average: number;
  min: number;
  max: number;
  median: number;
  variance: number;
  standardDeviation: number;
  rounded: number[];
  clamped: number[];
  randomNumbers: number[];
  range: number[];
} => {
  // Basic statistics
  const sumResult = sum(numbers);
  const average = mean(numbers);
  const minResult = min(numbers) || 0;
  const maxResult = max(numbers) || 0;

  // Calculate median
  const sorted = clone(numbers).sort((a: number, b: number) => a - b);
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];

  // Calculate variance and standard deviation
  const variance = mean(map(numbers, (num: number) => Math.pow(num - average, 2)));
  const standardDeviation = Math.sqrt(variance);

  // Round numbers
  const rounded = map(numbers, (num: number) => round(num, 2));

  // Clamp numbers to range
  const clamped = map(numbers, (num: number) => clamp(num, 0, 100));

  // Generate random numbers
  const randomNumbers = times(5, () => random(0, 100));

  // Create range
  const rangeResult = range(minResult, maxResult + 1, 10);

  return {
    sum: sumResult,
    average,
    min: minResult,
    max: maxResult,
    median,
    variance,
    standardDeviation,
    rounded,
    clamped,
    randomNumbers,
    range: rangeResult,
  };
};

// ===== UTILITY FUNCTIONS =====

// Custom type guards
const isUser = (obj: any): obj is User => {
  return obj && 
         typeof obj === 'object' &&
         typeof obj.id === 'string' &&
         typeof obj.name === 'string' &&
         typeof obj.email === 'string' &&
         typeof obj.age === 'number' &&
         ['admin', 'user', 'moderator'].includes(obj.role);
};

const isProduct = (obj: any): obj is Product => {
  return obj &&
         typeof obj === 'object' &&
         typeof obj.id === 'string' &&
         typeof obj.name === 'string' &&
         typeof obj.price === 'number' &&
         typeof obj.category === 'string';
};

// Safe property access
const safeGet = <T>(obj: any, path: string, defaultValue: T): T => {
  return get(obj, path, defaultValue);
};

// Deep comparison with customizer
const deepCompare = (obj1: any, obj2: any): boolean => {
  return isEqualWith(obj1, obj2, (value1: any, value2: any) => {
    if (isDate(value1) && isDate(value2)) {
      return value1.getTime() === value2.getTime();
    }
    return undefined; // Use default comparison
  });
};

// Performance monitoring
const createPerformanceMonitor = () => {
  const timings: Record<string, number> = {};

  const start = (name: string): void => {
    timings[name] = now();
  };

  const end = (name: string): number => {
    const startTime = timings[name];
    if (!startTime) {
      console.warn(`Timer '${name}' was not started`);
      return 0;
    }
    const duration = now() - startTime;
    console.log(`${name}: ${duration}ms`);
    delete timings[name];
    return duration;
  };

  return { start, end };
};

// Data transformation pipeline
const createDataPipeline = <T, R>(...transformers: Array<(data: any) => any>) => {
  return (data: T): R => {
    return flow(...transformers)(data);
  };
};

// ===== CHAINING EXAMPLES =====

// Advanced chaining with Lodash
const demonstrateChaining = (users: User[], products: Product[]) => {
  // Chain operations on users
  const userStats = chain(users)
    .filter('isActive')
    .groupBy('role')
    .mapValues((group: User[]) => ({
      count: group.length,
      averageAge: mean(map(group, 'age')),
      names: map(group, 'name'),
    }))
    .value();

  // Chain operations on products
  const productStats = chain(products)
    .filter('inStock')
    .groupBy('category')
    .mapValues((group: Product[]) => ({
      count: group.length,
      averagePrice: mean(map(group, 'price')),
      totalValue: sum(map(group, 'price')),
    }))
    .value();

  return { userStats, productStats };
};

// ===== EXERCISES =====

/*
EXERCISE 1: Create a data processing pipeline that:
- Takes an array of mixed data types
- Filters out invalid entries using custom type guards
- Transforms valid entries into a standardized format
- Groups by category and calculates statistics
- Returns a typed result object

EXERCISE 2: Implement a caching mechanism that:
- Uses memoization for expensive function calls
- Supports cache invalidation
- Provides cache statistics
- Handles different cache strategies (LRU, TTL)
- Is fully typed

EXERCISE 3: Create a form validation system that:
- Uses Lodash for data validation
- Supports complex validation rules
- Provides detailed error messages
- Supports async validation
- Is fully typed

EXERCISE 4: Build a data transformation utility that:
- Converts between different data formats
- Handles nested object transformations
- Supports custom transformation rules
- Provides transformation history
- Is fully typed

EXERCISE 5: Create a performance monitoring system that:
- Tracks function execution times
- Provides performance statistics
- Identifies performance bottlenecks
- Supports performance alerts
- Is fully typed
*/

// Export functions and utilities
export {
  // Array utilities
  processUserArray,
  advancedArrayOperations,
  
  // Collection utilities
  processProductCollection,
  
  // Function utilities
  createAdvancedFunctions,
  
  // Object utilities
  processUserObject,
  transformObject,
  
  // String utilities
  processStrings,
  
  // Math utilities
  performMathOperations,
  
  // Utility functions
  isUser,
  isProduct,
  safeGet,
  deepCompare,
  createPerformanceMonitor,
  createDataPipeline,
  
  // Chaining examples
  demonstrateChaining,
};

// Export types
export type {
  User,
  UserPreferences,
  UserProfile,
  Product,
  ProductVariant,
  Review,
  PaginationResult,
};