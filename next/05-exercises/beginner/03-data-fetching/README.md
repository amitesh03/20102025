# Next.js Data Fetching Exercises

These exercises will help you practice data fetching concepts in Next.js, including server-side rendering, static generation, and client-side fetching.

## Exercise 1: Server-Side Data Fetching

Create a page that fetches data on the server.

### Requirements:
1. Create a page that fetches a list of users from an API
2. Display the users in a grid or list
3. Handle loading and error states
4. Add a refresh button to refetch the data
5. Implement caching for the fetched data

### Hints:
- Use async/await in server components
- Try fetching from `https://jsonplaceholder.typicode.com/users`
- Use the `cache` option in fetch for caching
- Handle errors with try/catch blocks

---

## Exercise 2: Client-Side Data Fetching

Create a component that fetches data on the client.

### Requirements:
1. Create a client component that fetches data when mounted
2. Display loading and error states
3. Add a button to refetch the data
4. Implement polling to refresh data every 30 seconds
5. Clean up intervals when the component unmounts

### Hints:
- Use the `"use client"` directive
- Use useEffect for data fetching on mount
- Use useState for loading, error, and data states
- Remember to return a cleanup function from useEffect

---

## Exercise 3: Static Data Generation

Create a page with statically generated data.

### Requirements:
1. Create a page that generates static content at build time
2. Use the `cache: 'force-cache'` option
3. Display when the page was last generated
4. Add a revalidation strategy
5. Create a button to manually revalidate the data

### Hints:
- Use fetch with caching options
- Display the build time using `new Date().toISOString()`
- Use the `next.revalidate` option for time-based revalidation
- Consider using route handlers for manual revalidation

---

## Exercise 4: Dynamic Data with Routes

Combine dynamic routes with data fetching.

### Requirements:
1. Create a dynamic route for individual resources (e.g., `/posts/[id]`)
2. Fetch data based on the route parameter
3. Handle 404 errors when data doesn't exist
4. Add a loading state for the dynamic route
5. Create a list page that links to individual resources

### Hints:
- Access route parameters through the `params` prop
- Use the `notFound()` function for 404 errors
- Create a loading.tsx file for loading states
- Use the Link component to navigate to dynamic routes

---

## Exercise 5: Data Fetching Patterns

Implement different data fetching patterns.

### Requirements:
1. Create a page with parallel data fetching (multiple independent requests)
2. Implement sequential data fetching (dependent requests)
3. Add client-side search functionality
4. Implement pagination for a list of data
5. Create a data mutation (POST, PUT, or DELETE)

### Hints:
- Use Promise.all for parallel requests
- Chain async/await for sequential requests
- Use client state for search functionality
- Use URL parameters for pagination
- Create API routes for mutations

---

## Exercise 6: Error Handling and Retry Logic

Implement robust error handling for data fetching.

### Requirements:
1. Create a component that handles fetch errors gracefully
2. Implement retry logic with exponential backoff
3. Add a fallback UI when data fails to load
4. Create an error boundary component
5. Log errors to the console or a service

### Hints:
- Use try/catch blocks for error handling
- Implement a retry counter with setTimeout
- Create a fallback component with static data
- Error boundaries work with class components
- Consider using a service like Sentry for error logging

---

## Self-Assessment

After completing these exercises, ask yourself:

1. Do I understand the difference between server and client data fetching?
2. Can I implement caching and revalidation strategies?
3. Am I comfortable handling loading and error states?
4. Can I combine dynamic routes with data fetching?
5. Do I understand different data fetching patterns?

If you answered "yes" to most of these questions, you're ready to move on to the intermediate exercises!