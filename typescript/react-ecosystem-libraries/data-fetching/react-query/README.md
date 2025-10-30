# React Query (TanStack Query) with TypeScript

React Query (now TanStack Query) is a powerful data fetching and state management library for React. This folder demonstrates TypeScript integration with React Query for type-safe server state management.

## TypeScript Benefits with React Query

1. **Typed Queries**: Type-safe query keys and return values
2. **Typed Mutations**: Type-safe mutation parameters and results
3. **Typed Selectors**: Type-safe data transformation
4. **Typed Hooks**: Properly typed React Query hooks
5. **Error Typing**: Type-safe error handling

## Key TypeScript Concepts

- **Query Key Typing**: Defining typed query keys
- **Generic Queries**: Creating reusable typed queries
- **Mutation Typing**: Type-safe mutations with payloads
- **Infinite Query Typing**: Type-safe infinite scrolling
- **Error Handling**: Typed error states and messages

## Installation

```bash
npm install @tanstack/react-query
npm install @types/react @types/react-dom
```

## Basic Usage

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define type for API response
interface Post {
  id: number;
  title: string;
  content: string;
}

// Define type for query key
type PostQueryKey = ['posts', { page?: number; category?: string }];

// Use typed query
const { data, error, isLoading } = useQuery<Post[], Error, PostQueryKey>({
  queryKey: ['posts'],
  queryFn: async () => {
    const response = await fetch('/api/posts');
    return response.json();
  },
});

// Use typed mutation
const createPostMutation = useMutation<Post, Error, NewPostData>({
  mutationFn: async (newPost) => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(newPost),
    });
    return response.json();
  },
});
```

## Advanced Patterns

- **Typed Query Client**: Type-safe query client methods
- **Generic Hooks**: Building reusable typed hooks
- **Typed Selectors**: Type-safe data transformation
- **Typed Infinite Queries**: Type-safe infinite scrolling
- **Error Boundaries**: Type-safe error handling