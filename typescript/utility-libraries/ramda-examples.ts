// Ramda TypeScript Examples - Advanced Functional Programming Patterns
// This file demonstrates comprehensive TypeScript usage with Ramda functional library

import {
  // Function utilities
  curry,
  curryN,
  partial,
  partialRight,
  bind,
  tap,
  pipe,
  compose,
  pipeWith,
  composeWith,
  converge,
  useWith,
  memoizeWith,
  uncurryN,
  flip,
  __,
  
  // List operations
  map,
  filter,
  reject,
  take,
  takeLast,
  takeWhile,
  takeUntil,
  drop,
  dropLast,
  dropWhile,
  dropRepeats,
  dropRepeatsWith,
  head,
  tail,
  init,
  last,
  nth,
  length,
  reverse,
  sort,
  sortBy,
  groupBy,
  groupWith,
  countBy,
  uniq,
  uniqBy,
  uniqWith,
  pluck,
  project,
  transpose,
  zip,
  zipObj,
  zipWith,
  xprod,
  intersection,
  difference,
  symmetricDifference,
  append,
  prepend,
  insert,
  insertAll,
  adjust,
  remove,
  update,
  move,
  concat,
  flatten,
  unnest,
  chain,
  reduce,
  reduceRight,
  scan,
  mapAccum,
  mapAccumRight,
  aperture,
  partition,
  find,
  findLast,
  findIndex,
  findLastIndex,
  indexOf,
  lastIndexOf,
  range,
  times,
  
  // Object operations
  keys,
  values,
  keysIn,
  valuesIn,
  toPairs,
  toPairsIn,
  fromPairs,
  has,
  hasIn,
  prop,
  propOr,
  props,
  pick,
  pickAll,
  pickBy,
  omit,
  omitBy,
  path,
  pathOr,
  paths,
  assoc,
  assocPath,
  dissoc,
  dissocPath,
  merge,
  mergeDeepLeft,
  mergeDeepRight,
  mergeDeepWith,
  mergeWith,
  mergeWithKey,
  evolve,
  set,
  lens,
  lensPath,
  lensProp,
  lensIndex,
  lensProp,
  view,
  set,
  over,
  lensIndex,
  lensPath,
  lensProp,
  view,
  set,
  over,
  
  // Logic and predicates
  all,
  allPass,
  any,
  anyPass,
  none,
  complement,
  both,
  either,
  and,
  or,
  not,
  isEmpty,
  isNil,
  T,
  F,
  defaultTo,
  always,
  when,
  unless,
  ifElse,
  cond,
  equals,
  identical,
  gt,
  gte,
  lt,
  lte,
  max,
  min,
  clamp,
  
  // String operations
  split,
  splitWhen,
  join,
  test,
  match,
  replace,
  toLower,
  toUpper,
  trim,
  capitalize,
  repeat,
  
  // Math operations
  add,
  subtract,
  multiply,
  divide,
  modulo,
  inc,
  dec,
  negate,
  mean,
  median,
  sum,
  product,
  
  // Type operations
  is,
  propIs,
  type,
  isArrayLike,
  
  // Composition utilities
  ascend,
  descend,
  
  // Function application
  apply,
  applySpec,
  applyTo,
  call,
  unapply,
  
  // List transformation
  mapObjIndexed,
  mapObjIndexed,
  
  // Misc utilities
  identity,
  tryCatch,
  always,
} from 'ramda';

// ===== BASIC TYPES =====

// Enhanced user interface with functional programming in mind
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

// Enhanced product interface
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

// Enhanced order interface
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: Date;
  shippingAddress: Address;
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// Enhanced statistics interface
interface Statistics {
  total: number;
  average: number;
  min: number;
  max: number;
  median: number;
  standardDeviation: number;
  distribution: Record<string, number>;
}

// ===== FUNCTION COMPOSITION =====

// Advanced function composition with Ramda
const createComposedFunctions = () => {
  // Simple composition with pipe
  const processUser = pipe(
    (user: User) => user.name,
    toLower,
    split(' '),
    join('-'),
    (name: string) => `processed-${name}`
  );

  // Complex composition with multiple transformations
  const analyzeUser = pipe(
    (user: User) => user,
    pick(['name', 'age', 'role', 'isActive']),
    evolve({
      name: toLower,
      age: inc,
      isActive: Boolean,
    }),
    (user: any) => ({ ...user, processed: true })
  );

  // Composition with conditional logic
  const categorizeUser = pipe(
    (user: User) => user.age,
    when(
      (age: number) => age < 18,
      always('minor')
    ),
    when(
      (age: number) => age >= 18 && age < 65,
      always('adult')
    ),
    when(
      (age: number) => age >= 65,
      always('senior')
    ),
    defaultTo('unknown')
  );

  // Composition with error handling
  const safeProcessUser = pipe(
    tryCatch(
      pipe(
        (user: User) => user.email,
        split('@'),
        head,
        toLower
      ),
      always('unknown')
    )
  );

  // Composition with convergence
  const createUserSummary = converge(
    (name: string, email: string, role: string) => ({ name, email, role }),
    [
      prop('name'),
      prop('email'),
      prop('role'),
    ]
  );

  // Composition with useWith
  const calculateDiscount = useWith(
    (price: number, discount: number, isPremium: boolean) => 
      isPremium ? price * (1 - discount * 2) : price * (1 - discount),
    [identity, identity, prop('isPremium')]
  );

  return {
    processUser,
    analyzeUser,
    categorizeUser,
    safeProcessUser,
    createUserSummary,
    calculateDiscount,
  };
};

// ===== CURRYING AND PARTIAL APPLICATION =====

// Advanced currying examples
const createCurriedFunctions = () => {
  // Basic currying
  const addThreeNumbers = curry((a: number, b: number, c: number) => a + b + c);
  const add5 = addThreeNumbers(5);
  const add5And3 = add5(3);
  const add5And3And2 = add5And3(2); // 10

  // Curried function for user validation
  const validateUser = curry((field: string, value: any, user: User) => 
    prop(field, user) === value
  );

  const validateName = validateUser('name');
  const validateJohn = validateName('John');
  const isUserJohn = validateJohn; // Function that takes a user and returns boolean

  // Partial application
  const createUser = partial(
    (id: string, name: string, email: string, role: string) => ({
      id,
      name,
      email,
      role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        theme: 'light' as const,
        language: 'en',
        notifications: { email: true, push: true, sms: false },
        privacy: { profileVisibility: 'public' as const, showEmail: false, showPhone: false },
      },
      tags: [],
      scores: [],
      metadata: {},
    }),
    ['user-123']
  );

  const createUserWithRole = partialRight(createUser, ['user']);

  // Flip function for argument reordering
  const subtractFrom = flip(subtract);
  const subtractFrom10 = subtractFrom(10); // (x) => 10 - x

  // Uncurry for variadic functions
  const variadicAdd = uncurryN(3, (a: number, b: number, c: number) => a + b + c);

  return {
    addThreeNumbers,
    validateUser,
    createUser,
    createUserWithRole,
    subtractFrom10,
    variadicAdd,
  };
};

// ===== LIST OPERATIONS =====

// Advanced list operations with functional patterns
const processLists = (users: User[], products: Product[]): {
  userStats: {
    total: number;
    active: number;
    byRole: Record<string, number>;
    averageAge: number;
    ageDistribution: Record<string, number>;
  };
  productStats: {
    total: number;
    inStock: number;
    byCategory: Record<string, number>;
    averagePrice: number;
    priceRanges: Record<string, number>;
  };
  transformations: {
    userNames: string[];
    activeUsers: User[];
    userPairs: [User, User][];
    productNames: string[];
    expensiveProducts: Product[];
    productCategories: string[];
  };
} => {
  // User statistics
  const userStats = {
    total: length(users),
    active: length(filter(prop('isActive'), users)),
    byRole: countBy(prop('role'), users),
    averageAge: mean(map(prop('age'), users)) || 0,
    ageDistribution: countBy(
      pipe(
        prop('age') as (user: User) => number,
        when(
          (age: number) => age < 18,
          always('under-18')
        ),
        when(
          (age: number) => age >= 18 && age < 30,
          always('18-29')
        ),
        when(
          (age: number) => age >= 30 && age < 50,
          always('30-49')
        ),
        when(
          (age: number) => age >= 50,
          always('50+')
        ),
        defaultTo('unknown')
      ),
      users
    ),
  };

  // Product statistics
  const productStats = {
    total: length(products),
    inStock: length(filter(prop('inStock'), products)),
    byCategory: countBy(prop('category'), products),
    averagePrice: mean(map(prop('price'), products)) || 0,
    priceRanges: countBy(
      pipe(
        prop('price') as (product: Product) => number,
        when(
          (price: number) => price < 10,
          always('under-10')
        ),
        when(
          (price: number) => price >= 10 && price < 50,
          always('10-49')
        ),
        when(
          (price: number) => price >= 50 && price < 100,
          always('50-99')
        ),
        when(
          (price: number) => price >= 100,
          always('100+')
        ),
        defaultTo('unknown')
      ),
      products
    ),
  };

  // Transformations
  const transformations = {
    userNames: map(pipe(prop('name'), toLower), users),
    activeUsers: filter(prop('isActive'), users),
    userPairs: aperture(2, users) as [User, User][],
    productNames: map(prop('name'), products),
    expensiveProducts: filter(
      pipe(
        prop('price') as (product: Product) => number,
        gt(__, 50)
      ),
      products
    ),
    productCategories: uniq(map(prop('category'), products)),
  };

  return { userStats, productStats, transformations };
};

// ===== OBJECT OPERATIONS =====

// Advanced object manipulation with functional patterns
const processObjects = (users: User[]): {
  transformed: User[];
  projections: Partial<User>[];
  merged: Record<string, any>[];
  evolved: User[];
  lensOperations: {
    names: string[];
    ages: number[];
    updatedUsers: User[];
  };
} => {
  // Transform objects
  const transformed = map(
    evolve({
      name: toLower,
      email: toLower,
      createdAt: (date: Date) => date.toISOString(),
      updatedAt: (date: Date) => date.toISOString(),
    }),
    users
  );

  // Project specific properties
  const projections = map(
    project(['id', 'name', 'email', 'role']),
    users
  );

  // Merge with defaults
  const defaults = {
    isActive: true,
    preferences: {
      theme: 'light' as const,
      language: 'en',
      notifications: { email: true, push: true, sms: false },
      privacy: { profileVisibility: 'public' as const, showEmail: false, showPhone: false },
    },
    tags: [],
    scores: [],
    metadata: {},
  };

  const merged = map(
    mergeDeepLeft(defaults),
    users
  );

  // Evolve properties
  const evolved = map(
    evolve({
      age: inc,
      isActive: Boolean,
      scores: (scores: number[]) => map(add(1), scores),
    }),
    users
  );

  // Lens operations
  const nameLens = lensProp('name');
  const ageLens = lensProp('age');
  const preferencesLens = lensProp('preferences');
  const themeLens = compose(preferencesLens, lensProp('theme'));

  const lensOperations = {
    names: map(view(nameLens), users),
    ages: map(view(ageLens), users),
    updatedUsers: map(
      pipe(
        over(nameLens, toUpper),
        over(ageLens, multiply(2)),
        over(themeLens, always('dark' as const))
      ),
      users
    ),
  };

  return { transformed, projections, merged, evolved, lensOperations };
};

// ===== LOGIC AND PREDICATES =====

// Advanced logic and predicate compositions
const createLogicFunctions = () => {
  // Complex predicates
  const isAdult = (age: number) => age >= 18;
  const isSenior = (age: number) => age >= 65;
  const isActiveUser = (user: User) => user.isActive;
  const isAdmin = (user: User) => user.role === 'admin';
  const hasValidEmail = (user: User) => test(/@/, user.email);

  // Predicate composition
  const isValidUser = allPass([isActiveUser, hasValidEmail]);
  const isPrivilegedUser = allPass([isValidUser, isAdmin]);
  const isYoungAdult = both(isAdult, complement(isSenior));
  const isMinorOrSenior = either(complement(isAdult), isSenior);

  // Conditional logic
  const getUserCategory = cond([
    [isPrivilegedUser, always('admin')],
    [both(isValidUser, isYoungAdult), always('young-adult')],
    [both(isValidUser, isSenior), always('senior')],
    [isValidUser, always('regular')],
    [T, always('invalid')],
  ]);

  // Validation with multiple conditions
  const validateProduct = allPass([
    (product: Product) => product.name.length > 0,
    (product: Product) => product.price > 0,
    (product: Product) => product.inStock,
    (product: Product) => product.variants.length > 0,
  ]);

  // Complex filtering
  const filterComplexUsers = (users: User[]) => filter(
    allPass([
      isActiveUser,
      pipe(prop('age'), isYoungAdult),
      pipe(prop('role'), equals('user')),
      pipe(prop('tags'), (tags: string[]) => tags.length > 0),
    ]),
    users
  );

  // Conditional transformation
  const transformUser = ifElse(
    isValidUser,
    evolve({
      name: toUpper,
      status: always('verified'),
    }),
    evolve({
      name: toLower,
      status: always('unverified'),
    })
  );

  return {
    isAdult,
    isSenior,
    isActiveUser,
    isAdmin,
    hasValidEmail,
    isValidUser,
    isPrivilegedUser,
    isYoungAdult,
    isMinorOrSenior,
    getUserCategory,
    validateProduct,
    filterComplexUsers,
    transformUser,
  };
};

// ===== STRING OPERATIONS =====

// Advanced string manipulation with functional patterns
const processStrings = (texts: string[]): {
  processed: {
    lowercased: string[];
    uppercased: string[];
    capitalized: string[];
    cleaned: string[];
    tokenized: string[][];
  };
  analysis: {
    wordCounts: number[];
    uniqueWords: string[];
    wordFrequency: Record<string, number>;
    averageLength: number;
  };
  transformations: {
    emails: string[];
    usernames: string[];
    slugs: string[];
    hashtags: string[];
  };
} => {
  // String processing
  const processed = {
    lowercased: map(toLower, texts),
    uppercased: map(toUpper, texts),
    capitalized: map(capitalize, texts),
    cleaned: map(pipe(trim, replace(/[^a-zA-Z0-9\s]/g, '')), texts),
    tokenized: map(pipe(toLower, split(/\s+/)), texts),
  };

  // String analysis
  const allWords = flatten(processed.tokenized);
  const wordCounts = map(length, processed.tokenized);
  const uniqueWords = uniq(allWords);
  const wordFrequency = countBy(identity, allWords);
  const averageLength = mean(map(length, texts)) || 0;

  const analysis = {
    wordCounts,
    uniqueWords,
    wordFrequency,
    averageLength,
  };

  // String transformations
  const transformations = {
    emails: filter(test(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), texts),
    usernames: map(pipe(split('@'), head), filter(test(/@/), texts)),
    slugs: map(pipe(toLower, replace(/\s+/g, '-'), replace(/[^a-z0-9-]/g, '')), texts),
    hashtags: filter(test(/^#\w+$/), texts),
  };

  return { processed, analysis, transformations };
};

// ===== MATH OPERATIONS =====

// Advanced mathematical operations with functional patterns
const performMathOperations = (numbers: number[]): {
  basic: {
    sum: number;
    product: number;
    mean: number;
    median: number;
  };
  statistics: {
    min: number;
    max: number;
    range: number;
    variance: number;
    standardDeviation: number;
  };
  transformations: {
    doubled: number[];
    squared: number[];
    normalized: number[];
    percentages: number[];
  };
  comparisons: {
    greaterThan10: number[];
    between5And15: number[];
    evenNumbers: number[];
    oddNumbers: number[];
  };
} => {
  // Basic operations
  const basic = {
    sum: sum(numbers),
    product: product(numbers),
    mean: mean(numbers) || 0,
    median: median(numbers) || 0,
  };

  // Statistical operations
  const minVal = min(numbers) || 0;
  const maxVal = max(numbers) || 0;
  const meanVal = basic.mean;
  const variance = mean(map(subtract(meanVal), numbers).map(Math.pow, 2)) || 0;
  const standardDeviation = Math.sqrt(variance);

  const statistics = {
    min: minVal,
    max: maxVal,
    range: maxVal - minVal,
    variance,
    standardDeviation,
  };

  // Transformations
  const transformations = {
    doubled: map(multiply(2), numbers),
    squared: map((x: number) => x * x, numbers),
    normalized: map(
      pipe(
        subtract(minVal),
        divide(maxVal - minVal || 1)
      ),
      numbers
    ),
    percentages: map(
      pipe(
        divide(sum(numbers)),
        multiply(100)
      ),
      numbers
    ),
  };

  // Comparisons
  const comparisons = {
    greaterThan10: filter(gt(__, 10), numbers),
    between5And15: filter(both(gt(__, 5), lt(__, 15)), numbers),
    evenNumbers: filter(even, numbers),
    oddNumbers: filter(odd, numbers),
  };

  return { basic, statistics, transformations, comparisons };
};

// ===== LENS OPERATIONS =====

// Advanced lens operations for deep object manipulation
const createLensOperations = () => {
  // Create lenses for nested paths
  const userPreferencesLens = lensPath(['preferences']);
  const userThemeLens = lensPath(['preferences', 'theme']);
  const userEmailLens = lensProp('email');
  const userScoresLens = lensProp('scores');
  const userFirstScoreLens = compose(userScoresLens, lensIndex(0));

  // Lens operations
  const getUserTheme = view(userThemeLens);
  const setUserTheme = set(userThemeLens);
  const modifyUserTheme = over(userThemeLens);

  const getUserEmail = view(userEmailLens);
  const setUserEmail = set(userEmailLens);
  const modifyUserEmail = over(userEmailLens);

  const getUserFirstScore = view(userFirstScoreLens);
  const setUserFirstScore = set(userFirstScoreLens);
  const modifyUserFirstScore = over(userFirstScoreLens);

  // Complex lens operations
  const updateNestedProperty = (user: User, path: string[], value: any) =>
    set(lensPath(path), value, user);

  const getNestedProperty = (user: User, path: string[]) =>
    view(lensPath(path), user);

  const modifyNestedProperty = (user: User, path: string[], fn: (value: any) => any) =>
    over(lensPath(path), fn, user);

  // Lens composition for complex operations
  const userLens = lensProp<User>('user');
  const addressLens = lensPath(['shippingAddress', 'city']);
  const orderCityLens = compose(userLens, addressLens);

  return {
    userPreferencesLens,
    userThemeLens,
    userEmailLens,
    userScoresLens,
    userFirstScoreLens,
    getUserTheme,
    setUserTheme,
    modifyUserTheme,
    getUserEmail,
    setUserEmail,
    modifyUserEmail,
    getUserFirstScore,
    setUserFirstScore,
    modifyUserFirstScore,
    updateNestedProperty,
    getNestedProperty,
    modifyNestedProperty,
    orderCityLens,
  };
};

// ===== TRANSDUCERS =====

// Advanced transducer patterns for efficient data processing
const createTransducers = () => {
  // Basic transducers
  const mapTransducer = <T, U>(fn: (x: T) => U) => (xf: any) => (acc: any, x: T) => xf(acc, fn(x));
  const filterTransducer = <T>(predicate: (x: T) => boolean) => (xf: any) => (acc: any, x: T) => 
    predicate(x) ? xf(acc, x) : acc;

  // Composition of transducers
  const processUsers = compose(
    mapTransducer((user: User) => ({ ...user, name: toLower(user.name) })),
    filterTransducer((user: User) => user.isActive),
    mapTransducer((user: User) => ({ id: user.id, name: user.name }))
  );

  // Transducer for statistics
  const calculateStats = compose(
    mapTransducer((user: User) => user.age),
    filterTransducer((age: number) => age > 0),
    mapTransducer((age: number) => age * age)
  );

  // Custom transducer for grouping
  const groupByTransducer = <T>(keyFn: (x: T) => string) => (xf: any) => {
    const groups: Record<string, T[]> = {};
    return {
      '@@transducer/init': () => groups,
      '@@transducer/result': (acc: any) => acc,
      '@@transducer/step': (acc: any, x: T) => {
        const key = keyFn(x);
        if (!groups[key]) groups[key] = [];
        groups[key].push(x);
        return acc;
      },
    };
  };

  return {
    mapTransducer,
    filterTransducer,
    processUsers,
    calculateStats,
    groupByTransducer,
  };
};

// ===== EXERCISES =====

/*
EXERCISE 1: Create a functional data processing pipeline that:
- Uses function composition for complex transformations
- Implements error handling with tryCatch
- Supports conditional logic with predicates
- Uses lenses for deep object manipulation
- Is fully typed

EXERCISE 2: Build a functional validation system that:
- Uses curried validation functions
- Composes multiple validation rules
- Provides detailed error messages
- Supports async validation
- Is fully typed

EXERCISE 3: Create a functional state management system that:
- Uses immutable updates with lenses
- Implements state transitions with pure functions
- Supports state composition
- Provides state history tracking
- Is fully typed

EXERCISE 4: Build a functional data transformation library that:
- Uses transducers for efficient processing
- Supports custom transformation functions
- Handles large datasets efficiently
- Provides transformation composition
- Is fully typed

EXERCISE 5: Create a functional reactive programming system that:
- Uses observables with functional operators
- Implements event streams with pure functions
- Supports stream composition
- Handles backpressure
- Is fully typed
*/

// Helper functions for exercises
const even = (n: number) => n % 2 === 0;
const odd = (n: number) => n % 2 !== 0;

// Export functions and utilities
export {
  // Function composition
  createComposedFunctions,
  
  // Currying and partial application
  createCurriedFunctions,
  
  // List operations
  processLists,
  
  // Object operations
  processObjects,
  
  // Logic and predicates
  createLogicFunctions,
  
  // String operations
  processStrings,
  
  // Math operations
  performMathOperations,
  
  // Lens operations
  createLensOperations,
  
  // Transducers
  createTransducers,
  
  // Helper functions
  even,
  odd,
};

// Export types
export type {
  User,
  UserPreferences,
  UserProfile,
  Product,
  ProductVariant,
  Review,
  Order,
  OrderItem,
  Address,
  Statistics,
};