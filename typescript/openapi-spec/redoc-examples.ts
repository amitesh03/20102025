// ReDoc TypeScript Examples - Advanced API Documentation with ReDoc
// This file demonstrates comprehensive TypeScript usage with ReDoc

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { execSync } from 'child_process';

// ===== BASIC TYPES =====

// ReDoc configuration
interface ReDocConfig {
  spec: any;
  specUrl?: string;
  routePrefix?: string;
  title?: string;
  description?: string;
  version?: string;
  logo?: {
    src: string;
    href?: string;
    altText?: string;
  };
  theme?: {
    colors: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
      link: string;
    };
    typography: {
      fontFamily?: string;
      fontSize?: string;
      lineHeight?: string;
      fontWeight?: string;
    };
    spacing: {
      unit?: number;
      sectionHorizontal?: number;
      sectionVertical?: number;
    };
    breakpoints: {
      small?: string;
      medium?: string;
      large?: string;
    };
  };
  hideDownloadButton?: boolean;
  hideHostname?: boolean;
  expandSingleSchemaField?: boolean;
  requiredPropsFirst?: boolean;
  sortPropsAlphabetically?: boolean;
  sortEnumValuesAlphabetically?: boolean;
  sortOperationsAlphabetically?: boolean;
  sortTagsAlphabetically?: boolean;
  noAutoAuth?: boolean;
  auth?: {
    name: string;
    schema: any;
    description?: string;
  }[];
  hideLoading?: boolean;
  nativeScrollbars?: boolean;
  scrollYOffset?: number;
  menuToggle?: boolean;
  menuToggleCollapsed?: boolean;
  unstable_externalDescription?: boolean;
  unstable_ignoreMimeParameters?: boolean;
  unstable_hideHostname?: boolean;
  unstable_hideSingleRequestSampleTab?: boolean;
  unstable_hideTryItOutPanels?: boolean;
  unstable_collapseAfter?: number;
  unstable_collapseDefault?: boolean;
  unstable_collapseTags?: string[];
  unstable_precompile?: boolean;
  unstable_precompileAll?: boolean;
  unstable_disableSearch?: boolean;
  unstable_disableSidebar?: boolean;
  unstable_disableToc?: boolean;
  unstable_disableSecurity?: boolean;
  unstable_disableTryItOut?: boolean;
  unstable_disableLogo?: boolean;
  unstable_disableDarkModeToggle?: boolean;
  unstable_disableThemeToggle?: boolean;
  unstable_disableVersionSelector?: boolean;
  unstable_disableLanguageSelector?: boolean;
  unstable_disableDownload?: boolean;
  unstable_disablePrint?: boolean;
  unstable_disableCopy?: boolean;
  unstable_disableExpand?: boolean;
  unstable_disableSchemaDefaults?: boolean;
  unstable_disableSchemaPattern?: boolean;
  unstable_disableSchemaReadOnly?: boolean;
  unstable_disableSchemaWriteOnly?: boolean;
  unstable_disableSchemaDeprecated?: boolean;
  unstable_disableSchemaNullable?: boolean;
  unstable_disableSchemaEnum?: boolean;
  unstable_disableSchemaFormat?: boolean;
  unstable_disableSchemaMinLength?: boolean;
  unstable_disableSchemaMaxLength?: boolean;
  unstable_disableSchemaMinimum?: boolean;
  unstable_disableSchemaMaximum?: boolean;
  unstable_disableSchemaMultipleOf?: boolean;
  unstable_disableSchemaOneOf?: boolean;
  unstable_disableSchemaAnyOf?: boolean;
  unstable_disableSchemaNot?: boolean;
  unstable_disableSchemaItems?: boolean;
  unstable_disableSchemaAdditionalProperties?: boolean;
  unstable_disableSchemaPatternProperties?: boolean;
  unstable_disableSchemaDependencies?: boolean;
  unstable_disableSchemaIf?: boolean;
  unstable_disableSchemaThen?: boolean;
  unstable_disableSchemaElse?: boolean;
  unstable_disableSchemaConst?: boolean;
  unstable_disableSchemaDefault?: boolean;
  unstable_disableSchemaExample?: boolean;
  unstable_disableSchemaComment?: boolean;
  unstable_disableSchemaXml?: boolean;
  unstable_disableSchemaExternalDocs?: boolean;
  unstable_disableSchemaExtensions?: boolean;
  unstable_disableSchemaAllOf?: boolean;
}

// Documentation options
interface DocumentationOptions {
  title: string;
  description?: string;
  version?: string;
  logo?: {
    src: string;
    href?: string;
    altText?: string;
  };
  theme?: {
    colors?: {
      primary?: string;
      secondary?: string;
      success?: string;
      warning?: string;
      error?: string;
      link?: string;
    };
    typography?: {
      fontFamily?: string;
      fontSize?: string;
      lineHeight?: string;
      fontWeight?: string;
    };
    spacing?: {
      unit?: number;
      sectionHorizontal?: number;
      sectionVertical?: number;
    };
  };
  hideDownloadButton?: boolean;
  hideHostname?: boolean;
  expandSingleSchemaField?: boolean;
  requiredPropsFirst?: boolean;
  sortPropsAlphabetically?: boolean;
  sortEnumValuesAlphabetically?: boolean;
  sortOperationsAlphabetically?: boolean;
  sortTagsAlphabetically?: boolean;
  noAutoAuth?: boolean;
  auth?: Array<{
    name: string;
    schema: any;
    description?: string;
  }>;
  hideLoading?: boolean;
  nativeScrollbars?: boolean;
  scrollYOffset?: number;
  menuToggle?: boolean;
  menuToggleCollapsed?: boolean;
}

// Custom template
interface CustomTemplate {
  name: string;
  description: string;
  template: string;
  styles?: string;
  scripts?: string;
  variables?: Record<string, any>;
}

// ===== REDOC MANAGER =====

class ReDocManager {
  private config: ReDocConfig;
  private templates: Map<string, CustomTemplate> = new Map();
  private customThemes: Map<string, any> = new Map();

  constructor(config: ReDocConfig) {
    this.config = config;
  }

  // ===== CONFIGURATION =====

  // Update configuration
  updateConfig(updates: Partial<ReDocConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  // Get configuration
  getConfig(): ReDocConfig {
    return this.config;
  }

  // Set theme
  setTheme(theme: Partial<ReDocConfig['theme']>): void {
    this.config.theme = { ...this.config.theme, ...theme };
  }

  // Set authentication
  setAuth(auth: ReDocConfig['auth']): void {
    this.config.auth = auth;
  }

  // ===== DOCUMENTATION GENERATION =====

  // Generate HTML documentation
  generateHtml(outputPath: string): void {
    const html = this.buildHtml();
    
    // Ensure directory exists
    const dir = dirname(outputPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    // Write HTML file
    writeFileSync(outputPath, html);
    console.log(`ReDoc documentation generated: ${outputPath}`);
  }

  // Build HTML
  private buildHtml(): string {
    const { spec, theme, title, description, logo } = this.config;
    
    return `
<!DOCTYPE html>
<html>
<head>
  <title>${title || 'API Documentation'}</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Roboto, sans-serif;
    }
    ${this.buildCustomStyles()}
  </style>
</head>
<body>
  <redoc spec-url="${this.config.specUrl || 'spec.json'}" ${this.buildConfigAttributes()}></redoc>
  <script src="https://cdn.jsdelivr.net/npm/redoc@2.0.0/bundles/redoc.standalone.js"></script>
  ${this.buildCustomScripts()}
</body>
</html>
    `.trim();
  }

  // Build configuration attributes
  private buildConfigAttributes(): string {
    const attributes: string[] = [];
    
    if (this.config.hideDownloadButton) {
      attributes.push('hide-download-button');
    }
    
    if (this.config.hideHostname) {
      attributes.push('hide-hostname');
    }
    
    if (this.config.expandSingleSchemaField) {
      attributes.push('expand-single-schema-field');
    }
    
    if (this.config.requiredPropsFirst) {
      attributes.push('required-props-first');
    }
    
    if (this.config.sortPropsAlphabetically) {
      attributes.push('sort-props-alphabetically');
    }
    
    if (this.config.sortEnumValuesAlphabetically) {
      attributes.push('sort-enum-values-alphabetically');
    }
    
    if (this.config.sortOperationsAlphabetically) {
      attributes.push('sort-operations-alphabetically');
    }
    
    if (this.config.sortTagsAlphabetically) {
      attributes.push('sort-tags-alphabetically');
    }
    
    if (this.config.noAutoAuth) {
      attributes.push('no-auto-auth');
    }
    
    if (this.config.hideLoading) {
      attributes.push('hide-loading');
    }
    
    if (this.config.nativeScrollbars) {
      attributes.push('native-scrollbars');
    }
    
    if (this.config.scrollYOffset) {
      attributes.push(`scroll-y-offset="${this.config.scrollYOffset}"`);
    }
    
    if (this.config.menuToggle) {
      attributes.push('menu-toggle');
    }
    
    if (this.config.menuToggleCollapsed) {
      attributes.push('menu-toggle-collapsed');
    }
    
    return attributes.join(' ');
  }

  // Build custom styles
  private buildCustomStyles(): string {
    if (!this.config.theme) {
      return '';
    }
    
    const { colors, typography, spacing } = this.config.theme;
    let styles = '';
    
    if (colors) {
      styles += `
        :root {
          --redoc-primary-color: ${colors.primary || '#2584e5'};
          --redoc-secondary-color: ${colors.secondary || '#3c4d66'};
          --redoc-success-color: ${colors.success || '#28a745'};
          --redoc-warning-color: ${colors.warning || '#ffc107'};
          --redoc-error-color: ${colors.error || '#dc3545'};
          --redoc-link-color: ${colors.link || '#007bff'};
        }
      `;
    }
    
    if (typography) {
      styles += `
        body {
          font-family: ${typography.fontFamily || 'Roboto, sans-serif'};
          font-size: ${typography.fontSize || '14px'};
          line-height: ${typography.lineHeight || '1.5'};
          font-weight: ${typography.fontWeight || '400'};
        }
      `;
    }
    
    if (spacing) {
      styles += `
        :root {
          --redoc-spacing-unit: ${spacing.unit || 8}px;
          --redoc-spacing-section-horizontal: ${spacing.sectionHorizontal || 40}px;
          --redoc-spacing-section-vertical: ${spacing.sectionVertical || 40}px;
        }
      `;
    }
    
    return styles;
  }

  // Build custom scripts
  private buildCustomScripts(): string {
    let scripts = '';
    
    // Add custom theme scripts
    if (this.config.theme) {
      scripts += `
        <script>
          Redoc.init(
            ${JSON.stringify(this.config.spec)},
            ${JSON.stringify(this.config)}
          );
        </script>
      `;
    }
    
    return scripts;
  }

  // ===== TEMPLATE MANAGEMENT =====

  // Register custom template
  registerTemplate(template: CustomTemplate): void {
    this.templates.set(template.name, template);
  }

  // Get template
  getTemplate(name: string): CustomTemplate | undefined {
    return this.templates.get(name);
  }

  // Generate documentation with custom template
  generateWithTemplate(templateName: string, outputPath: string, variables?: Record<string, any>): void {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template not found: ${templateName}`);
    }
    
    let html = template.template;
    
    // Replace variables
    if (template.variables || variables) {
      const allVariables = { ...template.variables, ...variables };
      for (const [key, value] of Object.entries(allVariables)) {
        html = html.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), String(value));
      }
    }
    
    // Add custom styles and scripts
    if (template.styles) {
      html = html.replace('</head>', `<style>${template.styles}</style></head>`);
    }
    
    if (template.scripts) {
      html = html.replace('</body>', `<script>${template.scripts}</script></body>`);
    }
    
    // Ensure directory exists
    const dir = dirname(outputPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    // Write HTML file
    writeFileSync(outputPath, html);
    console.log(`ReDoc documentation generated with template: ${outputPath}`);
  }

  // Create default templates
  createDefaultTemplates(): void {
    // Corporate template
    this.registerTemplate({
      name: 'corporate',
      description: 'Corporate-style documentation',
      template: `
<!DOCTYPE html>
<html>
<head>
  <title>{{title}} - API Documentation</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Roboto, sans-serif;
      background-color: #f8f9fa;
    }
    .header {
      background-color: #2c3e50;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-family: Montserrat, sans-serif;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{title}}</h1>
    <p>{{description}}</p>
  </div>
  <div class="container">
    <redoc spec-url="spec.json" hide-download-button></redoc>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/redoc@2.0.0/bundles/redoc.standalone.js"></script>
</body>
</html>
      `,
      styles: `
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
      `,
    });

    // Minimal template
    this.registerTemplate({
      name: 'minimal',
      description: 'Minimal-style documentation',
      template: `
<!DOCTYPE html>
<html>
<head>
  <title>{{title}} - API Documentation</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,700" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Roboto, sans-serif;
      background-color: white;
    }
  </style>
</head>
<body>
  <redoc spec-url="spec.json" hide-download-button native-scrollbars></redoc>
  <script src="https://cdn.jsdelivr.net/npm/redoc@2.0.0/bundles/redoc.standalone.js"></script>
</body>
</html>
      `,
    });

    // Dark template
    this.registerTemplate({
      name: 'dark',
      description: 'Dark theme documentation',
      template: `
<!DOCTYPE html>
<html>
<head>
  <title>{{title}} - API Documentation</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,700" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Roboto, sans-serif;
      background-color: #1a1a1a;
      color: #e0e0e0;
    }
    :root {
      --redoc-primary-color: #bb86fc;
      --redoc-secondary-color: #3c4d66;
      --redoc-text-color: #e0e0e0;
      --redoc-background-color: #1a1a1a;
    }
  </style>
</head>
<body>
  <redoc spec-url="spec.json" hide-download-button></redoc>
  <script src="https://cdn.jsdelivr.net/npm/redoc@2.0.0/bundles/redoc.standalone.js"></script>
</body>
</html>
      `,
    });
  }

  // ===== THEME MANAGEMENT =====

  // Register custom theme
  registerTheme(name: string, theme: any): void {
    this.customThemes.set(name, theme);
  }

  // Get theme
  getTheme(name: string): any | undefined {
    return this.customThemes.get(name);
  }

  // Apply theme
  applyTheme(themeName: string): void {
    const theme = this.customThemes.get(themeName);
    if (theme) {
      this.config.theme = { ...this.config.theme, ...theme };
    }
  }

  // Create default themes
  createDefaultThemes(): void {
    // Blue theme
    this.registerTheme('blue', {
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545',
        link: '#007bff',
      },
    });

    // Green theme
    this.registerTheme('green', {
      colors: {
        primary: '#28a745',
        secondary: '#6c757d',
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545',
        link: '#28a745',
      },
    });

    // Purple theme
    this.registerTheme('purple', {
      colors: {
        primary: '#6f42c1',
        secondary: '#6c757d',
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545',
        link: '#6f42c1',
      },
    });
  }

  // ===== UTILITY METHODS =====

  // Validate OpenAPI spec
  validateSpec(spec: any): boolean {
    try {
      // Basic validation
      if (!spec.openapi && !spec.swagger) {
        console.error('Spec must have openapi or swagger field');
        return false;
      }
      
      if (!spec.info) {
        console.error('Spec must have info field');
        return false;
      }
      
      if (!spec.paths) {
        console.error('Spec must have paths field');
        return false;
      }
      
      console.log('OpenAPI spec is valid');
      return true;
    } catch (error) {
      console.error('Spec validation failed:', error);
      return false;
    }
  }

  // Minify HTML
  minifyHtml(html: string): string {
    return html
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .replace(/^\s+|\s+$/g, '');
  }

  // Get configuration
  getConfiguration(): ReDocConfig {
    return this.config;
  }

  // Export configuration
  exportConfig(outputPath: string): void {
    const configJson = JSON.stringify(this.config, null, 2);
    writeFileSync(outputPath, configJson);
    console.log(`ReDoc configuration exported: ${outputPath}`);
  }

  // Import configuration
  importConfig(configPath: string): void {
    try {
      const configJson = readFileSync(configPath, 'utf8');
      const config = JSON.parse(configJson);
      this.config = { ...this.config, ...config };
      console.log(`ReDoc configuration imported: ${configPath}`);
    } catch (error) {
      console.error('Failed to import configuration:', error);
    }
  }
}

// ===== REDOC SERVICE =====

class ReDocService {
  private manager: ReDocManager;

  constructor(config: ReDocConfig) {
    this.manager = new ReDocManager(config);
  }

  // Initialize service
  initialize(): void {
    this.manager.createDefaultTemplates();
    this.manager.createDefaultThemes();
  }

  // Generate documentation
  generateDocumentation(outputPath: string): void {
    this.manager.generateHtml(outputPath);
  }

  // Generate with template
  generateWithTemplate(templateName: string, outputPath: string, variables?: Record<string, any>): void {
    this.manager.generateWithTemplate(templateName, outputPath, variables);
  }

  // Update configuration
  updateConfig(updates: Partial<ReDocConfig>): void {
    this.manager.updateConfig(updates);
  }

  // Set theme
  setTheme(theme: Partial<ReDocConfig['theme']>): void {
    this.manager.setTheme(theme);
  }

  // Apply theme
  applyTheme(themeName: string): void {
    this.manager.applyTheme(themeName);
  }

  // Register template
  registerTemplate(template: CustomTemplate): void {
    this.manager.registerTemplate(template);
  }

  // Register theme
  registerTheme(name: string, theme: any): void {
    this.manager.registerTheme(name, theme);
  }

  // Validate spec
  validateSpec(spec: any): boolean {
    return this.manager.validateSpec(spec);
  }

  // Export configuration
  exportConfig(outputPath: string): void {
    this.manager.exportConfig(outputPath);
  }

  // Import configuration
  importConfig(configPath: string): void {
    this.manager.importConfig(configPath);
  }

  // Get manager
  getManager(): ReDocManager {
    return this.manager;
  }
}

// ===== EXAMPLE USAGE =====

// Example: Generate basic documentation
async function generateBasicDocumentation() {
  const service = new ReDocService({
    spec: {
      openapi: '3.0.0',
      info: {
        title: 'My API',
        version: '1.0.0',
        description: 'A sample API',
      },
      paths: {
        '/users': {
          get: {
            summary: 'Get users',
            responses: {
              '200': {
                description: 'Successful response',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/User',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      components: {
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
            },
          },
        },
      },
    },
    title: 'My API Documentation',
    description: 'Comprehensive API documentation',
    theme: {
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
      },
    },
    hideDownloadButton: false,
    sortPropsAlphabetically: true,
  });

  service.initialize();
  service.generateDocumentation('./docs/index.html');
}

// Example: Generate with custom template
async function generateWithCustomTemplate() {
  const service = new ReDocService({
    spec: {}, // Your OpenAPI spec
    title: 'My API',
  });

  service.initialize();
  
  // Register custom template
  service.registerTemplate({
    name: 'custom',
    description: 'Custom template',
    template: `
<!DOCTYPE html>
<html>
<head>
  <title>{{title}} - API Documentation</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Arial, sans-serif; }
    .custom-header { background: #333; color: white; padding: 20px; }
  </style>
</head>
<body>
  <div class="custom-header">
    <h1>{{title}}</h1>
  </div>
  <redoc spec-url="spec.json"></redoc>
  <script src="https://cdn.jsdelivr.net/npm/redoc@2.0.0/bundles/redoc.standalone.js"></script>
</body>
</html>
    `,
  });

  service.generateWithTemplate('custom', './docs/custom.html', {
    title: 'My Custom API',
    description: 'Custom API documentation',
  });
}

// ===== EXERCISES =====

/*
EXERCISE 1: Create a ReDoc plugin system that:
- Supports custom components
- Provides plugin configuration
- Implements plugin lifecycle hooks
- Supports plugin distribution
- Is fully typed

EXERCISE 2: Build a ReDoc theme system that:
- Supports dynamic theme switching
- Provides theme customization
- Implements theme inheritance
- Supports theme sharing
- Is fully typed

EXERCISE 3: Create a ReDoc documentation system that:
- Supports multi-language documentation
- Provides interactive examples
- Implements documentation search
- Supports documentation versioning
- Is fully typed

EXERCISE 4: Build a ReDoc testing system that:
- Generates test cases from API specs
- Supports automated API testing
- Provides test data generation
- Implements test reporting
- Is fully typed

EXERCISE 5: Create a ReDoc analytics system that:
- Tracks documentation usage
- Provides usage analytics
- Monitors API performance
- Supports custom metrics collection
- Is fully typed
*/

// Export classes and interfaces
export { ReDocManager, ReDocService };

// Export types
export type {
  ReDocConfig,
  DocumentationOptions,
  CustomTemplate,
};
