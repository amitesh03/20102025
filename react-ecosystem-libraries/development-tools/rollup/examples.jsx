/**
 * Rollup Examples
 * 
 * Rollup is a module bundler for JavaScript which compiles small pieces of code
 * into something larger and more complex, such as a library or application.
 */

// Example 1: Basic Rollup configuration
/*
// rollup.config.js
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs' // CommonJS format
  }
};
*/

// Example 2: Multiple output formats
/*
// rollup.config.js
export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.cjs.js',
      format: 'cjs'
    }
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.esm.js',
      format: 'esm' // ES Modules
    }
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.umd.js',
      format: 'umd', // Universal Module Definition
      name: 'MyLibrary'
    }
  }
];
*/

// Example 3: Using plugins with Rollup
/*
// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  plugins: [
    nodeResolve(), // Resolve node_modules
    commonjs(), // Convert CommonJS modules to ES6
    json(), // Import JSON files
    babel({ // Transpile with Babel
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react', '@babel/preset-env']
    })
  ]
};
*/

// Example 4: Creating a React library with Rollup
/*
// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const external = [...Object.keys(pkg.peerDependencies || {}), ...Object.keys(pkg.dependencies || {})];

export default [
  // ES Module build
  {
    input: 'src/index.js',
    output: {
      file: pkg.module || 'dist/index.esm.js',
      format: 'esm'
    },
    external,
    plugins: [
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: ['@babel/preset-react', '@babel/preset-env']
      })
    ]
  },
  // CommonJS build
  {
    input: 'src/index.js',
    output: {
      file: pkg.main || 'dist/index.js',
      format: 'cjs'
    },
    external,
    plugins: [
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: ['@babel/preset-react', '@babel/preset-env']
      })
    ]
  },
  // Minified UMD build for browsers
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name: 'MyReactLibrary'
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: ['@babel/preset-react', '@babel/preset-env']
      }),
      terser() // Minify the output
    ]
  }
];
*/

// Example 5: Handling CSS with Rollup
/*
// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react', '@babel/preset-env']
    }),
    postcss({
      plugins: [autoprefixer()],
      extract: true, // Extract CSS to a separate file
      minimize: true // Minify CSS
    })
  ]
};
*/

// Example 6: Using TypeScript with Rollup
/*
// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json'
    }),
    nodeResolve(),
    commonjs()
  ]
};
*/

// Example 7: Creating a development server with Rollup
/*
// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife', // Immediately Invoked Function Expression
    sourcemap: !production
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react', '@babel/preset-env']
    }),
    !production && serve({
      open: true,
      contentBase: ['dist'],
      port: 3000
    }),
    !production && livereload('dist')
  ]
};
*/

// Example 8: Code splitting with Rollup
/*
// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

export default {
  input: {
    main: 'src/index.js',
    vendor: 'src/vendor.js'
  },
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: '[name].js',
    chunkFileNames: '[name]-[hash].js'
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react', '@babel/preset-env']
    })
  ]
};
*/

// Example 9: Environment variables with Rollup
/*
// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
      'process.env.API_URL': JSON.stringify(process.env.API_URL || 'https://api.example.com')
    }),
    nodeResolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react', '@babel/preset-env']
    })
  ]
};
*/

// Example 10: Analyzing bundle size with Rollup
/*
// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { analyze } from 'rollup-plugin-analyzer';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react', '@babel/preset-env']
    }),
    analyze({
      summaryOnly: true,
      limit: 10
    })
  ]
};
*/

// Example 11: Package.json scripts for Rollup
/*
// package.json
{
  "name": "my-library",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "scripts": {
    "build": "rollup -c",
    "build:watch": "rollup -c -w",
    "dev": "rollup -c -w",
    "build:prod": "NODE_ENV=production rollup -c"
  },
  "devDependencies": {
    "@rollup/plugin-babel": "^5.3.1",
    "@rollup/plugin-commonjs": "^22.0.0",
    "@rollup/plugin-node-resolve": "^13.3.0",
    "rollup": "^2.75.6"
  },
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0",
    "react-dom": "^17.0.0 || ^18.0.0"
  }
}
*/

// Example 12: Advanced configuration with conditional plugins
/*
// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const production = !process.env.ROLLUP_WATCH;
const external = [...Object.keys(pkg.peerDependencies || {}), ...Object.keys(pkg.dependencies || {})];

const plugins = [
  nodeResolve(),
  commonjs(),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    presets: ['@babel/preset-react', '@babel/preset-env']
  })
];

if (production) {
  plugins.push(terser());
}

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main || 'dist/index.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module || 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  external,
  plugins
};
*/

export const rollupExamples = {
  description: "Examples of using Rollup as a module bundler for JavaScript libraries and applications",
  installation: "npm install rollup --save-dev",
  commonPlugins: [
    "@rollup/plugin-node-resolve: Resolves node_modules",
    "@rollup/plugin-commonjs: Converts CommonJS to ES6",
    "@rollup/plugin-babel: Transpiles with Babel",
    "@rollup/plugin-typescript: TypeScript support",
    "rollup-plugin-terser: Minifies output"
  ],
  outputFormats: [
    "cjs: CommonJS",
    "esm: ES Modules",
    "umd: Universal Module Definition",
    "iife: Immediately Invoked Function Expression"
  ],
  commands: {
    build: "rollup -c",
    watch: "rollup -c -w",
    production: "NODE_ENV=production rollup -c"
  }
};