# Next.js Routing Exercises

These exercises will help you practice routing concepts in Next.js, including dynamic routes, nested routes, and navigation.

## Exercise 1: Blog Platform

Create a simple blog platform with dynamic routes.

### Requirements:
1. Create a blog listing page at `/blog`
2. Create dynamic blog post pages at `/blog/[slug]`
3. Add a category page at `/blog/category/[category]`
4. Include navigation between pages
5. Add a "back to blog" link on individual posts

### Hints:
- Use folders with brackets for dynamic routes
- Create mock data for blog posts
- Use the `params` prop to access route parameters
- Use the Link component for navigation

---

## Exercise 2: E-commerce Product Pages

Create product pages for an e-commerce site.

### Requirements:
1. Create a product listing page at `/products`
2. Create dynamic product detail pages at `/products/[id]`
3. Add a product review page at `/products/[id]/reviews`
4. Create a search results page at `/search`
5. Implement query parameters for filtering (e.g., `/products?category=electronics`)

### Hints:
- Use nested routes for related pages
- Access query parameters with the `searchParams` prop
- Create mock product data
- Use Link with query objects for filtered URLs

---

## Exercise 3: User Profile Pages

Create user profile pages with multiple sections.

### Requirements:
1. Create a user profile page at `/users/[username]`
2. Create nested routes for user posts at `/users/[username]/posts`
3. Create nested routes for user followers at `/users/[username]/followers`
4. Add a settings page at `/users/[username]/settings`
5. Create a shared layout for all user profile pages

### Hints:
- Layouts in folders apply to all nested routes
- Use route groups (parentheses) for layouts without affecting URL
- Create mock user data
- Consider which routes should be protected

---

## Exercise 4: Dynamic Navigation

Create a navigation component that highlights active routes.

### Requirements:
1. Create a navigation component with links to different pages
2. Highlight the currently active page
3. Show a breadcrumb trail for nested routes
4. Add a dropdown menu for nested navigation
5. Handle mobile responsive navigation

### Hints:
- Use the `usePathname` hook to get the current route
- Parse the pathname to generate breadcrumbs
- Use conditional classes for active states
- Consider using a state management library for mobile menu

---

## Exercise 5: Catch-all Routes

Create a documentation site with catch-all routes.

### Requirements:
1. Create a documentation site with routes like `/docs/getting-started`
2. Use catch-all routes to handle nested documentation paths
3. Create a table of contents that links to different sections
4. Add a search feature that navigates to documentation pages
5. Handle 404 errors for non-existent documentation

### Hints:
- Use `[...slug]` for catch-all routes
- The `params` prop will contain an array of path segments
- Create a data structure to map paths to content
- Consider using a markdown parser for documentation content

---

## Exercise 6: Route Protection

Implement protected routes with authentication checks.

### Requirements:
1. Create a dashboard page at `/dashboard`
2. Protect the dashboard route with authentication
3. Create a login page at `/login`
4. Redirect unauthenticated users to the login page
5. Implement a logout feature

### Hints:
- Use middleware to protect routes
- Create a simple authentication system
- Use cookies or local storage for authentication state
- Redirect users after successful login

---

## Self-Assessment

After completing these exercises, ask yourself:

1. Do I understand how to create dynamic routes?
2. Can I implement nested routes with layouts?
3. Am I comfortable with route parameters and query strings?
4. Can I create a navigation system that works with Next.js routing?
5. Do I understand how to protect routes?

If you answered "yes" to most of these questions, you're ready to move on to the data fetching exercises!