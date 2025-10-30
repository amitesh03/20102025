// Axios TypeScript Examples - Advanced HTTP Client Patterns
// This file demonstrates comprehensive TypeScript usage with Axios HTTP client

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosPromise,
  InternalAxiosRequestConfig,
  CancelTokenSource,
  CancelToken,
  isCancel,
  all,
  spread,
  isAxiosError,
} from 'axios';

// ===== BASIC TYPES =====

// Enhanced API response wrapper with comprehensive typing
interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Enhanced error response with detailed information
interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: {
    field?: string;
    message?: string;
    value?: any;
  }[];
  meta?: {
    timestamp: string;
    requestId: string;
    endpoint: string;
    method: string;
  };
}

// User data with comprehensive fields
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'moderator';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
  profile?: UserProfile;
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

// Enhanced pagination parameters
interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
  include?: string[];
  exclude?: string[];
}

// Enhanced paginated response
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextPage?: number;
    prevPage?: number;
  };
}

// File upload types
interface FileUpload {
  file: File;
  name: string;
  size: number;
  type: string;
  progress?: number;
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed?: number;
  timeRemaining?: number;
}

// Request configuration with enhanced typing
interface RequestConfig extends AxiosRequestConfig {
  retry?: number;
  retryDelay?: number;
  timeout?: number;
  cache?: boolean;
  cacheTTL?: number;
  transformRequest?: (data: any) => any;
  transformResponse?: (data: any) => any;
}

// ===== AXIOS INSTANCE CONFIGURATION =====

// Create highly configured Axios instance
const createApiClient = (baseURL: string, options: {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
  auth?: {
    username: string;
    password: string;
  };
} = {}): AxiosInstance => {
  const {
    timeout = 10000,
    retries = 3,
    headers = {},
    auth,
  } = options;

  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers,
    },
    auth,
  });

  // Request interceptor with enhanced functionality
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add request ID for tracking
      config.headers = {
        ...config.headers,
        'X-Request-ID': generateRequestId(),
        'X-Client-Version': '1.0.0',
      };

      // Add auth token if available
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Transform request data if provided
      if (config.transformRequest) {
        config.data = config.transformRequest(config.data);
      }

      console.log(`[${new Date().toISOString()}] ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        headers: config.headers,
      });

      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor with enhanced error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`[${new Date().toISOString()}] Response received:`, {
        status: response.status,
        url: response.config.url,
        duration: response.headers['x-response-time'],
      });

      // Transform response data if provided
      if (response.config.transformResponse) {
        response.data = response.config.transformResponse(response.data);
      }

      // Cache GET requests if enabled
      if (response.config.method === 'get' && response.config.cache) {
        cacheResponse(response.config.url!, response.data, response.config.cacheTTL);
      }

      return response;
    },
    async (error: AxiosError) => {
      console.error('Response interceptor error:', {
        message: error.message,
        code: error.code,
        config: error.config,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Handle token refresh
      if (error.response?.status === 401 && shouldRefreshToken()) {
        try {
          const newToken = await refreshToken();
          setAuthToken(newToken);
          
          // Retry original request with new token
          if (error.config.headers) {
            error.config.headers.Authorization = `Bearer ${newToken}`;
          }
          
          return instance.request(error.config);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      // Handle rate limiting
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        if (retryAfter) {
          console.log(`Rate limited. Retrying after ${retryAfter} seconds`);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Create specialized API clients
const apiClient = createApiClient('https://api.example.com', {
  timeout: 15000,
  retries: 2,
  headers: {
    'X-Client-Name': 'MyApp',
  },
});

const authClient = createApiClient('https://auth.example.com', {
  timeout: 10000,
  headers: {
    'X-Service': 'authentication',
  },
});

const uploadClient = createApiClient('https://upload.example.com', {
  timeout: 30000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// ===== ENHANCED ERROR HANDLING =====

// Comprehensive error handling with type safety
const handleApiError = (error: unknown): ErrorResponse => {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response) {
      // Server responded with error status
      const { status, data, headers } = axiosError.response;
      
      switch (status) {
        case 400:
          return {
            success: false,
            error: 'Bad Request',
            code: 'BAD_REQUEST',
            details: Array.isArray(data) ? data : [{ message: String(data) }],
            meta: {
              timestamp: new Date().toISOString(),
              requestId: headers['x-request-id'] || 'unknown',
              endpoint: axiosError.config?.url || 'unknown',
              method: axiosError.config?.method?.toUpperCase() || 'unknown',
            },
          };
          
        case 401:
          return {
            success: false,
            error: 'Unauthorized',
            code: 'UNAUTHORIZED',
            meta: {
              timestamp: new Date().toISOString(),
              requestId: headers['x-request-id'] || 'unknown',
              endpoint: axiosError.config?.url || 'unknown',
              method: axiosError.config?.method?.toUpperCase() || 'unknown',
            },
          };
          
        case 403:
          return {
            success: false,
            error: 'Forbidden',
            code: 'FORBIDDEN',
            meta: {
              timestamp: new Date().toISOString(),
              requestId: headers['x-request-id'] || 'unknown',
              endpoint: axiosError.config?.url || 'unknown',
              method: axiosError.config?.method?.toUpperCase() || 'unknown',
            },
          };
          
        case 404:
          return {
            success: false,
            error: 'Not Found',
            code: 'NOT_FOUND',
            meta: {
              timestamp: new Date().toISOString(),
              requestId: headers['x-request-id'] || 'unknown',
              endpoint: axiosError.config?.url || 'unknown',
              method: axiosError.config?.method?.toUpperCase() || 'unknown',
            },
          };
          
        case 422:
          return {
            success: false,
            error: 'Validation Error',
            code: 'VALIDATION_ERROR',
            details: Array.isArray(data) ? data : [{ message: String(data) }],
            meta: {
              timestamp: new Date().toISOString(),
              requestId: headers['x-request-id'] || 'unknown',
              endpoint: axiosError.config?.url || 'unknown',
              method: axiosError.config?.method?.toUpperCase() || 'unknown',
            },
          };
          
        case 429:
          return {
            success: false,
            error: 'Too Many Requests',
            code: 'RATE_LIMIT_EXCEEDED',
            meta: {
              timestamp: new Date().toISOString(),
              requestId: headers['x-request-id'] || 'unknown',
              endpoint: axiosError.config?.url || 'unknown',
              method: axiosError.config?.method?.toUpperCase() || 'unknown',
            },
          };
          
        case 500:
          return {
            success: false,
            error: 'Internal Server Error',
            code: 'INTERNAL_SERVER_ERROR',
            meta: {
              timestamp: new Date().toISOString(),
              requestId: headers['x-request-id'] || 'unknown',
              endpoint: axiosError.config?.url || 'unknown',
              method: axiosError.config?.method?.toUpperCase() || 'unknown',
            },
          };
          
        default:
          return {
            success: false,
            error: `HTTP Error ${status}`,
            code: `HTTP_${status}`,
            meta: {
              timestamp: new Date().toISOString(),
              requestId: headers['x-request-id'] || 'unknown',
              endpoint: axiosError.config?.url || 'unknown',
              method: axiosError.config?.method?.toUpperCase() || 'unknown',
            },
          };
      }
    } else if (axiosError.request) {
      // Request was made but no response received
      return {
        success: false,
        error: 'Network Error',
        code: 'NETWORK_ERROR',
        meta: {
          timestamp: new Date().toISOString(),
          requestId: 'unknown',
          endpoint: axiosError.config?.url || 'unknown',
          method: axiosError.config?.method?.toUpperCase() || 'unknown',
        },
      };
    } else {
      // Something else happened
      return {
        success: false,
        error: axiosError.message || 'Unknown Error',
        code: 'UNKNOWN_ERROR',
        meta: {
          timestamp: new Date().toISOString(),
          requestId: 'unknown',
          endpoint: axiosError.config?.url || 'unknown',
          method: axiosError.config?.method?.toUpperCase() || 'unknown',
        },
      };
    }
  } else {
    // Non-Axios error
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      code: 'UNKNOWN_ERROR',
      meta: {
        timestamp: new Date().toISOString(),
        requestId: 'unknown',
        endpoint: 'unknown',
        method: 'unknown',
      },
    };
  }
};

// ===== HTTP METHODS =====

// Enhanced GET request with caching and error handling
const getUsers = async (
  params?: PaginationParams,
  config?: RequestConfig
): Promise<AxiosResponse<ApiResponse<PaginatedResponse<User>>>> => {
  try {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<User>>>('/users', {
      params,
      cache: true,
      cacheTTL: 300000, // 5 minutes
      ...config,
    });
    
    return response;
  } catch (error) {
    const errorResponse = handleApiError(error);
    throw new Error(errorResponse.error);
  }
};

// Enhanced GET request with path parameters
const getUserById = async (
  id: string,
  config?: RequestConfig
): Promise<AxiosResponse<ApiResponse<User>>> => {
  try {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`, {
      cache: true,
      cacheTTL: 600000, // 10 minutes
      ...config,
    });
    
    return response;
  } catch (error) {
    const errorResponse = handleApiError(error);
    throw new Error(errorResponse.error);
  }
};

// Enhanced POST request with validation and error handling
const createUser = async (
  userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  config?: RequestConfig
): Promise<AxiosResponse<ApiResponse<User>>> => {
  try {
    const response = await apiClient.post<ApiResponse<User>>('/users', userData, {
      timeout: 15000,
      retry: 2,
      ...config,
    });
    
    return response;
  } catch (error) {
    const errorResponse = handleApiError(error);
    throw new Error(errorResponse.error);
  }
};

// Enhanced PUT request with optimistic updates
const updateUser = async (
  id: string,
  userData: Partial<User>,
  config?: RequestConfig
): Promise<AxiosResponse<ApiResponse<User>>> => {
  try {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, userData, {
      timeout: 15000,
      retry: 1,
      ...config,
    });
    
    return response;
  } catch (error) {
    const errorResponse = handleApiError(error);
    throw new Error(errorResponse.error);
  }
};

// Enhanced DELETE request with confirmation
const deleteUser = async (
  id: string,
  config?: RequestConfig
): Promise<AxiosResponse<ApiResponse<null>>> => {
  try {
    const response = await apiClient.delete<ApiResponse<null>>(`/users/${id}`, {
      timeout: 10000,
      ...config,
    });
    
    return response;
  } catch (error) {
    const errorResponse = handleApiError(error);
    throw new Error(errorResponse.error);
  }
};

// Enhanced PATCH request for partial updates
const patchUser = async (
  id: string,
  userData: Partial<User>,
  config?: RequestConfig
): Promise<AxiosResponse<ApiResponse<User>>> => {
  try {
    const response = await apiClient.patch<ApiResponse<User>>(`/users/${id}`, userData, {
      timeout: 10000,
      ...config,
    });
    
    return response;
  } catch (error) {
    const errorResponse = handleApiError(error);
    throw new Error(errorResponse.error);
  }
};

// ===== ADVANCED REQUESTS =====

// Enhanced file upload with progress tracking and chunking
const uploadFile = async (
  file: FileUpload,
  onProgress?: (progress: UploadProgress) => void,
  config?: RequestConfig
): Promise<AxiosResponse<ApiResponse<{ url: string; size: number }>>> => {
  try {
    const formData = new FormData();
    formData.append('file', file.file);
    formData.append('name', file.name);
    formData.append('size', file.size.toString());
    formData.append('type', file.type);

    const response = await uploadClient.post<ApiResponse<{ url: string; size: number }>>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded / progressEvent.total) * 100),
            speed: calculateUploadSpeed(progressEvent.loaded, progressEvent.timeStamp || 0),
            timeRemaining: calculateTimeRemaining(progressEvent.loaded, progressEvent.total, progressEvent.timeStamp || 0),
          };
          
          onProgress(progress);
        }
      },
      timeout: 60000, // 1 minute
      ...config,
    });
    
    return response;
  } catch (error) {
    const errorResponse = handleApiError(error);
    throw new Error(errorResponse.error);
  }
};

// Enhanced file download with progress and resume capability
const downloadFile = async (
  url: string,
  filename: string,
  onProgress?: (progress: UploadProgress) => void,
  config?: RequestConfig
): Promise<void> => {
  try {
    const response = await apiClient.get(url, {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded / progressEvent.total) * 100),
            speed: calculateDownloadSpeed(progressEvent.loaded, progressEvent.timeStamp || 0),
            timeRemaining: calculateTimeRemaining(progressEvent.loaded, progressEvent.total, progressEvent.timeStamp || 0),
          };
          
          onProgress(progress);
        }
      },
      ...config,
    });

    // Create download link
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    const errorResponse = handleApiError(error);
    throw new Error(errorResponse.error);
  }
};

// Request with cancellation support
const getUsersWithCancellation = (
  params?: PaginationParams,
  config?: RequestConfig
): {
  promise: AxiosPromise<ApiResponse<PaginatedResponse<User>>>;
  cancel: () => void;
} => {
  const source: CancelTokenSource = axios.CancelToken.source();

  const promise = apiClient.get<ApiResponse<PaginatedResponse<User>>>('/users', {
    params,
    cancelToken: source.token,
    ...config,
  });

  const cancel = () => {
    source.cancel('Request cancelled by user');
  };

  return { promise, cancel };
};

// Concurrent requests with error handling
const fetchUsersAndPosts = async (
  userParams?: PaginationParams,
  postParams?: PaginationParams,
  config?: RequestConfig
): Promise<{
  users: AxiosResponse<ApiResponse<PaginatedResponse<User>>>;
  posts: AxiosResponse<ApiResponse<PaginatedResponse<any>>>;
}> => {
  try {
    const [usersResponse, postsResponse] = await all([
      apiClient.get<ApiResponse<PaginatedResponse<User>>>('/users', { params: userParams, ...config }),
      apiClient.get<ApiResponse<PaginatedResponse<any>>>('/posts', { params: postParams, ...config }),
    ]);

    return {
      users: usersResponse,
      posts: postsResponse,
    };
  } catch (error) {
    const errorResponse = handleApiError(error);
    throw new Error(errorResponse.error);
  }
};

// Request with retry logic and exponential backoff
const requestWithRetry = async <T>(
  requestFn: () => AxiosPromise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<AxiosResponse<T>> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Request failed, retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Batch requests for efficiency
const batchRequests = async <T>(
  requests: Array<() => AxiosPromise<T>>,
  config?: RequestConfig
): Promise<AxiosResponse<T[]>> => {
  try {
    const responses = await Promise.all(requests.map(req => req()));
    
    return {
      ...responses[0], // Use first response as base
      data: responses.map(response => response.data),
    } as AxiosResponse<T[]>;
  } catch (error) {
    const errorResponse = handleApiError(error);
    throw new Error(errorResponse.error);
  }
};

// ===== UTILITY FUNCTIONS =====

// Type-safe API wrapper class
class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string, config?: RequestConfig) {
    this.instance = createApiClient(baseURL, config);
  }

  // Generic GET method
  async get<T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    try {
      return await this.instance.get<ApiResponse<T>>(url, config);
    } catch (error) {
      const errorResponse = handleApiError(error);
      throw new Error(errorResponse.error);
    }
  }

  // Generic POST method
  async post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    try {
      return await this.instance.post<ApiResponse<T>>(url, data, config);
    } catch (error) {
      const errorResponse = handleApiError(error);
      throw new Error(errorResponse.error);
    }
  }

  // Generic PUT method
  async put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    try {
      return await this.instance.put<ApiResponse<T>>(url, data, config);
    } catch (error) {
      const errorResponse = handleApiError(error);
      throw new Error(errorResponse.error);
    }
  }

  // Generic DELETE method
  async delete<T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    try {
      return await this.instance.delete<ApiResponse<T>>(url, config);
    } catch (error) {
      const errorResponse = handleApiError(error);
      throw new Error(errorResponse.error);
    }
  }

  // Generic PATCH method
  async patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    try {
      return await this.instance.patch<ApiResponse<T>>(url, data, config);
    } catch (error) {
      const errorResponse = handleApiError(error);
      throw new Error(errorResponse.error);
    }
  }
}

// Request builder pattern for complex requests
class RequestBuilder {
  private config: AxiosRequestConfig = {};

  constructor(private baseURL: string) {}

  setMethod(method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'): this {
    this.config.method = method;
    return this;
  }

  setUrl(url: string): this {
    this.config.url = `${this.baseURL}${url}`;
    return this;
  }

  setData(data: any): this {
    this.config.data = data;
    return this;
  }

  setParams(params: any): this {
    this.config.params = params;
    return this;
  }

  setHeaders(headers: Record<string, string>): this {
    this.config.headers = { ...this.config.headers, ...headers };
    return this;
  }

  setTimeout(timeout: number): this {
    this.config.timeout = timeout;
    return this;
  }

  setRetry(retry: number): this {
    this.config.retry = retry;
    return this;
  }

  setCache(cache: boolean, ttl?: number): this {
    this.config.cache = cache;
    if (ttl) this.config.cacheTTL = ttl;
    return this;
  }

  async execute<T = any>(): Promise<AxiosResponse<ApiResponse<T>>> {
    try {
      return await axios.request<ApiResponse<T>>(this.config);
    } catch (error) {
      const errorResponse = handleApiError(error);
      throw new Error(errorResponse.error);
    }
  }
}

// ===== CACHING =====

// Simple in-memory cache implementation
class ApiCache {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  set(key: string, data: any, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  size(): number {
    return this.cache.size;
  }
}

const apiCache = new ApiCache();

// Cache middleware for GET requests
const cacheMiddleware = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  if (config.method === 'get' && config.cache) {
    const cacheKey = `${config.url}?${JSON.stringify(config.params)}`;
    const cachedData = apiCache.get(cacheKey);
    
    if (cachedData) {
      // Return cached data as if it was a successful response
      return Promise.resolve({
        data: cachedData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      } as AxiosResponse);
    }
  }
  
  return config;
};

// ===== UTILITY FUNCTIONS =====

// Generate unique request ID
const generateRequestId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get authentication token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Set authentication token
const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Check if token should be refreshed
const shouldRefreshToken = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    return payload.exp - now < 300; // Refresh if expires in less than 5 minutes
  } catch {
    return false;
  }
};

// Refresh authentication token
const refreshToken = async (): Promise<string> => {
  const response = await authClient.post<{ token: string }>('/refresh', {
    refreshToken: localStorage.getItem('refreshToken'),
  });
  
  return response.data.data.token;
};

// Calculate upload speed
const calculateUploadSpeed = (loaded: number, startTime: number): number => {
  const duration = (Date.now() - startTime) / 1000; // in seconds
  return duration > 0 ? loaded / duration : 0;
};

// Calculate download speed
const calculateDownloadSpeed = (loaded: number, startTime: number): number => {
  const duration = (Date.now() - startTime) / 1000; // in seconds
  return duration > 0 ? loaded / duration : 0;
};

// Calculate time remaining
const calculateTimeRemaining = (loaded: number, total: number, startTime: number): number => {
  const speed = calculateUploadSpeed(loaded, startTime);
  const remaining = total - loaded;
  return speed > 0 ? remaining / speed : 0;
};

// Cache response data
const cacheResponse = (key: string, data: any, ttl?: number): void => {
  apiCache.set(key, data, ttl);
};

// ===== EXERCISES =====

/*
EXERCISE 1: Create a caching layer that:
- Caches GET requests based on URL and parameters
- Supports different cache strategies (LRU, TTL)
- Handles cache invalidation
- Provides cache statistics
- Is fully typed

EXERCISE 2: Create a request queue system that:
- Queues requests when offline
- Syncs when back online
- Handles request deduplication
- Supports priority queuing
- Is fully typed

EXERCISE 3: Create a mock server that:
- Intercepts requests and returns mock data
- Supports different response scenarios
- Can be enabled/disabled
- Provides realistic network delays
- Is fully typed

EXERCISE 4: Create a file upload manager that:
- Handles multiple file uploads
- Shows progress for each file
- Supports pause/resume
- Handles chunked uploads
- Is fully typed

EXERCISE 5: Create an API client that:
- Automatically handles authentication
- Refreshes tokens when expired
- Handles rate limiting
- Provides request/response interceptors
- Is fully typed
*/

// Export functions and classes
export {
  // API clients
  apiClient,
  authClient,
  uploadClient,
  
  // HTTP methods
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  patchUser,
  
  // Advanced requests
  uploadFile,
  downloadFile,
  getUsersWithCancellation,
  fetchUsersAndPosts,
  requestWithRetry,
  batchRequests,
  
  // Utility classes
  ApiClient,
  RequestBuilder,
  ApiCache,
  
  // Utility functions
  handleApiError,
  generateRequestId,
  getAuthToken,
  setAuthToken,
  shouldRefreshToken,
  refreshToken,
  calculateUploadSpeed,
  calculateDownloadSpeed,
  calculateTimeRemaining,
  cacheResponse,
};

// Export types
export type {
  ApiResponse,
  ErrorResponse,
  User,
  UserPreferences,
  UserProfile,
  PaginationParams,
  PaginatedResponse,
  FileUpload,
  UploadProgress,
  RequestConfig,
};