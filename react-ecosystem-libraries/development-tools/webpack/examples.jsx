import React, { useState } from 'react';

const WebpackExamples = () => {
  const [selectedExample, setSelectedExample] = useState('basics');
  const [projectName, setProjectName] = useState('my-react-app');
  const [result, setResult] = useState('');

  const renderBasicsExamples = () => (
    <div className="example-section">
      <h3>Basic Configuration</h3>
      <div className="code-example">
        <pre>{`// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};`}</pre>
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
            setResult(`const path = require('path');\n\nmodule.exports = {\n  entry: './src/index.js',\n  output: {\n    filename: 'bundle.js',\n    path: path.resolve(__dirname, 'dist'),\n  },\n  module: {\n    rules: [\n      {\n        test: /\\\\.js$/,\n        exclude: /node_modules/,\n        use: 'babel-loader',\n      },\n    ],\n  },\n};`);
          }}>
            Generate Basic Config
          </button>
          <button onClick={() => {
            setResult(`# Webpack setup for ${projectName}:\n1. npm install webpack webpack-cli --save-dev\n2. npm install babel-loader @babel/core @babel/preset-react --save-dev\n3. Create webpack.config.js\n4. Add build script: "webpack --mode production"\n5. Run: npm run build`);
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

  const renderReactExamples = () => (
    <div className="example-section">
      <h3>React Configuration</h3>
      <div className="code-example">
        <pre>{`// webpack.config.js for React
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
      {
        test: /\\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    static: './dist',
    port: 3000,
    open: true,
    hot: true,
  },
};`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`const path = require('path');\nconst HtmlWebpackPlugin = require('html-webpack-plugin');\n\nmodule.exports = {\n  entry: './src/index.js',\n  output: {\n    filename: 'bundle.[contenthash].js',\n    path: path.resolve(__dirname, 'dist'),\n    clean: true,\n  },\n  module: {\n    rules: [\n      {\n        test: /\\\\.(js|jsx)$/,\n        exclude: /node_modules/,\n        use: {\n          loader: 'babel-loader',\n          options: {\n            presets: ['@babel/preset-react'],\n          },\n        },\n      },\n    ],\n  },\n  plugins: [\n    new HtmlWebpackPlugin({\n      template: './public/index.html',\n    }),\n  ],\n};`);
          }}>
            Generate React Config
          </button>
          <button onClick={() => {
            setResult(`# React + Webpack dependencies for ${projectName}:\nnpm install webpack webpack-cli --save-dev\nnpm install babel-loader @babel/core @babel/preset-react --save-dev\nnpm install html-webpack-plugin --save-dev\nnpm install style-loader css-loader --save-dev\nnpm install webpack-dev-server --save-dev`);
          }}>
            Show Dependencies
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderLoadersExamples = () => (
    <div className="example-section">
      <h3>Loaders</h3>
      <div className="code-example">
        <pre>{`// CSS Loaders
{
  test: /\\.css$/,
  use: ['style-loader', 'css-loader'],
}

// CSS Modules
{
  test: /\\.module\\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: true,
      },
    },
  ],
}

// Sass/SCSS Loaders
{
  test: /\\.(scss|sass)$/,
  use: [
    'style-loader',
    'css-loader',
    'sass-loader',
  ],
}

// File Loaders
{
  test: /\\.(png|svg|jpg|jpeg|gif)$/i,
  type: 'asset/resource',
  generator: {
    filename: 'images/[hash][ext][query]',
  },
}

// Font Loaders
{
  test: /\\.(woff|woff2|eot|ttf|otf)$/,
  type: 'asset/resource',
  generator: {
    filename: 'fonts/[hash][ext][query]',
  },
}`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`// CSS Loaders configuration:\n{\n  test: /\\\\.css$/,\n  use: ['style-loader', 'css-loader'],\n},\n\n// CSS Modules configuration:\n{\n  test: /\\\\.module\\\\.css$/,\n  use: [\n    'style-loader',\n    {\n      loader: 'css-loader',\n      options: {\n        modules: true,\n      },\n    },\n  ],\n},\n\n// Sass/SCSS configuration:\n{\n  test: /\\\\.(scss|sass)$/,\n  use: [\n    'style-loader',\n    'css-loader',\n    'sass-loader',\n  ],\n},`);
          }}>
            Generate CSS Loaders
          </button>
          <button onClick={() => {
            setResult(`// File Loaders configuration:\n{\n  test: /\\\\.(png|svg|jpg|jpeg|gif)$/i,\n  type: 'asset/resource',\n  generator: {\n    filename: 'images/[hash][ext][query]',\n  },\n},\n\n// Font Loaders configuration:\n{\n  test: /\\\\.(woff|woff2|eot|ttf|otf)$/,\n  type: 'asset/resource',\n  generator: {\n    filename: 'fonts/[hash][ext][query]',\n  },\n},`);
          }}>
            Generate Asset Loaders
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
        <pre>{`// HTML Plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');

plugins: [
  new HtmlWebpackPlugin({
    template: './public/index.html',
    filename: 'index.html',
    inject: 'body',
  }),
]

// Clean Plugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

plugins: [
  new CleanWebpackPlugin(),
]

// Mini CSS Extract
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

plugins: [
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css',
  }),
]

// Define Plugin
const webpack = require('webpack');

plugins: [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.API_URL': JSON.stringify('https://api.example.com'),
  }),
]

// Copy Plugin
const CopyWebpackPlugin = require('copy-webpack-plugin');

plugins: [
  new CopyWebpackPlugin({
    patterns: [
      { from: 'public', to: 'dist' },
    ],
  }),
]`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`const HtmlWebpackPlugin = require('html-webpack-plugin');\nconst { CleanWebpackPlugin } = require('clean-webpack-plugin');\n\nplugins: [\n  new HtmlWebpackPlugin({\n    template: './public/index.html',\n    filename: 'index.html',\n    inject: 'body',\n  }),\n  new CleanWebpackPlugin(),\n]`);
          }}>
            Generate HTML & Clean Plugins
          </button>
          <button onClick={() => {
            setResult(`const MiniCssExtractPlugin = require('mini-css-extract-plugin');\nconst webpack = require('webpack');\n\nplugins: [\n  new MiniCssExtractPlugin({\n    filename: '[name].[contenthash].css',\n  }),\n  new webpack.DefinePlugin({\n    'process.env.NODE_ENV': JSON.stringify('production'),\n  }),\n]`);
          }}>
            Generate CSS & Define Plugins
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderOptimizationExamples = () => (
    <div className="example-section">
      <h3>Optimization</h3>
      <div className="code-example">
        <pre>{`// Code Splitting
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\\\/]node_modules[\\\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
}

// Tree Shaking
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: false,
  },
}

// Minification
module.exports = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
    ],
  },
}

// Runtime Chunk
module.exports = {
  optimization: {
    runtimeChunk: 'single',
  },
}`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`optimization: {\n  splitChunks: {\n    chunks: 'all',\n    cacheGroups: {\n      vendor: {\n        test: /[\\\\\\\\/]node_modules[\\\\\\\\/]/,\n        name: 'vendors',\n        chunks: 'all',\n      },\n    },\n  },\n}`);
          }}>
            Generate Code Splitting
          </button>
          <button onClick={() => {
            setResult(`optimization: {\n  minimize: true,\n  minimizer: [\n    '...',\n    new CssMinimizerPlugin(),\n  ],\n  runtimeChunk: 'single',\n}`);
          }}>
            Generate Minification
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
        <pre>{`// Dev Server Configuration
module.exports = {
  devServer: {
    static: './dist',
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
}

// Proxy Configuration
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
}

// HTTPS Dev Server
module.exports = {
  devServer: {
    https: {
      key: fs.readFileSync('./server.key'),
      cert: fs.readFileSync('./server.crt'),
    },
  },
}`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`devServer: {\n  static: './dist',\n  port: 3000,\n  open: true,\n  hot: true,\n  compress: true,\n  historyApiFallback: true,\n},`);
          }}>
            Generate Dev Server Config
          </button>
          <button onClick={() => {
            setResult(`devServer: {\n  proxy: {\n    '/api': {\n      target: 'http://localhost:8080',\n      changeOrigin: true,\n      pathRewrite: {\n        '^/api': '',\n      },\n    },\n  },\n},`);
          }}>
            Generate Proxy Config
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
      <h2>Webpack Examples</h2>
      <p>Webpack is a static module bundler for modern JavaScript applications that bundles and optimizes assets for browsers.</p>
      
      <div className="example-navigation">
        <button 
          className={selectedExample === 'basics' ? 'active' : ''}
          onClick={() => setSelectedExample('basics')}
        >
          Basics
        </button>
        <button 
          className={selectedExample === 'react' ? 'active' : ''}
          onClick={() => setSelectedExample('react')}
        >
          React
        </button>
        <button 
          className={selectedExample === 'loaders' ? 'active' : ''}
          onClick={() => setSelectedExample('loaders')}
        >
          Loaders
        </button>
        <button 
          className={selectedExample === 'plugins' ? 'active' : ''}
          onClick={() => setSelectedExample('plugins')}
        >
          Plugins
        </button>
        <button 
          className={selectedExample === 'optimization' ? 'active' : ''}
          onClick={() => setSelectedExample('optimization')}
        >
          Optimization
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
        {selectedExample === 'react' && renderReactExamples()}
        {selectedExample === 'loaders' && renderLoadersExamples()}
        {selectedExample === 'plugins' && renderPluginsExamples()}
        {selectedExample === 'optimization' && renderOptimizationExamples()}
        {selectedExample === 'devserver' && renderDevServerExamples()}
      </div>

      <div className="installation">
        <h3>Installation</h3>
        <pre><code>npm install webpack webpack-cli --save-dev</code></pre>
      </div>

      <div className="resources">
        <h3>Resources</h3>
        <ul>
          <li><a href="https://webpack.js.org/" target="_blank" rel="noopener noreferrer">Official Website</a></li>
          <li><a href="https://webpack.js.org/concepts/" target="_blank" rel="noopener noreferrer">Documentation</a></li>
          <li><a href="https://github.com/webpack/webpack" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
        </ul>
      </div>
    </div>
  );
};

export default WebpackExamples;