// OpenAPI Generator TypeScript Examples - Advanced Code Generation
// This file demonstrates comprehensive TypeScript usage with OpenAPI Generator

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { execSync } from 'child_process';

// ===== BASIC TYPES =====

// Generator configuration
interface GeneratorConfig {
  inputSpec: string;
  outputDir: string;
  generatorName: string;
  configOptions?: Record<string, string>;
  additionalProperties?: Record<string, string>;
  globalProperties?: Record<string, string>;
  skipOverwrite?: boolean;
  removeOperationIdPrefix?: boolean;
  apiPackage?: string;
  modelPackage?: string;
  invokerPackage?: string;
  groupId?: string;
  artifactId?: string;
  artifactVersion?: string;
  library?: string;
  templateDir?: string;
  reservedWordsMappings?: Record<string, string>;
  ignoreFileOverride?: string;
  httpUserAgent?: string;
  projectName?: string;
  projectDescription?: string;
  projectVersion?: string;
  projectUrl?: string;
  scmConnection?: string;
  scmDeveloperConnection?: string;
  scmUrl?: string;
  developerName?: string;
  developerEmail?: string;
  developerOrganization?: string;
  developerOrganizationUrl?: string;
  licenseName?: string;
  licenseUrl?: string;
  sourceFolder?: string;
  localVariablePrefix?: string;
  serializableModel?: boolean;
  serializeBigDecimalAsString?: boolean;
  enumPropertyNaming?: 'PascalCase' | 'camelCase' | 'snake_case' | 'UPPERCASE';
  dateLibrary?: 'java8' | 'java8-localdatetime' | 'joda' | 'legacy';
  useBeanValidation?: boolean;
  performBeanValidation?: boolean;
  useOptionals?: boolean;
  openApiNullable?: boolean;
  hideGenerationTimestamp?: boolean;
  generateApiTests?: boolean;
  generateModelTests?: boolean;
  generateApiDocumentation?: boolean;
  generateModelDocumentation?: boolean;
  withInterfaces?: boolean;
  withSeparateModelsAndApi?: boolean;
  supportingFiles?: string[];
}

// TypeScript generator options
interface TypeScriptGeneratorConfig extends GeneratorConfig {
  modelPropertyNaming?: 'original' | 'camelCase' | 'PascalCase' | 'snake_case';
  enumValueNaming?: 'original' | 'UPPERCASE' | 'PascalCase';
  serviceSuffix?: string;
  serviceFileSuffix?: string;
  enumSuffix?: string;
  fileNaming?: 'camelCase' | 'kebab-case' | 'snake_case';
  templateType?: 'model' | 'api' | 'supporting';
  npmName?: string;
  npmVersion?: string;
  npmRepository?: string;
  snapshot?: boolean;
  withInterfaces?: boolean;
  withoutPrefixEnums?: boolean;
  enumPropertyNaming?: 'PascalCase' | 'camelCase' | 'snake_case' | 'original';
  stringEnums?: boolean;
  prettier?: boolean;
  prettierOptions?: Record<string, any>;
  singleHttpClient?: boolean;
  useSingleRequestParameter?: boolean;
  paramNaming?: 'original' | 'camelCase' | 'PascalCase' | 'snake_case';
}

// Template configuration
interface TemplateConfig {
  name: string;
  description: string;
  files: Array<{
    path: string;
    content: string;
    type: 'model' | 'api' | 'supporting';
  }>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

// Code generation options
interface CodeGenerationOptions {
  specPath: string;
  outputDir: string;
  generator: string;
  config?: Partial<TypeScriptGeneratorConfig>;
  templates?: TemplateConfig[];
  postProcessing?: Array<{
    type: 'format' | 'lint' | 'test' | 'build';
    command: string;
    options?: Record<string, any>;
  }>;
}

// ===== OPENAPI GENERATOR MANAGER =====

class OpenAPIGeneratorManager {
  private config: GeneratorConfig;
  private templates: Map<string, TemplateConfig> = new Map();
  private generators: Map<string, GeneratorConfig> = new Map();

  constructor(config: GeneratorConfig) {
    this.config = config;
  }

  // ===== GENERATION =====

  // Generate code
  async generate(options?: Partial<GeneratorConfig>): Promise<void> {
    const finalConfig = { ...this.config, ...options };
    
    try {
      const command = this.buildGenerationCommand(finalConfig);
      console.log('Running OpenAPI Generator:', command);
      
      execSync(command, { stdio: 'inherit' });
      console.log('Code generation completed successfully');
    } catch (error) {
      console.error('Code generation failed:', error);
      throw error;
    }
  }

  // Build generation command
  private buildGenerationCommand(config: GeneratorConfig): string {
    let command = 'openapi-generator-cli generate';
    
    // Input spec
    command += ` -i ${config.inputSpec}`;
    
    // Output directory
    command += ` -o ${config.outputDir}`;
    
    // Generator name
    command += ` -g ${config.generatorName}`;
    
    // Config options
    if (config.configOptions) {
      for (const [key, value] of Object.entries(config.configOptions)) {
        command += ` -c ${key}=${value}`;
      }
    }
    
    // Additional properties
    if (config.additionalProperties) {
      for (const [key, value] of Object.entries(config.additionalProperties)) {
        command += ` --additional-properties=${key}=${value}`;
      }
    }
    
    // Global properties
    if (config.globalProperties) {
      for (const [key, value] of Object.entries(config.globalProperties)) {
        command += ` --global-properties=${key}=${value}`;
      }
    }
    
    // Skip overwrite
    if (config.skipOverwrite) {
      command += ' --skip-overwrite';
    }
    
    // Remove operation ID prefix
    if (config.removeOperationIdPrefix) {
      command += ' --remove-operation-id-prefix';
    }
    
    return command;
  }

  // Generate TypeScript client
  async generateTypeScriptClient(options: TypeScriptGeneratorConfig): Promise<void> {
    const config: GeneratorConfig = {
      ...options,
      generatorName: 'typescript-axios',
      configOptions: {
        modelPropertyNaming: options.modelPropertyNaming || 'camelCase',
        enumValueNaming: options.enumValueNaming || 'PascalCase',
        serviceSuffix: options.serviceSuffix || 'Service',
        serviceFileSuffix: options.serviceFileSuffix || 'Service',
        enumSuffix: options.enumSuffix || 'Enum',
        fileNaming: options.fileNaming || 'camelCase',
        npmName: options.npmName,
        npmVersion: options.npmVersion,
        npmRepository: options.npmRepository,
        snapshot: options.snapshot?.toString() || 'false',
        withInterfaces: options.withInterfaces?.toString() || 'true',
        withoutPrefixEnums: options.withoutPrefixEnums?.toString() || 'false',
        enumPropertyNaming: options.enumPropertyNaming || 'PascalCase',
        stringEnums: options.stringEnums?.toString() || 'false',
        prettier: options.prettier?.toString() || 'true',
        singleHttpClient: options.singleHttpClient?.toString() || 'false',
        useSingleRequestParameter: options.useSingleRequestParameter?.toString() || 'false',
        paramNaming: options.paramNaming || 'camelCase',
      },
    };

    await this.generate(config);
  }

  // Generate TypeScript models only
  async generateTypeScriptModels(options: TypeScriptGeneratorConfig): Promise<void> {
    const config: GeneratorConfig = {
      ...options,
      generatorName: 'typescript-models',
      configOptions: {
        modelPropertyNaming: options.modelPropertyNaming || 'camelCase',
        enumValueNaming: options.enumValueNaming || 'PascalCase',
        enumSuffix: options.enumSuffix || 'Enum',
        fileNaming: options.fileNaming || 'camelCase',
        withInterfaces: options.withInterfaces?.toString() || 'true',
        withoutPrefixEnums: options.withoutPrefixEnums?.toString() || 'false',
        enumPropertyNaming: options.enumPropertyNaming || 'PascalCase',
        stringEnums: options.stringEnums?.toString() || 'false',
        prettier: options.prettier?.toString() || 'true',
      },
    };

    await this.generate(config);
  }

  // ===== TEMPLATE MANAGEMENT =====

  // Register template
  registerTemplate(template: TemplateConfig): void {
    this.templates.set(template.name, template);
  }

  // Get template
  getTemplate(name: string): TemplateConfig | undefined {
    return this.templates.get(name);
  }

  // Create custom template
  createCustomTemplate(name: string, description: string): TemplateConfig {
    return {
      name,
      description,
      files: [],
      dependencies: {},
      devDependencies: {
        'openapi-generator-cli': '^6.0.0',
        'typescript': '^4.0.0',
        '@types/node': '^16.0.0',
      },
    };
  }

  // Generate template files
  async generateTemplateFiles(template: TemplateConfig, outputDir: string): Promise<void> {
    for (const file of template.files) {
      const filePath = join(outputDir, file.path);
      const dirPath = dirname(filePath);
      
      // Create directory if it doesn't exist
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }
      
      // Write file
      writeFileSync(filePath, file.content);
      console.log(`Generated template file: ${filePath}`);
    }
  }

  // Create package.json for template
  createPackageJson(template: TemplateConfig, outputDir: string): void {
    const packageJson = {
      name: template.name,
      version: '1.0.0',
      description: template.description,
      dependencies: template.dependencies || {},
      devDependencies: template.devDependencies || {},
      scripts: {
        build: 'tsc',
        test: 'jest',
        lint: 'eslint src --ext .ts',
        format: 'prettier --write src/**/*.ts',
      },
    };

    const packageJsonPath = join(outputDir, 'package.json');
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`Generated package.json: ${packageJsonPath}`);
  }

  // ===== POST-PROCESSING =====

  // Format generated code
  async formatCode(outputDir: string): Promise<void> {
    try {
      console.log('Formatting generated code...');
      execSync(`cd ${outputDir} && npx prettier --write "**/*.ts"`, { stdio: 'inherit' });
      console.log('Code formatting completed');
    } catch (error) {
      console.error('Code formatting failed:', error);
    }
  }

  // Lint generated code
  async lintCode(outputDir: string): Promise<void> {
    try {
      console.log('Linting generated code...');
      execSync(`cd ${outputDir} && npx eslint src --ext .ts --fix`, { stdio: 'inherit' });
      console.log('Code linting completed');
    } catch (error) {
      console.error('Code linting failed:', error);
    }
  }

  // Run tests
  async runTests(outputDir: string): Promise<void> {
    try {
      console.log('Running tests...');
      execSync(`cd ${outputDir} && npm test`, { stdio: 'inherit' });
      console.log('Tests completed');
    } catch (error) {
      console.error('Tests failed:', error);
    }
  }

  // Build project
  async buildProject(outputDir: string): Promise<void> {
    try {
      console.log('Building project...');
      execSync(`cd ${outputDir} && npm run build`, { stdio: 'inherit' });
      console.log('Build completed');
    } catch (error) {
      console.error('Build failed:', error);
    }
  }

  // ===== UTILITY METHODS =====

  // Validate OpenAPI spec
  validateSpec(specPath: string): boolean {
    try {
      execSync(`openapi-generator-cli validate -i ${specPath}`, { stdio: 'inherit' });
      console.log('OpenAPI spec is valid');
      return true;
    } catch (error) {
      console.error('OpenAPI spec validation failed:', error);
      return false;
    }
  }

  // List available generators
  listGenerators(): string[] {
    try {
      const output = execSync('openapi-generator-cli list', { encoding: 'utf8' });
      const lines = output.split('\n');
      return lines.filter(line => line.trim().length > 0);
    } catch (error) {
      console.error('Failed to list generators:', error);
      return [];
    }
  }

  // Get generator version
  getGeneratorVersion(generatorName: string): string {
    try {
      const output = execSync(`openapi-generator-cli version -g ${generatorName}`, { encoding: 'utf8' });
      return output.trim();
    } catch (error) {
      console.error('Failed to get generator version:', error);
      return '';
    }
  }

  // Update generators
  updateGenerators(): void {
    try {
      console.log('Updating OpenAPI generators...');
      execSync('openapi-generator-cli update', { stdio: 'inherit' });
      console.log('Generators updated successfully');
    } catch (error) {
      console.error('Failed to update generators:', error);
    }
  }

  // Get configuration
  getConfig(): GeneratorConfig {
    return this.config;
  }

  // Update configuration
  updateConfig(updates: Partial<GeneratorConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}

// ===== CODE GENERATION SERVICE =====

class CodeGenerationService {
  private generator: OpenAPIGeneratorManager;

  constructor(config: GeneratorConfig) {
    this.generator = new OpenAPIGeneratorManager(config);
  }

  // Generate complete project
  async generateProject(options: CodeGenerationOptions): Promise<void> {
    console.log('Starting code generation...');

    // Validate spec
    if (!this.generator.validateSpec(options.specPath)) {
      throw new Error('Invalid OpenAPI specification');
    }

    // Generate code
    await this.generator.generate({
      inputSpec: options.specPath,
      outputDir: options.outputDir,
      generatorName: options.generator,
      ...options.config,
    });

    // Generate custom templates
    if (options.templates) {
      for (const template of options.templates) {
        await this.generator.generateTemplateFiles(template, options.outputDir);
        this.generator.createPackageJson(template, options.outputDir);
      }
    }

    // Post-processing
    if (options.postProcessing) {
      for (const step of options.postProcessing) {
        switch (step.type) {
          case 'format':
            await this.generator.formatCode(options.outputDir);
            break;
          case 'lint':
            await this.generator.lintCode(options.outputDir);
            break;
          case 'test':
            await this.generator.runTests(options.outputDir);
            break;
          case 'build':
            await this.generator.buildProject(options.outputDir);
            break;
        }
      }
    }

    console.log('Code generation completed successfully');
  }

  // Generate TypeScript client with custom configuration
  async generateTypeScriptClient(specPath: string, outputDir: string, config?: Partial<TypeScriptGeneratorConfig>): Promise<void> {
    await this.generator.generateTypeScriptClient({
      inputSpec: specPath,
      outputDir,
      generatorName: 'typescript-axios',
      ...config,
    });
  }

  // Generate TypeScript models with custom configuration
  async generateTypeScriptModels(specPath: string, outputDir: string, config?: Partial<TypeScriptGeneratorConfig>): Promise<void> {
    await this.generator.generateTypeScriptModels({
      inputSpec: specPath,
      outputDir,
      generatorName: 'typescript-models',
      ...config,
    });
  }

  // Get generator manager
  getGenerator(): OpenAPIGeneratorManager {
    return this.generator;
  }
}

// ===== EXAMPLE TEMPLATES =====

// Create React hooks template
function createReactHooksTemplate(): TemplateConfig {
  return {
    name: 'react-hooks',
    description: 'React hooks for API calls',
    files: [
      {
        path: 'src/hooks/useApi.ts',
        type: 'supporting',
        content: `
import { useState, useEffect } from 'react';
import { ApiClient } from '../api';

export function useApi<T>(apiCall: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiCall]);

  return { data, loading, error };
}
        `,
      },
      {
        path: 'src/hooks/useUsers.ts',
        type: 'api',
        content: `
import { useApi } from './useApi';
import { UserService } from '../api';

export function useUsers() {
  return useApi(() => UserService.getUsers());
}

export function useUser(id: string) {
  return useApi(() => UserService.getUserById(id));
}
        `,
      },
    ],
    dependencies: {
      react: '^18.0.0',
      'react-dom': '^18.0.0',
    },
    devDependencies: {
      '@types/react': '^18.0.0',
      '@types/react-dom': '^18.0.0',
    },
  };
}

// Create Vue composition API template
function createVueCompositionTemplate(): TemplateConfig {
  return {
    name: 'vue-composition',
    description: 'Vue Composition API for API calls',
    files: [
      {
        path: 'src/composables/useApi.ts',
        type: 'supporting',
        content: `
import { ref, computed } from 'vue';

export function useApi<T>(apiCall: () => Promise<T>) {
  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const execute = async () => {
    try {
      loading.value = true;
      const result = await apiCall();
      data.value = result;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    loading,
    error,
    execute,
  };
}
        `,
      },
      {
        path: 'src/composables/useUsers.ts',
        type: 'api',
        content: `
import { useApi } from './useApi';
import { UserService } from '../api';

export function useUsers() {
  const { data, loading, error, execute } = useApi(() => UserService.getUsers());
  
  return {
    users: data,
    loading,
    error,
    refresh: execute,
  };
}

export function useUser(id: string) {
  const { data, loading, error, execute } = useApi(() => UserService.getUserById(id));
  
  return {
    user: data,
    loading,
    error,
    refresh: execute,
  };
}
        `,
      },
    ],
    dependencies: {
      vue: '^3.0.0',
    },
    devDependencies: {
      '@vitejs/plugin-vue': '^3.0.0',
      'vue-tsc': '^1.0.0',
    },
  };
}

// ===== EXAMPLE USAGE =====

// Example: Generate TypeScript client
async function generateTypeScriptClientExample() {
  const service = new CodeGenerationService({
    inputSpec: './api-spec.yaml',
    outputDir: './generated-client',
    generatorName: 'typescript-axios',
  });

  await service.generateTypeScriptClient('./api-spec.yaml', './generated-client', {
    modelPropertyNaming: 'camelCase',
    enumValueNaming: 'PascalCase',
    serviceSuffix: 'Service',
    fileNaming: 'camelCase',
    withInterfaces: true,
    prettier: true,
    npmName: 'my-api-client',
    npmVersion: '1.0.0',
  });
}

// Example: Generate with custom templates
async function generateWithCustomTemplatesExample() {
  const service = new CodeGenerationService({
    inputSpec: './api-spec.yaml',
    outputDir: './generated-project',
    generatorName: 'typescript-axios',
  });

  await service.generateProject({
    specPath: './api-spec.yaml',
    outputDir: './generated-project',
    generator: 'typescript-axios',
    config: {
      modelPropertyNaming: 'camelCase',
      enumValueNaming: 'PascalCase',
      withInterfaces: true,
      prettier: true,
    },
    templates: [
      createReactHooksTemplate(),
      createVueCompositionTemplate(),
    ],
    postProcessing: [
      { type: 'format', command: 'prettier --write' },
      { type: 'lint', command: 'eslint --fix' },
      { type: 'test', command: 'npm test' },
      { type: 'build', command: 'npm run build' },
    ],
  });
}

// ===== EXERCISES =====

/*
EXERCISE 1: Create an OpenAPI Generator plugin system that:
- Supports custom code generators
- Provides template inheritance
- Implements plugin configuration
- Supports plugin distribution
- Is fully typed

EXERCISE 2: Build an OpenAPI Generator configuration system that:
- Supports environment-specific configurations
- Provides configuration validation
- Implements configuration templates
- Supports dynamic configuration loading
- Is fully typed

EXERCISE 3: Create an OpenAPI Generator testing framework that:
- Generates test cases from API specs
- Supports multiple testing frameworks
- Provides test data generation
- Implements test reporting
- Is fully typed

EXERCISE 4: Build an OpenAPI Generator documentation system that:
- Generates documentation from API specs
- Supports multiple documentation formats
- Provides interactive documentation
- Implements documentation customization
- Is fully typed

EXERCISE 5: Create an OpenAPI Generator CI/CD integration that:
- Supports automated code generation
- Provides deployment pipelines
- Implements version management
- Supports multi-environment deployments
- Is fully typed
*/

// Export classes and interfaces
export { OpenAPIGeneratorManager, CodeGenerationService };

// Export types
export type {
  GeneratorConfig,
  TypeScriptGeneratorConfig,
  TemplateConfig,
  CodeGenerationOptions,
};

// Export template creators
export { createReactHooksTemplate, createVueCompositionTemplate };