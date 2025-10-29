import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Link, 
  NavLink, 
  Navigate, 
  useNavigate, 
  useLocation, 
  useParams, 
  useSearchParams,
  Outlet,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  useLoaderData,
  useActionData,
  useFetcher,
  Form
} from 'react-router-dom';

// React Router Examples - Comprehensive Guide to React Navigation
// React Router is the standard routing library for React applications, enabling declarative routing,
// code splitting, and data loading with a powerful, component-based API.

// ===== 1. BASIC ROUTING SETUP =====

// Basic router configuration
// App.jsx
const BasicApp = () => {
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
};

// Page components
const HomePage = () => <h1>Welcome to the Home Page</h1>;
const AboutPage = () => <h1>About Us</h1>;
const ContactPage = () => <h1>Contact Us</h1>;

// ===== 2. ROUTE PARAMETERS =====

// Dynamic routes with parameters
// App.jsx
const ParameterizedApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="/posts/:category/:slug" element={<BlogPost />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

// Component using route parameters
const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Fetch user data based on ID
    fetchUser(id).then(userData => setUser(userData));
  }, [id]);
  
  if (!user) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>User Profile: {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>ID: {id}</p>
    </div>
  );
};

const BlogPost = () => {
  const { category, slug } = useParams();
  
  return (
    <div>
      <h1>Blog Post</h1>
      <p>Category: {category}</p>
      <p>Slug: {slug}</p>
    </div>
  );
};

// Mock function for demonstration
const fetchUser = async (id) => {
  // In real app, this would be an API call
  return { name: `User ${id}`, email: `user${id}@example.com` };
};

// ===== 3. NESTED ROUTES =====

// Nested routing with layout components
// App.jsx
const NestedApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="products" element={<ProductsLayout />}>
            <Route index element={<ProductsList />} />
            <Route path=":id" element={<ProductDetail />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

// Layout component with Outlet
const Layout = () => {
  return (
    <div className="layout">
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/products">Products</Link>
        </nav>
      </header>
      
      <main>
        <Outlet />
      </main>
      
      <footer>
        <p>&copy; 2024 My App</p>
      </footer>
    </div>
  );
};

const ProductsLayout = () => {
  return (
    <div className="products-layout">
      <aside>
        <h3>Product Categories</h3>
        <nav>
          <Link to="/products/electronics">Electronics</Link>
          <Link to="/products/clothing">Clothing</Link>
          <Link to="/products/books">Books</Link>
        </nav>
      </aside>
      
      <main>
        <Outlet />
      </main>
    </div>
  );
};

// ===== 4. NAVIGATION COMPONENTS =====

// Navigation with active states
const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="main-nav">
      <ul>
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/products" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Products
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/about" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            About
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

// Programmatic navigation
const NavigationExample = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleNavigate = (path) => {
    navigate(path);
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleGoForward = () => {
    navigate(1);
  };
  
  return (
    <div>
      <p>Current path: {location.pathname}</p>
      
      <button onClick={() => handleNavigate('/')}>Go Home</button>
      <button onClick={() => handleNavigate('/products')}>Go to Products</button>
      <button onClick={handleGoBack}>Go Back</button>
      <button onClick={handleGoForward}>Go Forward</button>
    </div>
  );
};

// ===== 5. SEARCH PARAMETERS =====

// Working with URL search parameters
const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const category = searchParams.get('category');
  const page = searchParams.get('page');
  
  const updateSearch = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    // Navigate with new search params
    window.location.search = params.toString();
  };
  
  return (
    <div>
      <h1>Search Results</h1>
      
      <div className="search-filters">
        <input
          type="text"
          placeholder="Search..."
          value={query || ''}
          onChange={(e) => updateSearch({ q: e.target.value })}
        />
        
        <select
          value={category || ''}
          onChange={(e) => updateSearch({ category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
        </select>
      </div>
      
      <div className="search-info">
        {query && <p>Searching for: "{query}"</p>}
        {category && <p>Category: {category}</p>}
        {page && <p>Page: {page}</p>}
      </div>
    </div>
  );
};

// ===== 6. PROTECTED ROUTES =====

// Authentication-based routing
const ProtectedApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const ProtectedRoute = ({ isAuthenticated, children }) => {
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

const LoginPage = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate authentication
    if (credentials.username && credentials.password) {
      onLogin();
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />
      <button type="submit">Login</button>
    </form>
  );
};

// ===== 7. DATA LOADING =====

// Routes with data loaders (React Router v6.4+)
// router.jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: async () => {
          const response = await fetch("/api/home-data");
          return response.json();
        }
      },
      {
        path: "users/:id",
        element: <UserProfile />,
        loader: async ({ params }) => {
          const response = await fetch(`/api/users/${params.id}`);
          if (!response.ok) {
            throw new Response("User not found", { status: 404 });
          }
          return response.json();
        }
      },
      {
        path: "products",
        element: <ProductsList />,
        loader: async ({ request }) => {
          const url = new URL(request.url);
          const category = url.searchParams.get("category");
          const response = await fetch(`/api/products?category=${category}`);
          return response.json();
        }
      }
    ]
  }
]);

// App.jsx
const DataLoadingApp = () => {
  return <RouterProvider router={router} />;
};

// Component using loader data
const UserProfileWithData = () => {
  const user = useLoaderData();
  
  if (!user) {
    return <div>Loading user data...</div>;
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Joined: {new Date(user.joinDate).toLocaleDateString()}</p>
    </div>
  );
};

// ===== 8. FORM HANDLING =====

// Form submission with actions
const FormHandlingApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
};

// Contact form with action
const ContactPageWithForm = () => {
  const actionData = useActionData();
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    if (actionData) {
      setSubmitted(true);
    }
  }, [actionData]);
  
  if (submitted) {
    return <Navigate to="/success" replace />;
  }
  
  return (
    <div>
      <h1>Contact Us</h1>
      
      <Form method="post" action="/contact">
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />
        </div>
        
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        
        <div>
          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" rows={4} required />
        </div>
        
        <button type="submit">Send Message</button>
      </Form>
      
      {actionData?.error && (
        <div className="error">
          Error: {actionData.error}
        </div>
      )}
    </div>
  );
};

// Action handler (would be in a separate file)
// actions/contact.js
export async function contactAction({ request }) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");
  
  // Validate form data
  if (!name || !email || !message) {
    return { error: "All fields are required" };
  }
  
  // Process form (send email, save to database, etc.)
  try {
    await sendContactEmail({ name, email, message });
    return { success: true };
  } catch (error) {
    return { error: "Failed to send message" };
  }
}

// ===== 9. CUSTOM ROUTE MATCHING =====

// Custom route matching and redirects
const CustomMatchingApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect old routes to new ones */}
        <Route path="/old-home" element={<Navigate to="/" replace />} />
        <Route path="/products/:category" element={<Navigate to="/shop/:category" replace />} />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
        
        {/* Route with custom matching */}
        <Route path="/docs/:section*" element={<DocumentationPage />} />
      </Routes>
    </BrowserRouter>
  );
};

const DocumentationPage = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Extract section and subsections
  const section = pathSegments[1] || 'index';
  const subsections = pathSegments.slice(2);
  
  return (
    <div>
      <h1>Documentation</h1>
      <nav className="doc-nav">
        <Link to="/docs/getting-started">Getting Started</Link>
        <Link to="/docs/api">API Reference</Link>
        <Link to="/docs/examples">Examples</Link>
      </nav>
      
      <div className="doc-content">
        <p>Current section: {section}</p>
        {subsections.length > 0 && (
          <p>Subsections: {subsections.join(' / ')}</p>
        )}
      </div>
    </div>
  );
};

const NotFoundPage = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you're looking for doesn't exist.</p>
      <button onClick={() => navigate('/')}>Go Home</button>
    </div>
  );
};

// ===== 10. LAZY LOADING =====

// Code splitting and lazy loading
import { lazy, Suspense } from 'react';

const LazyApp = () => {
  // Lazy load components
  const HomePage = lazy(() => import('./components/HomePage'));
  const AboutPage = lazy(() => import('./components/AboutPage'));
  const ContactPage = lazy(() => import('./components/ContactPage'));
  const AdminPage = lazy(() => import('./components/AdminPage'));
  
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

// Custom loading component
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

// Advanced lazy loading with different loading states
const AdvancedLazyApp = () => {
  const AdminDashboard = lazy(() => 
    import('./components/AdminDashboard').then(module => ({
      default: module.AdminDashboard
    }))
  );
  
  const UserSettings = lazy(() => 
    import('./components/UserSettings').then(module => ({
      default: module.UserSettings
    }))
  );
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/dashboard" element={
          <Suspense fallback={<LoadingSpinner />}>
            <AdminDashboard />
          </Suspense>
        } />
        <Route path="/admin/settings" element={
          <Suspense fallback={<LoadingSpinner />}>
            <UserSettings />
          </Suspense>
        } />
      </Routes>
    </BrowserRouter>
  );
};

// ===== 11. ROUTE GUARDS =====

// Route guards and middleware
const RouteGuardApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="public" element={<PublicPage />} />
          <Route 
            path="protected" 
            element={
              <AuthGuard requiredRole="user">
                <ProtectedPage />
              </AuthGuard>
            } 
          />
          <Route 
            path="admin" 
            element={
              <AuthGuard requiredRole="admin">
                <AdminPage />
              </AuthGuard>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const AuthGuard = ({ requiredRole, children }) => {
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  
  useEffect(() => {
    // Check user authentication and role
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        const userData = await validateToken(token);
        setUserRole(userData.role);
      }
    };
    
    checkAuth();
  }, []);
  
  if (!userRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (requiredRole && userRole !== requiredRole) {
    return (
      <div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <button onClick={() => window.history.back()}>Go Back</button>
      </div>
    );
  }
  
  return children;
};

// Mock function for demonstration
const validateToken = async (token) => {
  // In real app, validate token with backend
  return { role: 'user' }; // or 'admin'
};

// ===== 12. BREADCRUMBS =====

// Breadcrumb navigation
const BreadcrumbExample = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const generateBreadcrumbs = () => {
    const breadcrumbs = [{ label: 'Home', path: '/' }];
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ label, path: currentPath });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  return (
    <div>
      <nav className="breadcrumb">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.path}>
            {index > 0 && ' / '}
            <Link to={crumb.path}>{crumb.label}</Link>
          </span>
        ))}
      </nav>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
    </div>
  );
};

// ===== 13. TAB ROUTING =====

// Tab-based navigation within a page
const TabRoutingExample = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Update URL without page reload
    window.history.pushState({}, '', `#${tab}`);
  };
  
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setActiveTab(hash);
    }
  }, []);
  
  return (
    <div>
      <div className="tab-navigation">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => handleTabChange('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'details' ? 'active' : ''}
          onClick={() => handleTabChange('details')}
        >
          Details
        </button>
        <button 
          className={activeTab === 'reviews' ? 'active' : ''}
          onClick={() => handleTabChange('reviews')}
        >
          Reviews
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'details' && <DetailsTab />}
        {activeTab === 'reviews' && <ReviewsTab />}
      </div>
    </div>
  );
};

// ===== 14. MODAL ROUTING =====

// Modal routing with URL state
const ModalRoutingExample = () => {
  const location = useLocation();
  const showModal = location.state?.showModal;
  
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
      
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Modal Dialog</h2>
            <p>This modal was opened via navigation state.</p>
            <Link to="/" className="close-button">Close</Link>
          </div>
        </div>
      )}
    </div>
  );
};

// Component that opens modal
const ProductsPage = () => {
  const navigate = useNavigate();
  
  const openModal = () => {
    navigate('/', { state: { showModal: true } });
  };
  
  return (
    <div>
      <h1>Products</h1>
      <button onClick={openModal}>Open Modal</button>
    </div>
  );
};

// ===== 15. ADVANCED ROUTE CONFIGURATION =====

// Complex routing with data routers
const AdvancedRoutingApp = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="users" element={<UsersLayout />}>
          <Route index element={<UsersList />} />
          <Route path=":id" element={<UserProfile />} />
          <Route path="new" element={<CreateUser />} />
        </Route>
        <Route path="products" element={<ProductsLayout />}>
          <Route index element={<ProductsList />} />
          <Route path=":id" element={<ProductDetail />} />
          <Route path="category/:category" element={<ProductsByCategory />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );
  
  return <RouterProvider router={router} />;
};

// Error boundary for routes
const ErrorBoundary = ({ error }) => {
  return (
    <div className="error-boundary">
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <Link to="/">Go Home</Link>
    </div>
  );
};

// Layout with error handling
const LayoutWithErrorBoundary = () => {
  return (
    <div>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/users">Users</Link>
          <Link to="/products">Products</Link>
        </nav>
      </header>
      
      <main>
        <Outlet />
      </main>
      
      <footer>
        <p>&copy; 2024 Advanced App</p>
      </footer>
    </div>
  );
};

// ===== USAGE EXAMPLES =====

// Example 1: Complete e-commerce application
const EcommerceApp = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <EcommerceLayout />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          index: true,
          element: <HomePage />,
          loader: async () => {
            const [featured, categories] = await Promise.all([
              fetch('/api/featured-products').then(r => r.json()),
              fetch('/api/categories').then(r => r.json())
            ]);
            return { featured, categories };
          }
        },
        {
          path: "products",
          element: <ProductsPage />,
          loader: async ({ request }) => {
            const url = new URL(request.url);
            const category = url.searchParams.get("category");
            const sort = url.searchParams.get("sort");
            const response = await fetch(`/api/products?category=${category}&sort=${sort}`);
            return response.json();
          }
        },
        {
          path: "products/:id",
          element: <ProductDetail />,
          loader: async ({ params }) => {
            const response = await fetch(`/api/products/${params.id}`);
            if (!response.ok) {
              throw new Response("Product not found", { status: 404 });
            }
            return response.json();
          }
        },
        {
          path: "cart",
          element: <ShoppingCart />,
          loader: async () => {
            const response = await fetch('/api/cart');
            return response.json();
          }
        },
        {
          path: "checkout",
          element: <CheckoutPage />,
          action: async ({ request }) => {
            const formData = await request.formData();
            const orderData = Object.fromEntries(formData);
            
            const response = await fetch('/api/orders', {
              method: 'POST',
              body: JSON.stringify(orderData)
            });
            
            if (!response.ok) {
              return { error: "Failed to place order" };
            }
            
            return { success: true, orderId: response.data.id };
          }
        }
      ]
    }
  ]);
  
  return <RouterProvider router={router} />;
};

// Example 2: Dashboard with role-based access
const DashboardApp = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <DashboardLayout />,
      loader: async () => {
        const response = await fetch('/api/user');
        if (!response.ok) {
          throw redirect('/login');
        }
        return response.json();
      },
      children: [
        {
          index: true,
          element: <DashboardHome />,
          loader: async () => {
            const [stats, recentActivity] = await Promise.all([
              fetch('/api/dashboard/stats').then(r => r.json()),
              fetch('/api/dashboard/activity').then(r => r.json())
            ]);
            return { stats, recentActivity };
          }
        },
        {
          path: "profile",
          element: <ProfilePage />,
          loader: async () => {
            const response = await fetch('/api/user/profile');
            return response.json();
          }
        },
        {
          path: "settings",
          element: <SettingsPage />,
          loader: async () => {
            const response = await fetch('/api/user/settings');
            return response.json();
          }
        },
        {
          path: "admin",
          element: <AdminGuard />,
          children: [
            {
              index: true,
              element: <AdminDashboard />,
              loader: async () => {
                const response = await fetch('/api/admin/stats');
                return response.json();
              }
            },
            {
              path: "users",
              element: <UserManagement />,
              loader: async () => {
                const response = await fetch('/api/admin/users');
                return response.json();
              }
            }
          ]
        }
      ]
    }
  ]);
  
  return <RouterProvider router={router} />;
};

// Example 3: Multi-step form wizard
const WizardApp = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <WizardLayout />,
      children: [
        {
          path: "wizard",
          element: <WizardContainer />,
          children: [
            {
              index: true,
              element: <Navigate to="/wizard/step1" replace />
            },
            {
              path: "step1",
              element: <WizardStep1 />,
              action: async ({ request }) => {
                const formData = await request.formData();
                const data = Object.fromEntries(formData);
                
                // Validate and save step 1 data
                if (!data.name || !data.email) {
                  return { error: "Name and email are required" };
                }
                
                await saveWizardStep(1, data);
                return { success: true };
              }
            },
            {
              path: "step2",
              element: <WizardStep2 />,
              action: async ({ request }) => {
                const formData = await request.formData();
                const data = Object.fromEntries(formData);
                
                // Validate and save step 2 data
                if (!data.address || !data.phone) {
                  return { error: "Address and phone are required" };
                }
                
                await saveWizardStep(2, data);
                return { success: true };
              }
            },
            {
              path: "step3",
              element: <WizardStep3 />,
              action: async ({ request }) => {
                const formData = await request.formData();
                const data = Object.fromEntries(formData);
                
                // Validate and complete wizard
                if (!data.preferences) {
                  return { error: "Preferences are required" };
                }
                
                await completeWizard(data);
                return { success: true, completed: true };
              }
            },
            {
              path: "complete",
              element: <WizardComplete />,
              loader: async () => {
                const wizardData = await getWizardData();
                if (!wizardData.completed) {
                  throw redirect('/wizard/step1');
                }
                return wizardData;
              }
            }
          ]
        }
      ]
    }
  ]);
  
  return <RouterProvider router={router} />;
};

// Mock functions for demonstration
const saveWizardStep = async (step, data) => {
  console.log(`Saving step ${step}:`, data);
  // In real app, save to backend or localStorage
};

const completeWizard = async (data) => {
  console.log('Completing wizard with:', data);
  // In real app, process final data
};

const getWizardData = async () => {
  // In real app, fetch from backend or localStorage
  return { completed: true, step1: {}, step2: {}, step3: {} };
};

// ===== KEY CONCEPTS =====

/*
1. Declarative Routing: Define routes using JSX components
2. Dynamic Routes: Handle URL parameters and wildcards
3. Nested Routes: Create layout components with Outlet
4. Navigation Components: Use Link, NavLink for navigation
5. Programmatic Navigation: Use useNavigate for imperative navigation
6. Data Loading: Loaders for server-side data fetching
7. Form Handling: Actions for form submissions
8. Code Splitting: Lazy loading for performance
9. Route Guards: Protect routes based on authentication/roles
10. Error Handling: Error boundaries and 404 handling
*/

// ===== BEST PRACTICES =====

/*
1. Use semantic HTML5 elements for navigation
2. Implement proper loading and error states
3. Leverage data loaders for server-side fetching
4. Use route guards for authentication and authorization
5. Implement proper SEO with meta tags
6. Use lazy loading for large applications
7. Handle browser back/forward navigation properly
8. Implement proper 404 and error pages
9. Use search parameters for filtering and pagination
10. Test navigation flows thoroughly
*/

// ===== MIGRATION GUIDE =====

/*
// From React Router v5 to v6:

// Old v5 syntax:
<Switch>
  <Route exact path="/" component={HomePage} />
  <Route path="/users/:id" component={UserProfile} />
  <Redirect from="/old-path" to="/new-path" />
</Switch>

// New v6 syntax:
<Routes>
  <Route index element={<HomePage />} />
  <Route path="/users/:id" element={<UserProfile />} />
  <Route path="/old-path" element={<Navigate to="/new-path" replace />} />
</Routes>

// Key changes:
1. <Switch> → <Routes>
2. component → element
3. exact → index
4. Redirect → Navigate
5. useHistory → useNavigate
6. useRouteMatch → useParams
*/

// Export all components for use
export {
  BasicApp,
  ParameterizedApp,
  NestedApp,
  Navigation,
  NavigationExample,
  SearchPage,
  ProtectedApp,
  DataLoadingApp,
  FormHandlingApp,
  CustomMatchingApp,
  LazyApp,
  RouteGuardApp,
  BreadcrumbExample,
  TabRoutingExample,
  ModalRoutingExample,
  AdvancedRoutingApp,
  EcommerceApp,
  DashboardApp,
  WizardApp
};