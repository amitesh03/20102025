# Next.js Fundamentals Exercises

These exercises will help you practice the basic concepts of Next.js, including components, layouts, and the App Router.

## Exercise 1: Create a Personal Portfolio

Create a simple personal portfolio website with the following pages:
- Home page with a brief introduction
- About page with more details about yourself
- Contact page with a contact form

### Requirements:
1. Use the App Router structure
2. Create a shared layout with a header and footer
3. Include navigation between pages
4. Add at least one client component with interactivity
5. Style the pages with Tailwind CSS

### Hints:
- Start by creating a new Next.js project
- Create the layout.tsx file in the app directory
- Create page.tsx files for each route
- Create a components directory for reusable components

---

## Exercise 2: Component Composition

Create a dashboard page with multiple components that work together.

### Requirements:
1. Create a dashboard page at `/dashboard`
2. Include a sidebar navigation component
3. Add a stats card component that displays metrics
4. Create a chart component (can be a simple placeholder)
5. Add a recent activity component
6. Make at least one component interactive with state

### Hints:
- Think about how components can be composed together
- Use props to pass data between components
- Consider which components should be client vs server components

---

## Exercise 3: Styling Practice

Create a styled landing page for a fictional product.

### Requirements:
1. Create a landing page with multiple sections
2. Use Tailwind CSS for styling
3. Include a hero section with a call-to-action
4. Add a features section with cards
5. Create a testimonials section
6. Add a footer with links

### Hints:
- Use responsive design classes
- Experiment with different Tailwind utilities
- Consider using CSS modules for component-specific styles

---

## Exercise 4: Server vs Client Components

Create a page that demonstrates the difference between server and client components.

### Requirements:
1. Create a page that shows the current time (server component)
2. Add a counter that increments on click (client component)
3. Include a component that fetches data on the server
4. Add a component that uses browser APIs (client component)
5. Explain the differences in comments

### Hints:
- Remember to use "use client" for client components
- Server components can't use hooks or browser APIs
- Client components can use state and effects

---

## Exercise 5: Layouts and Navigation

Create a multi-section website with nested layouts.

### Requirements:
1. Create a main layout with navigation
2. Create a nested layout for a specific section (e.g., /dashboard)
3. Add breadcrumb navigation
4. Include a loading state for pages
5. Add an error page for 404 errors

### Hints:
- Layouts wrap around pages and preserve state
- You can create layouts in any directory
- Loading.tsx files automatically show loading states
- Not-found.tsx files handle 404 errors

---

## Self-Assessment

After completing these exercises, ask yourself:

1. Do I understand the difference between server and client components?
2. Can I create a basic Next.js application with multiple pages?
3. Am I comfortable with the App Router structure?
4. Can I create reusable components?
5. Do I understand how layouts work in Next.js?

If you answered "yes" to most of these questions, you're ready to move on to the routing exercises!