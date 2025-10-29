// Hugo Static Site Generator Examples
// Demonstrates how to create and manage Hugo sites

/**
 * Example 1: Create a new Hugo site
 * Basic setup and configuration
 */
function createNewHugoSite() {
  console.log('=== Creating New Hugo Site ===');
  
  // Commands to create a new Hugo site
  const commands = [
    'hugo new site my-site',
    'cd my-site',
    'git init',
    'echo "theme = 'ananke'" >> hugo.toml',
    'hugo server'
  ];
  
  console.log('Hugo Site Creation Commands:');
  commands.forEach((cmd, index) => {
    console.log(`  ${index + 1}. ${cmd}');
  }
  
  return commands;
}

/**
 * Example 2: Hugo configuration setup
 * Shows how to configure a Hugo site
 */
function configureHugoSite() {
  console.log('\n=== Configuring Hugo Site ===');
  
  const configExample = `
# hugo.toml configuration example
baseURL = 'https://example.org/'
languageCode = 'en-us'
title = 'My New Hugo Site'
theme = 'ananke'
`;
  
  console.log('Example Hugo Configuration:');
  console.log(configExample);
  
  return configExample;
}

/**
 * Example 3: Create Hugo content with front matter
 * Demonstrates Markdown content with TOML front matter
 */
function createHugoContent() {
  console.log('\n=== Creating Hugo Content ===');
  
  const contentExample = `
+++
title = 'My First Post'
date = 2024-01-14T07:07:07+01:00
draft = true
+++
## Introduction

This is my first post using Hugo!

**Features:**
- Fast build times
- Markdown support
- Theme system
`;
  
  console.log('Example Hugo Content:');
  console.log(contentExample);
  
  return contentExample;
}

/**
 * Example 4: Hugo template examples
 * Shows basic templating with Go HTML templates
 */
function createHugoTemplates() {
  console.log('\n=== Creating Hugo Templates ===');
  
  const templateExample = `
{{ define "main" }}
  <h1>{{ .Title }}</h1>
  <div class="content">
    {{ .Content }}
  </div>
{{ end }}
`;
  
  console.log('Example Hugo Template:');
  console.log(templateExample);
  
  return templateExample;
}

/**
 * Example 5: Hugo deployment commands
 * Shows how to build and deploy Hugo sites
 */
function deployHugoSite() {
  console.log('\n=== Deploying Hugo Site ===');
  
  const deployCommands = [
    'hugo', // Build the site
    'hugo --minify', // Build with minification
  'hugo --environment production' // Production build
};
  
  console.log('Deployment Commands:');
  deployCommands.forEach((cmd, index) => {
    console.log(`  ${index + 1}. Build the site',
  '  ${index + 2}. Deploy to hosting service
  ];
  
  return deployCommands;
}

/**
 * Example 6: Hugo multilingual setup
 * Shows how to configure multiple languages
 */
function setupMultilingualHugo() {
  console.log('\n=== Setting Up Multilingual Hugo Site ===');
  
  const multilingualConfig = `
# Multilingual configuration
defaultContentLanguage = 'en'
defaultContentLanguageInSubdir = true

[languages.en]
weight = 1
title = 'My Site'
[languages.es]
weight = 2
title = 'Mi Sitio'
`;
  
  console.log('Multilingual Configuration Example:');
  console.log(multilingualConfig);
  
  return multilingualConfig;
}

// Run all Hugo examples
async function runHugoExamples() {
  console.log('🏗️ Hugo Static Site Generator Tutorial\n');
  
  // Example 1: Create site
  const creationCommands = createNewHugoSite();
  
  // Example 2: Site configuration
  const siteConfig = configureHugoSite();
  
  // Example 3: Content creation
  const content = createHugoContent();
  
  // Example 4: Templates
  const templates = createHugoTemplates();
  
  // Example 5: Deployment
  const deployCommands = deployHugoSite();
  
  // Example 6: Multilingual setup
  const multilingualSetup = setupMultilingualHugo();
  
  console.log('\n🎉 Hugo tutorial completed!');
  console.log('\n📝 Hugo SSG Takeaways:');
  console.log('• Extremely fast build times');
  console.log('• Excellent for documentation and blogs');
  console.log('• Strong community and theme ecosystem');
  console.log('• Good for SEO and performance');
}

// Export functions
export {
  createNewHugoSite,
  configureHugoSite,
  createHugoContent,
  createHugoTemplates,
  deployHugoSite,
  setupMultilingualHugo,
  runHugoExamples
};

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runHugoExamples().catch(console.error);
}