// React TypeScript Examples - Advanced Patterns and Best Practices
// This file demonstrates comprehensive TypeScript patterns with modern React

import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useRef,
  useCallback,
  useMemo,
  useReducer,
  useImperativeHandle,
  useLayoutEffect,
  useDebugValue,
  ReactNode,
  ComponentType,
  HTMLAttributes,
  FormEvent,
  ChangeEvent,
  MouseEvent,
  KeyboardEvent,
  ForwardRefExoticComponent,
  RefAttributes,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
} from 'react';

// ===== BASIC COMPONENT TYPES =====

// Interface for user data with comprehensive typing
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
  address?: Address;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  privacy: 'public' | 'friends' | 'private';
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Enhanced component props with generics and constraints
interface UserCardProps<T extends User = User> {
  user: T;
  onEdit?: (user: T) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
  className?: string;
  children?: ReactNode;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  loading?: boolean;
}

// Functional component with advanced typing
const UserCard = <T extends User>({
  user,
  onEdit,
  onDelete,
  onToggleActive,
  className = '',
  children,
  variant = 'default',
  showActions = true,
  loading = false,
}: UserCardProps<T>) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEdit = useCallback(() => {
    onEdit?.(user);
  }, [user, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete?.(user.id);
  }, [user.id, onDelete]);

  const handleToggleActive = useCallback(() => {
    onToggleActive?.(user.id, !user.isActive);
  }, [user.id, user.isActive, onToggleActive]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <div className={`user-card user-card--${variant} ${className}`}>
      {loading ? (
        <div className="user-card__loading">Loading...</div>
      ) : (
        <>
          <div className="user-card__header">
            <img 
              src={user.avatar || '/default-avatar.png'} 
              alt={user.name}
              className="user-card__avatar"
            />
            <div className="user-card__info">
              <h3 className="user-card__name">{user.name}</h3>
              <p className="user-card__email">{user.email}</p>
              <span className={`user-card__role user-card__role--${user.role}`}>
                {user.role}
              </span>
            </div>
            <div className="user-card__status">
              <span className={`user-card__status-indicator ${user.isActive ? 'active' : 'inactive'}`} />
            </div>
          </div>
          
          {variant === 'detailed' && (
            <div className="user-card__details">
              <p>Theme: {user.preferences.theme}</p>
              <p>Language: {user.preferences.language}</p>
              <p>Notifications: {user.preferences.notifications ? 'Enabled' : 'Disabled'}</p>
              {user.address && (
                <p>Location: {user.address.city}, {user.address.country}</p>
              )}
            </div>
          )}
          
          {showActions && (
            <div className="user-card__actions">
              <button onClick={handleEdit} className="btn btn--primary">
                Edit
              </button>
              <button 
                onClick={handleToggleActive}
                className={`btn btn--${user.isActive ? 'warning' : 'success'}`}
              >
                {user.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={handleDelete} className="btn btn--danger">
                Delete
              </button>
              {variant === 'detailed' && (
                <button onClick={toggleExpanded} className="btn btn--secondary">
                  {isExpanded ? 'Collapse' : 'Expand'}
                </button>
              )}
            </div>
          )}
          
          {children}
        </>
      )}
    </div>
  );
};

// ===== GENERIC COMPONENTS =====

// Advanced generic list component with multiple features
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  className?: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  virtualized?: boolean;
  itemHeight?: number;
  onItemClick?: (item: T, index: number) => void;
  selectedItems?: T[];
  multiSelect?: boolean;
}

function List<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = 'No items available',
  className = '',
  loading = false,
  error = null,
  onRetry,
  virtualized = false,
  itemHeight = 50,
  onItemClick,
  selectedItems = [],
  multiSelect = false,
}: ListProps<T>) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  const listRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!virtualized || !listRef.current) return;

    const { scrollTop, clientHeight } = listRef.current;
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(start + Math.ceil(clientHeight / itemHeight) + 1, items.length);
    
    setVisibleRange({ start, end });
  }, [virtualized, itemHeight, items.length]);

  const visibleItems = useMemo(() => {
    if (!virtualized) return items;
    return items.slice(visibleRange.start, visibleRange.end);
  }, [virtualized, items, visibleRange]);

  const isSelected = useCallback((item: T) => {
    return selectedItems.some(selected => 
      keyExtractor(selected) === keyExtractor(item)
    );
  }, [selectedItems, keyExtractor]);

  const handleItemClick = useCallback((item: T, index: number) => {
    onItemClick?.(item, index);
  }, [onItemClick]);

  if (loading) {
    return <div className="list__loading">Loading items...</div>;
  }

  if (error) {
    return (
      <div className="list__error">
        <p>Error: {error}</p>
        {onRetry && (
          <button onClick={onRetry} className="btn btn--primary">
            Retry
          </button>
        )}
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="list__empty">{emptyMessage}</div>;
  }

  return (
    <div
      ref={listRef}
      className={`list ${className}`}
      onScroll={handleScroll}
      style={{
        height: virtualized ? `${items.length * itemHeight}px` : 'auto',
      }}
    >
      {virtualized && (
        <div style={{ height: `${visibleRange.start * itemHeight}px` }} />
      )}
      
      <ul className="list__items">
        {visibleItems.map((item, index) => {
          const actualIndex = virtualized ? visibleRange.start + index : index;
          const key = keyExtractor(item);
          const selected = isSelected(item);
          
          return (
            <li
              key={key}
              className={`list__item ${selected ? 'list__item--selected' : ''}`}
              onClick={() => handleItemClick(item, actualIndex)}
              style={{
                height: virtualized ? `${itemHeight}px` : 'auto',
              }}
            >
              {renderItem(item, actualIndex)}
            </li>
          );
        })}
      </ul>
      
      {virtualized && (
        <div style={{ height: `${(items.length - visibleRange.end) * itemHeight}px` }} />
      )}
    </div>
  );
}

// ===== ADVANCED HOOKS =====

// Custom hook with complex state management
interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  retry?: number;
  retryDelay?: number;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  mutate: (newData: T) => void;
  reset: () => void;
}

function useApi<T>(
  url: string,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const {
    immediate = true,
    onSuccess,
    onError,
    retry = 0,
    retryDelay = 1000,
  } = options;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
      
      // Retry logic
      if (retryCount < retry) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchData();
        }, retryDelay * (retryCount + 1));
      }
    } finally {
      setLoading(false);
    }
  }, [url, onSuccess, onError, retry, retryDelay, retryCount]);

  const refetch = useCallback(async () => {
    setRetryCount(0);
    await fetchData();
  }, [fetchData]);

  const mutate = useCallback((newData: T) => {
    setData(newData);
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setRetryCount(0);
  }, []);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate, fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    mutate,
    reset,
  };
}

// Context with TypeScript and provider pattern
interface ThemeContextType {
  theme: 'light' | 'dark' | 'auto';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  systemTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark' | 'auto'>('auto');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // Detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'auto';
      return 'light';
    });
  }, []);

  const setTheme = useCallback((newTheme: 'light' | 'dark' | 'auto') => {
    setThemeState(newTheme);
  }, []);

  const effectiveTheme = theme === 'auto' ? systemTheme : theme;

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }, [effectiveTheme]);

  const value = useMemo(() => ({
    theme,
    toggleTheme,
    setTheme,
    systemTheme,
  }), [theme, toggleTheme, setTheme, systemTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// ===== FORM HANDLING =====

// Advanced form handling with validation
interface FormField<T = any> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

interface FormState<T extends Record<string, any>> {
  fields: { [K in keyof T]: FormField<T[K]> };
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

interface FormOptions<T extends Record<string, any>> {
  initialValues: T;
  validation?: Partial<Record<keyof T, (value: any) => string | undefined>>;
  onSubmit: (values: T) => Promise<void> | void;
  onChange?: (values: T, fieldName: keyof T) => void;
}

function useForm<T extends Record<string, any>>(options: FormOptions<T>) {
  const { initialValues, validation, onSubmit, onChange } = options;

  const [formState, setFormState] = useState<FormState<T>>(() => ({
    fields: Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = {
        value: initialValues[key as keyof T],
        touched: false,
        dirty: false,
      };
      return acc;
    }, {} as { [K in keyof T]: FormField<T[K]> }),
    isValid: true,
    isSubmitting: false,
    isDirty: false,
  }));

  const validateField = useCallback((fieldName: keyof T, value: any): string | undefined => {
    const validator = validation?.[fieldName];
    if (validator) {
      return validator(value);
    }
    return undefined;
  }, [validation]);

  const validateForm = useCallback((fields: FormState<T>['fields']): boolean => {
    let isValid = true;
    
    Object.entries(fields).forEach(([key, field]) => {
      const error = validateField(key as keyof T, field.value);
      if (error) {
        isValid = false;
      }
    });
    
    return isValid;
  }, [validateField]);

  const setFieldValue = useCallback((fieldName: keyof T, value: any) => {
    setFormState(prev => {
      const error = validateField(fieldName, value);
      const newFields = {
        ...prev.fields,
        [fieldName]: {
          ...prev.fields[fieldName],
          value,
          error,
          touched: true,
          dirty: value !== initialValues[fieldName],
        },
      };
      
      const isValid = validateForm(newFields);
      const isDirty = Object.values(newFields).some(field => field.dirty);
      
      return {
        ...prev,
        fields: newFields,
        isValid,
        isDirty,
      };
    });
    
    onChange?.({ ...initialValues, [fieldName]: value }, fieldName);
  }, [validateField, validateForm, initialValues, onChange]);

  const setFieldError = useCallback((fieldName: keyof T, error: string) => {
    setFormState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [fieldName]: {
          ...prev.fields[fieldName],
          error,
        },
      },
      isValid: false,
    }));
  }, []);

  const handleSubmit = useCallback(async (e?: FormEvent) => {
    e?.preventDefault();
    
    if (!formState.isValid) return;
    
    setFormState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      const values = Object.entries(formState.fields).reduce((acc, [key, field]) => {
        acc[key as keyof T] = field.value;
        return acc;
      }, {} as T);
      
      await onSubmit(values);
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [formState.fields, formState.isValid, onSubmit]);

  const reset = useCallback(() => {
    setFormState({
      fields: Object.keys(initialValues).reduce((acc, key) => {
        acc[key as keyof T] = {
          value: initialValues[key as keyof T],
          touched: false,
          dirty: false,
        };
        return acc;
      }, {} as { [K in keyof T]: FormField<T[K]> }),
      isValid: true,
      isSubmitting: false,
      isDirty: false,
    });
  }, [initialValues]);

  const getFieldProps = useCallback((fieldName: keyof T) => ({
    value: formState.fields[fieldName].value,
    onChange: (value: any) => setFieldValue(fieldName, value),
    error: formState.fields[fieldName].error,
    touched: formState.fields[fieldName].touched,
    dirty: formState.fields[fieldName].dirty,
  }), [formState.fields, setFieldValue]);

  return {
    formState,
    setFieldValue,
    setFieldError,
    handleSubmit,
    reset,
    getFieldProps,
  };
}

// ===== HIGHER-ORDER COMPONENTS =====

// Advanced HOC with multiple features
interface WithLoadingProps {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

const withLoading = <P extends object>(
  Component: ComponentType<P>
): ForwardRefExoticComponent<P & WithLoadingProps & RefAttributes<any>> => {
  const WrappedComponent = React.forwardRef<any, P & WithLoadingProps>(({
    loading = false,
    error = null,
    onRetry,
    fallback = <div>Loading...</div>,
    errorFallback = <div>Error occurred</div>,
    ...props
  }, ref) => {
    if (loading) {
      return <>{fallback}</>;
    }

    if (error) {
      return (
        <div className="error-container">
          {errorFallback}
          {onRetry && (
            <button onClick={onRetry} className="btn btn--primary">
              Retry
            </button>
          )}
        </div>
      );
    }

    return <Component {...(props as P)} ref={ref} />;
  });

  WrappedComponent.displayName = `withLoading(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// ===== PERFORMANCE OPTIMIZATIONS =====

// Memoized component with custom comparison
interface MemoizedComponentProps {
  data: any[];
  onItemClick: (item: any) => void;
  selectedId?: string;
}

const MemoizedComponent = React.memo<MemoizedComponentProps>(({
  data,
  onItemClick,
  selectedId,
}) => {
  return (
    <div>
      {data.map(item => (
        <div
          key={item.id}
          className={selectedId === item.id ? 'selected' : ''}
          onClick={() => onItemClick(item)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  if (prevProps.data.length !== nextProps.data.length) return false;
  if (prevProps.selectedId !== nextProps.selectedId) return false;
  
  // Compare data arrays more efficiently
  for (let i = 0; i < prevProps.data.length; i++) {
    if (prevProps.data[i].id !== nextProps.data[i].id) return false;
    if (prevProps.data[i].name !== nextProps.data[i].name) return false;
  }
  
  return true;
});

// ===== UTILITY COMPONENTS =====

// Flexible component that accepts any HTML element type
interface FlexibleProps<T extends React.ElementType> {
  as?: T;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}

const FlexibleComponent = <T extends React.ElementType = 'div'>({
  as: Component = 'div',
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  ...props
}: FlexibleProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof FlexibleProps<T>>) => {
  const className = [
    'flexible-component',
    `flexible-component--${variant}`,
    `flexible-component--${size}`,
    disabled && 'flexible-component--disabled',
    loading && 'flexible-component--loading',
  ].filter(Boolean).join(' ');

  return (
    <Component 
      className={className}
      disabled={disabled}
      {...props}
    >
      {loading ? <span className="spinner" /> : children}
    </Component>
  );
};

// ===== EXERCISES =====

/*
EXERCISE 1: Create a typed Modal component with:
- isOpen prop (boolean)
- onClose prop (function)
- title prop (string)
- children prop (ReactNode)
- Optional size prop ('small' | 'medium' | 'large')
- Optional closeOnEscape prop (boolean)
- Optional closeOnOverlay prop (boolean)
- Proper focus management
- Keyboard navigation support

EXERCISE 2: Create a custom hook useLocalStorage that:
- Takes a key and initial value
- Returns [value, setValue] like useState
- Persists to localStorage
- Handles JSON serialization/deserialization
- Supports type safety
- Handles storage errors gracefully

EXERCISE 3: Create a generic Table component that:
- Accepts columns configuration with key, label, and render function
- Accepts data array
- Handles sorting (single and multi-column)
- Handles filtering
- Supports pagination
- Is fully typed
- Has responsive design

EXERCISE 4: Create a typed Form component that:
- Accepts a schema for validation
- Handles form state
- Provides validation errors
- Handles submission
- Supports field arrays
- Has conditional fields
- Integrates with popular form libraries

EXERCISE 5: Create a higher-order component that:
- Adds authentication checks
- Redirects if not authenticated
- Preserves original component types
- Supports role-based access control
- Handles loading states
- Provides user context
*/

// Export components and hooks
export {
  UserCard,
  List,
  useApi,
  ThemeProvider,
  useTheme,
  useForm,
  withLoading,
  MemoizedComponent,
  FlexibleComponent,
};

// Export types
export type {
  User,
  UserPreferences,
  Address,
  UserCardProps,
  ListProps,
  UseApiOptions,
  UseApiResult,
  ThemeContextType,
  FormField,
  FormState,
  FormOptions,
  WithLoadingProps,
  MemoizedComponentProps,
  FlexibleProps,
};