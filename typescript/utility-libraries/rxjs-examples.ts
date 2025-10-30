// RxJS TypeScript Examples - Advanced Reactive Programming Patterns
// This file demonstrates comprehensive TypeScript usage with RxJS reactive library

import {
  // Core Observable creation
  Observable,
  of,
  from,
  fromEvent,
  fromEventPattern,
  empty,
  never,
  throwError,
  interval,
  timer,
  range,
  generate,
  defer,
  bindCallback,
  bindNodeCallback,
  iif,
  using,
  
  // Subjects
  Subject,
  BehaviorSubject,
  ReplaySubject,
  AsyncSubject,
  
  // Schedulers
  asapScheduler,
  asyncScheduler,
  queueScheduler,
  animationFrameScheduler,
  
  // Operators
  map,
  mapTo,
  filter,
  take,
  takeLast,
  takeWhile,
  takeUntil,
  first,
  last,
  skip,
  skipWhile,
  skipUntil,
  debounceTime,
  throttleTime,
  auditTime,
  sampleTime,
  delay,
  delayWhen,
  timeout,
  timeoutWith,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  distinct,
  distinctKey,
  mergeMap,
  switchMap,
  concatMap,
  exhaustMap,
  mergeAll,
  switchAll,
  concatAll,
  exhaustAll,
  merge,
  mergeWith,
  concat,
  concatWith,
  race,
  raceWith,
  combineLatest,
  combineLatestWith,
  zip,
  zipWith,
  withLatestFrom,
  startWith,
  endWith,
  pairwise,
  buffer,
  bufferCount,
  bufferTime,
  bufferToggle,
  bufferWhen,
  window,
  windowCount,
  windowTime,
  windowToggle,
  windowWhen,
  groupBy,
  scan,
  reduce,
  max,
  min,
  count,
  average,
  pluck,
  toArray,
  toPromise,
  share,
  shareReplay,
  publish,
  publishReplay,
  publishLast,
  multicast,
  refCount,
  cache,
  retry,
  retryWhen,
  repeat,
  repeatWhen,
  catchError,
  onErrorResumeNext,
  finalize,
  tap,
  materialize,
  dematerialize,
  timestamp,
  timeInterval,
  defaultIfEmpty,
  every,
  find,
  findIndex,
  isEmpty,
  single,
  some,
  
  // Utility functions
  noop,
  identity,
  isObservable,
  pipe,
  subscribeOn,
  observeOn,
  
  // Types
  Subscriber,
  Subscription,
  TeardownLogic,
  OperatorFunction,
  MonoTypeOperatorFunction,
  PartialObserver,
  NextObserver,
  ErrorObserver,
  CompletionObserver,
} from 'rxjs';

// ===== BASIC TYPES =====

// Enhanced data interfaces for reactive programming
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

// Enhanced event interfaces
interface UserEvent {
  type: 'created' | 'updated' | 'deleted' | 'login' | 'logout';
  userId: string;
  timestamp: Date;
  data?: any;
}

interface SystemEvent {
  type: 'error' | 'warning' | 'info' | 'debug';
  message: string;
  timestamp: Date;
  source: string;
  metadata?: Record<string, any>;
}

// Enhanced stream interfaces
interface DataStream<T> {
  id: string;
  name: string;
  data: T;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface StreamStatistics {
  totalEvents: number;
  eventsPerSecond: number;
  averageProcessingTime: number;
  errorRate: number;
  lastEventTime: Date;
  uptime: number;
}

// Enhanced WebSocket interface
interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: Date;
  id: string;
}

interface WebSocketState {
  connected: boolean;
  reconnecting: boolean;
  reconnectAttempts: number;
  lastError?: Error;
  lastConnected?: Date;
}

// ===== OBSERVABLE CREATION =====

// Advanced Observable creation patterns
const createObservables = () => {
  // Basic creation
  const numbers$ = of(1, 2, 3, 4, 5);
  const array$ = from([1, 2, 3, 4, 5]);
  const promise$ = from(Promise.resolve('Hello World'));
  const string$ = from('Hello RxJS');

  // Event-based observables
  const click$ = fromEvent(document, 'click');
  const keyup$ = fromEvent(document, 'keyup');
  const scroll$ = fromEvent(window, 'scroll');

  // Time-based observables
  const interval$ = interval(1000); // Emits every 1 second
  const timer$ = timer(1000); // Emits after 1 second then completes
  const range$ = range(1, 10); // Emits numbers 1-10

  // Complex creation patterns
  const userStream$ = new Observable<UserEvent>((subscriber) => {
    // Custom logic for user events
    const emitEvent = (event: UserEvent) => {
      subscriber.next(event);
    };

    // Setup event listeners or other data sources
    const cleanup = () => {
      console.log('Cleaning up user stream');
    };

    return cleanup;
  });

  // Conditional observable creation
  const conditional$ = iif(
    () => Math.random() > 0.5,
    of('Heads'),
    of('Tails')
  );

  // Resource management
  const resource$ = using(
    () => {
      const resource = { id: Math.random(), data: 'resource data' };
      console.log('Resource created:', resource.id);
      return {
        unsubscribe: () => console.log('Resource disposed:', resource.id)
      };
    },
    (resource) => of(`Using resource ${resource.id}`)
  );

  // Defer for lazy evaluation
  const deferred$ = defer(() => {
    const timestamp = Date.now();
    return of(`Created at ${timestamp}`);
  });

  return {
    numbers$,
    array$,
    promise$,
    string$,
    click$,
    keyup$,
    scroll$,
    interval$,
    timer$,
    range$,
    userStream$,
    conditional$,
    resource$,
    deferred$,
  };
};

// ===== SUBJECTS =====

// Advanced Subject patterns for multicasting
const createSubjects = () => {
  // Basic Subject
  const subject = new Subject<string>();
  
  // BehaviorSubject with initial value
  const userState$ = new BehaviorSubject<User | null>(null);
  
  // ReplaySubject with buffer size
  const recentEvents$ = new ReplaySubject<UserEvent>(10);
  
  // AsyncSubject (emits only last value on completion)
  const finalResult$ = new AsyncSubject<string>();

  // Subject usage examples
  const multicastExample = () => {
    const source$ = interval(1000).pipe(take(5));
    const multicasted$ = source$.pipe(multicast(subject));
    
    // Multiple subscribers
    const subscription1 = multicasted$.subscribe(value => 
      console.log('Subscriber 1:', value)
    );
    
    const subscription2 = multicasted$.subscribe(value => 
      console.log('Subscriber 2:', value)
    );
    
    // Connect the source
    multicasted$.connect();
    
    return { subscription1, subscription2 };
  };

  // BehaviorSubject for state management
  const stateManagement = () => {
    const initialState: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      role: 'user',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: { email: true, push: true, sms: false },
        privacy: { profileVisibility: 'public', showEmail: false, showPhone: false },
      },
      tags: [],
      scores: [],
      metadata: {},
    };

    const userState$ = new BehaviorSubject<User>(initialState);

    // State updates
    const updateUser = (updates: Partial<User>) => {
      const currentUser = userState$.value;
      const updatedUser = { ...currentUser, ...updates, updatedAt: new Date() };
      userState$.next(updatedUser);
    };

    return { userState$, updateUser };
  };

  return {
    subject,
    userState$,
    recentEvents$,
    finalResult$,
    multicastExample,
    stateManagement,
  };
};

// ===== TRANSFORMATION OPERATORS =====

// Advanced transformation patterns
const createTransformations = () => {
  // Map transformations
  const mapExample = of(1, 2, 3, 4, 5).pipe(
    map(x => x * 2),
    map(x => x + 1)
  );

  // Filter transformations
  const filterExample = of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
    filter(x => x % 2 === 0),
    filter(x => x > 4)
  );

  // Complex transformations with users
  const users$ = of<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      role: 'user',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: { email: true, push: true, sms: false },
        privacy: { profileVisibility: 'public', showEmail: false, showPhone: false },
      },
      tags: [],
      scores: [85, 90, 78],
      metadata: {},
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 25,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        theme: 'dark',
        language: 'en',
        notifications: { email: false, push: true, sms: false },
        privacy: { profileVisibility: 'friends', showEmail: true, showPhone: false },
      },
      tags: ['premium'],
      scores: [95, 88, 92],
      metadata: {},
    },
  ]);

  const userTransformations = users$.pipe(
    map(users => users.filter(user => user.isActive)),
    map(users => users.map(user => ({
      ...user,
      averageScore: user.scores.reduce((a, b) => a + b, 0) / user.scores.length,
      displayName: `${user.name} (${user.role})`
    }))),
    map(users => users.sort((a, b) => b.averageScore - a.averageScore))
  );

  // Pluck for property extraction
  const userNames$ = users$.pipe(
    map(users => users.map(user => user.name))
  );

  const userScores$ = users$.pipe(
    map(users => users.flatMap(user => user.scores))
  );

  return {
    mapExample,
    filterExample,
    userTransformations,
    userNames$,
    userScores$,
  };
};

// ===== COMBINATION OPERATORS =====

// Advanced combination patterns
const createCombinations = () => {
  // Merge for parallel execution
  const timer1$ = timer(1000).pipe(mapTo('Timer 1'));
  const timer2$ = timer(2000).pipe(mapTo('Timer 2'));
  const timer3$ = timer(3000).pipe(mapTo('Timer 3'));

  const merged$ = merge(timer1$, timer2$, timer3$);

  // Concat for sequential execution
  const concat$ = concat(timer1$, timer2$, timer3$);

  // CombineLatest for latest values
  const source1$ = interval(1000).pipe(map(x => `Source 1: ${x}`));
  const source2$ = interval(1500).pipe(map(x => `Source 2: ${x}`));

  const combined$ = combineLatest([source1$, source2$]).pipe(
    map(([s1, s2]) => `${s1} - ${s2}`)
  );

  // WithLatestFrom for combining with a primary stream
  const primary$ = interval(1000).pipe(map(x => `Primary: ${x}`));
  const secondary$ = interval(2000).pipe(map(x => `Secondary: ${x}`));

  const withLatest$ = primary$.pipe(
    withLatestFrom(secondary$),
    map(([primary, secondary]) => `${primary} with ${secondary}`)
  );

  // Zip for one-to-one pairing
  const zip$ = zip(source1$, source2$).pipe(
    map(([s1, s2]) => `${s1} paired with ${s2}`)
  );

  // Race for first-to-emit
  const race$ = race(timer1$, timer2$, timer3$);

  return {
    merged$,
    concat$,
    combined$,
    withLatest$,
    zip$,
    race$,
  };
};

// ===== HIGHER-ORDER OBSERVABLES =====

// Advanced higher-order observable patterns
const createHigherOrderObservables = () => {
  // SwitchMap for cancellation
  const searchInput$ = new Subject<string>();
  
  const searchResults$ = searchInput$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(query => {
      // Simulate API call
      return timer(1000).pipe(
        map(() => `Results for: ${query}`)
      );
    })
  );

  // MergeMap for parallel requests
  const userIds$ = of(['1', '2', '3', '4', '5']);
  
  const users$ = userIds$.pipe(
    mergeMap(id => {
      // Simulate user API call
      return timer(500).pipe(
        map(() => ({
          id,
          name: `User ${id}`,
          email: `user${id}@example.com`
        }))
      );
    })
  );

  // ConcatMap for sequential requests
  const sequentialUsers$ = userIds$.pipe(
    concatMap(id => {
      // Simulate sequential user API call
      return timer(500).pipe(
        map(() => ({
          id,
          name: `User ${id}`,
          email: `user${id}@example.com`
        }))
      );
    })
  );

  // ExhaustMap for ignoring new requests while active
  const click$ = new Subject<void>();
  
  const clickProcessing$ = click$.pipe(
    exhaustMap(() => {
      // Simulate processing that takes time
      return timer(2000).pipe(
        map(() => 'Click processed')
      );
    })
  );

  return {
    searchInput$,
    searchResults$,
    userIds$,
    users$,
    sequentialUsers$,
    click$,
    clickProcessing$,
  };
};

// ===== ERROR HANDLING =====

// Advanced error handling patterns
const createErrorHandling = () => {
  // CatchError for error recovery
  const errorSource$ = throwError(() => new Error('Something went wrong'));
  
  const recovered$ = errorSource$.pipe(
    catchError(error => {
      console.error('Error caught:', error.message);
      return of('Default value');
    })
  );

  // Retry with exponential backoff
  const unreliable$ = new Observable<string>(subscriber => {
    const shouldFail = Math.random() > 0.7;
    if (shouldFail) {
      subscriber.error(new Error('Random failure'));
    } else {
      subscriber.next('Success!');
      subscriber.complete();
    }
  });

  const retryWithBackoff$ = unreliable$.pipe(
    retryWhen(errors =>
      errors.pipe(
        // Log the error
        tap(error => console.log('Retrying after error:', error.message)),
        // Delay with exponential backoff
        delay(1000),
        // Limit retries
        take(3)
      )
    )
  );

  // Timeout handling
  const slow$ = timer(5000).pipe(mapTo('Slow response'));
  
  const withTimeout$ = slow$.pipe(
    timeout(2000),
    catchError(error => {
      if (error.name === 'TimeoutError') {
        return of('Request timed out');
      }
      return throwError(() => error);
    })
  );

  // Error boundary pattern
  const createErrorBoundary = <T>(source$: Observable<T>, fallback: T) => {
    return source$.pipe(
      catchError(error => {
        console.error('Error in boundary:', error);
        return of(fallback);
      })
    );
  };

  return {
    recovered$,
    retryWithBackoff$,
    withTimeout$,
    createErrorBoundary,
  };
};

// ===== TIME-BASED OPERATORS =====

// Advanced time-based patterns
const createTimeBasedOperators = () => {
  // Debounce for search
  const searchInput$ = new Subject<string>();
  
  const debouncedSearch$ = searchInput$.pipe(
    debounceTime(300),
    map(query => `Searching for: ${query}`)
  );

  // Throttle for scroll events
  const scroll$ = fromEvent(window, 'scroll');
  
  const throttledScroll$ = scroll$.pipe(
    throttleTime(100),
    map(() => 'Scroll event processed')
  );

  // Sample for periodic updates
  const rapidUpdates$ = interval(100);
  
  const sampled$ = rapidUpdates$.pipe(
    sampleTime(1000),
    map(value => `Sampled value: ${value}`)
  );

  // Buffer for batch processing
  const clicks$ = fromEvent(document, 'click');
  
  const bufferedClicks$ = clicks$.pipe(
    bufferTime(1000),
    map(clicks => clicks.length),
    filter(count => count > 0),
    map(count => `${count} clicks in last second`)
  );

  // Window for time-based grouping
  const windowed$ = interval(100).pipe(
    windowTime(1000),
    switchMap(window$ => window$.pipe(toArray(), count => count))
  );

  return {
    searchInput$,
    debouncedSearch$,
    throttledScroll$,
    sampled$,
    bufferedClicks$,
    windowed$,
  };
};

// ===== WEBSOCKET IMPLEMENTATION =====

// Advanced WebSocket implementation with RxJS
const createWebSocketImplementation = () => {
  class WebSocketService {
    private socket: WebSocket | null = null;
    private subject: Subject<WebSocketMessage> | null = null;
    private state$ = new BehaviorSubject<WebSocketState>({
      connected: false,
      reconnecting: false,
      reconnectAttempts: 0,
    });

    connect(url: string): Observable<WebSocketMessage> {
      if (this.subject && !this.subject.closed) {
        return this.subject.asObservable();
      }

      this.subject = new Subject<WebSocketMessage>();
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.state$.next({
          connected: true,
          reconnecting: false,
          reconnectAttempts: 0,
          lastConnected: new Date(),
        });
      };

      this.socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.subject!.next(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.state$.next({
          connected: false,
          reconnecting: false,
          reconnectAttempts: 0,
        });
        this.subject!.complete();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.state$.next({
          connected: false,
          reconnecting: false,
          reconnectAttempts: 0,
          lastError: new Error('WebSocket connection error'),
        });
        this.subject!.error(error);
      };

      return this.subject.asObservable();
    }

    disconnect(): void {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
      if (this.subject) {
        this.subject.complete();
        this.subject = null;
      }
    }

    send(message: WebSocketMessage): void {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(message));
      } else {
        console.warn('WebSocket not connected, message not sent:', message);
      }
    }

    getState(): Observable<WebSocketState> {
      return this.state$.asObservable();
    }

    reconnectWithBackoff(url: string, maxAttempts: number = 5): Observable<WebSocketMessage> {
      return this.state$.pipe(
        take(1),
        switchMap(state => {
          if (state.connected) {
            return this.connect(url);
          }

          return timer(1000 * Math.pow(2, state.reconnectAttempts)).pipe(
            switchMap(() => {
              this.state$.next({
                ...state,
                reconnecting: true,
                reconnectAttempts: state.reconnectAttempts + 1,
              });

              return this.connect(url).pipe(
                catchError(error => {
                  if (state.reconnectAttempts >= maxAttempts) {
                    return throwError(() => error);
                  }
                  return this.reconnectWithBackoff(url, maxAttempts);
                })
              );
            })
          );
        })
      );
    }
  }

  const wsService = new WebSocketService();

  // Usage examples
  const connectToWebSocket = (url: string) => {
    const messages$ = wsService.connect(url);
    const state$ = wsService.getState();

    messages$.subscribe({
      next: message => console.log('Received message:', message),
      error: error => console.error('WebSocket error:', error),
      complete: () => console.log('WebSocket completed'),
    });

    state$.subscribe(state => console.log('WebSocket state:', state));

    return { messages$, state$ };
  };

  return {
    WebSocketService,
    wsService,
    connectToWebSocket,
  };
};

// ===== PERFORMANCE MONITORING =====

// Advanced performance monitoring with RxJS
const createPerformanceMonitoring = () => {
  const events$ = new Subject<DataStream<any>>();
  
  // Stream statistics
  const statistics$ = events$.pipe(
    scan((acc, event) => {
      const now = Date.now();
      const eventsPerSecond = acc.events.length > 0 
        ? 1000 / (now - acc.events[acc.events.length - 1].timestamp.getTime())
        : 0;

      return {
        totalEvents: acc.totalEvents + 1,
        events: [...acc.events.slice(-99), event], // Keep last 100 events
        eventsPerSecond,
        averageProcessingTime: acc.averageProcessingTime,
        errorRate: acc.errorRate,
        lastEventTime: new Date(now),
        uptime: now - acc.startTime,
      };
    }, {
      totalEvents: 0,
      events: [] as DataStream<any>[],
      eventsPerSecond: 0,
      averageProcessingTime: 0,
      errorRate: 0,
      lastEventTime: new Date(),
      startTime: Date.now(),
    } as StreamStatistics & { events: DataStream<any>[]; startTime: number })
  );

  // Performance alerts
  const performanceAlerts$ = statistics$.pipe(
    filter(stats => stats.eventsPerSecond > 100), // High frequency alert
    map(stats => `High event frequency: ${stats.eventsPerSecond} events/sec`)
  );

  // Error rate monitoring
  const errorEvents$ = events$.pipe(
    filter(event => event.metadata?.error === true)
  );

  const errorRate$ = statistics$.pipe(
    map(stats => {
      const errorCount = stats.events.filter(e => e.metadata?.error === true).length;
      return stats.totalEvents > 0 ? (errorCount / stats.totalEvents) * 100 : 0;
    })
  );

  const errorAlerts$ = errorRate$.pipe(
    filter(rate => rate > 5), // 5% error rate threshold
    map(rate => `High error rate: ${rate.toFixed(2)}%`)
  );

  return {
    events$,
    statistics$,
    performanceAlerts$,
    errorEvents$,
    errorRate$,
    errorAlerts$,
  };
};

// ===== EXERCISES =====

/*
EXERCISE 1: Create a reactive form validation system that:
- Uses RxJS for real-time validation
- Debounces input for performance
- Combines multiple validation rules
- Provides visual feedback
- Is fully typed

EXERCISE 2: Build a reactive data synchronization service that:
- Syncs data between client and server
- Handles conflicts and resolution
- Supports offline mode
- Provides real-time updates
- Is fully typed

EXERCISE 3: Create a reactive notification system that:
- Handles multiple notification types
- Supports notification routing
- Provides notification history
- Handles notification preferences
- Is fully typed

EXERCISE 4: Build a reactive analytics dashboard that:
- Processes real-time data streams
- Provides aggregations and statistics
- Supports custom time ranges
- Handles data visualization
- Is fully typed

EXERCISE 5: Create a reactive state management system that:
- Manages application state reactively
- Supports state persistence
- Provides state history and undo
- Handles state synchronization
- Is fully typed
*/

// Export functions and utilities
export {
  // Observable creation
  createObservables,
  
  // Subjects
  createSubjects,
  
  // Transformations
  createTransformations,
  
  // Combinations
  createCombinations,
  
  // Higher-order observables
  createHigherOrderObservables,
  
  // Error handling
  createErrorHandling,
  
  // Time-based operators
  createTimeBasedOperators,
  
  // WebSocket implementation
  createWebSocketImplementation,
  
  // Performance monitoring
  createPerformanceMonitoring,
};

// Export types
export type {
  User,
  UserPreferences,
  UserProfile,
  UserEvent,
  SystemEvent,
  DataStream,
  StreamStatistics,
  WebSocketMessage,
  WebSocketState,
};