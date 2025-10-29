import React, { useState } from 'react';

const ViteExamples = () => {
  const [selectedExample, setSelectedExample] = useState('basics');
  const [projectName, setProjectName] = useState('my-react-app');
  const [result, setResult] = useState('');

  const renderBasicsExamples = () => (
    <div className="example-section">
      <h3>Basic Usage</h3>
      <div className="code-example">
        <pre>{`// Create a new Vite project
npm create vite@latest

# Create a React project
npm create vite@latest my-react-app --template react

# Navigate to project
cd my-react-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="input-group">
          <label>Project Name:</label>
          <input 
            type="text" 
            value={projectName} 
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
          />
        </div>
        <div className="button-group">
          <button onClick={() => {
            setResult(`# Commands to create ${projectName} with Vite:\nnpm create vite@latest ${projectName} --template react\ncd ${projectName}\nnpm install\nnpm run dev`);
          }}>
            Generate Create Commands
          </button>
          <button onClick={() => {
            setResult(`# Vite project setup for ${projectName}:\n1. npm create vite@latest ${projectName} --template react\n2. cd ${projectName}\n3. npm install\n4. npm run dev\n5. Open http://localhost:5173`);
          }}>
            Show Setup Process
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderConfigurationExamples = () => (
    <div className="example-section">
      <h3>Configuration</h3>
      <div className="code-example">
        <pre>{`// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})

// Environment-specific configuration
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return {
      plugins: [react()],
      server: {
        port: 3000
      }
    }
  } else {
    return {
      plugins: [react()],
      build: {
        outDir: 'dist'
      }
    }
  }
})`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    port: 3000,\n    open: true\n  },\n  build: {\n    outDir: 'dist',\n    sourcemap: true\n  },\n  resolve: {\n    alias: {\n      '@': '/src'\n    }\n  }\n})`);
          }}>
            Generate Basic Config
          </button>
          <button onClick={() => {
            setResult(`import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig(({ command, mode }) => {\n  const isDev = command === 'serve'\n  \n  return {\n    plugins: [react()],\n    server: isDev ? {\n      port: 3000,\n      open: true\n    } : undefined,\n    build: {\n      outDir: 'dist',\n      sourcemap: isDev\n    }\n  }\n})`);
          }}>
            Generate Advanced Config
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderPluginsExamples = () => (
    <div className="example-section">
      <h3>Plugins</h3>
      <div className="code-example">
        <pre>{`// Install plugins
npm install @vitejs/plugin-react
npm install @vitejs/plugin-vue
npm install @vitejs/plugin-svelte

// Use plugins in vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    }),
    vue()
  ]
})

// Community plugins
npm install vite-plugin-windicss
npm install vite-plugin-pwa
npm install vite-plugin-compression

// vite.config.js with community plugins
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import WindiCSS from 'vite-plugin-windicss'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    WindiCSS(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
})`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({\n  plugins: [\n    react({\n      jsxImportSource: '@emotion/react',\n      babel: {\n        plugins: ['@emotion/babel-plugin']\n      }\n    })\n  ]\n})`);
          }}>
            Generate React Plugin Config
          </button>
          <button onClick={() => {
            setResult(`import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\nimport WindiCSS from 'vite-plugin-windicss'\nimport { VitePWA } from 'vite-plugin-pwa'\n\nexport default defineConfig({\n  plugins: [\n    react(),\n    WindiCSS(),\n    VitePWA({\n      registerType: 'autoUpdate'\n    })\n  ]\n})`);
          }}>
            Generate Multi-Plugin Config
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderEnvironmentVariablesExamples = () => (
    <div className="example-section">
      <h3>Environment Variables</h3>
      <div className="code-example">
        <pre>{`// .env file
VITE_API_URL=https://api.example.com
VITE_APP_VERSION=1.0.0
VITE_PUBLIC_KEY=your_public_key

// Access in code
const apiUrl = import.meta.env.VITE_API_URL
const appVersion = import.meta.env.VITE_APP_VERSION
const publicKey = import.meta.env.VITE_PUBLIC_KEY

// Environment-specific files
.env                # Loaded in all cases
.env.local          # Loaded in all cases, ignored by git
.env.development     # Loaded in development
.env.production      # Loaded in production

// vite.config.js with environment variables
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION)
    }
  }
})`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`# .env file for ${projectName}:\nVITE_API_URL=https://api.example.com\nVITE_APP_VERSION=1.0.0\nVITE_PUBLIC_KEY=your_public_key\n\n# Access in code:\nconst apiUrl = import.meta.env.VITE_API_URL\nconst appVersion = import.meta.env.VITE_APP_VERSION`);
          }}>
            Generate .env File
          </button>
          <button onClick={() => {
            setResult(`# Environment-specific files for ${projectName}:\n.env                # Loaded in all cases\n.env.local          # Loaded in all cases, ignored by git\n.env.development     # Loaded in development\n.env.production      # Loaded in production\n\n# Access in code:\nconst isDev = import.meta.env.DEV\nconst isProd = import.meta.env.PROD`);
          }}>
            Show Environment Files
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderBuildOptimizationExamples = () => (
    <div className="example-section">
      <h3>Build Optimization</h3>
      <div className="code-example">
        <pre>{`// Build configuration
export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'axios']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})

// Code splitting
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'utils': ['lodash', 'date-fns'],
          'ui': ['antd', '@mui/material']
        }
      }
    }
  }
})

// Asset optimization
export default defineConfig({
  build: {
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    cssTarget: 'chrome80'
  }
})`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`export default defineConfig({\n  build: {\n    outDir: 'dist',\n    sourcemap: true,\n    minify: 'terser',\n    terserOptions: {\n      compress: {\n        drop_console: true,\n        drop_debugger: true\n      }\n    }\n  }\n})`);
          }}>
            Generate Build Config
          </button>
          <button onClick={() => {
            setResult(`export default defineConfig({\n  build: {\n    rollupOptions: {\n      output: {\n        manualChunks: {\n          'react-vendor': ['react', 'react-dom'],\n          'utils': ['lodash', 'date-fns']\n        }\n      }\n    }\n  }\n})`);
          }}>
            Generate Code Splitting
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderDevServerExamples = () => (
    <div className="example-section">
      <h3>Development Server</h3>
      <div className="code-example">
        <pre>{`// Server configuration
export default defineConfig({
  server: {
    port: 3000,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

// HTTPS configuration
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('./key.pem'),
      cert: fs.readFileSync('./cert.pem')
    }
  }
})

// HMR configuration
export default defineConfig({
  server: {
    hmr: {
      overlay: true
    }
  }
})

// Custom middleware
export default defineConfig({
  server: {
    middlewareMode: true,
    configureServer(app) {
      app.use((req, res, next) => {
        if (req.url === '/custom') {
          res.end('Custom response')
        } else {
          next()
        }
      })
    }
  }
})`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`export default defineConfig({\n  server: {\n    port: 3000,\n    open: true,\n    cors: true,\n    proxy: {\n      '/api': {\n        target: 'http://localhost:8080',\n        changeOrigin: true,\n        rewrite: (path) => path.replace(/^\\/api/, '')\n      }\n    }\n  }\n})`);
          }}>
            Generate Server Config
          </button>
          <button onClick={() => {
            setResult(`export default defineConfig({\n  server: {\n    hmr: {\n      overlay: true\n    },\n    middlewareMode: true,\n    configureServer(app) {\n      app.use((req, res, next) => {\n        if (req.url === '/custom') {\n          res.end('Custom response')\n        } else {\n          next()\n        }\n      })\n    }\n  }\n})`);
          }}>
            Generate HMR Config
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  return (
    <div className="library-examples">
      <h2>Vite Examples</h2>
      <p>Vite is a modern build tool that provides a fast development server and optimized production builds for web applications.</p>
      
      <div className="example-navigation">
        <button 
          className={selectedExample === 'basics' ? 'active' : ''}
          onClick={() => setSelectedExample('basics')}
        >
          Basics
        </button>
        <button 
          className={selectedExample === 'configuration' ? 'active' : ''}
          onClick={() => setSelectedExample('configuration')}
        >
          Configuration
        </button>
        <button 
          className={selectedExample === 'plugins' ? 'active' : ''}
          onClick={() => setSelectedExample('plugins')}
        >
          Plugins
        </button>
        <button 
          className={selectedExample === 'environment' ? 'active' : ''}
          onClick={() => setSelectedExample('environment')}
        >
          Environment
        </button>
        <button 
          className={selectedExample === 'build' ? 'active' : ''}
          onClick={() => setSelectedExample('build')}
        >
          Build
        </button>
        <button 
          className={selectedExample === 'devserver' ? 'active' : ''}
          onClick={() => setSelectedExample('devserver')}
        >
          Dev Server
        </button>
      </div>

      <div className="example-content">
        {selectedExample === 'basics' && renderBasicsExamples()}
        {selectedExample === 'configuration' && renderConfigurationExamples()}
        {selectedExample === 'plugins' && renderPluginsExamples()}
        {selectedExample === 'environment' && renderEnvironmentVariablesExamples()}
        {selectedExample === 'build' && renderBuildOptimizationExamples()}
        {selectedExample === 'devserver' && renderDevServerExamples()}
      </div>

      <div className="installation">
        <h3>Installation</h3>
        <pre><code>npm create vite@latest</code></pre>
      </div>

      <div className="resources">
        <h3>Resources</h3>
        <ul>
          <li><a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer">Official Website</a></li>
          <li><a href="https://vitejs.dev/guide/" target="_blank" rel="noopener noreferrer">Documentation</a></li>
          <li><a href="https://github.com/vitejs/vite" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
        </ul>
      </div>
    </div>
  );
};

export default ViteExamples;