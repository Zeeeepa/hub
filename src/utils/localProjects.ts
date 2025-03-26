import { v4 as uuidv4 } from 'uuid';

export interface LocalProject {
  id: string;
  name: string;
  path: string;
  description?: string;
  language?: string;
  keywords?: string[];
  topics?: string[];
  lastModified?: string;
  stats?: {
    files: number;
    loc: number;
    size: number;
  };
  analyzed?: boolean;
  analysis?: ProjectAnalysis;
}

export interface ProjectAnalysis {
  summary: string;
  architecture: {
    components: Component[];
    dependencies: Dependency[];
  };
  codeQuality: {
    score: number;
    issues: CodeIssue[];
  };
  semanticIndex: {
    indexed: boolean;
    lastUpdated?: string;
  };
}

export interface Component {
  name: string;
  path: string;
  description: string;
  type: 'module' | 'class' | 'function' | 'service' | 'utility';
  dependencies: string[];
}

export interface Dependency {
  name: string;
  version: string;
  type: 'direct' | 'dev' | 'peer' | 'optional';
}

export interface CodeIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  file: string;
  line: number;
  column: number;
}

export interface CodeSearchResult {
  fileName: string;
  filePath: string;
  lineStart: number;
  lineEnd: number;
  snippet: string;
  content: string;
  relevanceScore?: number;
}

// Mock data for local projects
const MOCK_PROJECTS: LocalProject[] = [
  {
    id: uuidv4(),
    name: 'mcp-aas',
    path: '/Users/dev/projects/mcp-aas',
    description: 'MCP as a Service - Code analysis and understanding platform',
    language: 'TypeScript',
    keywords: ['mcp', 'code-analysis', 'ai', 'semantic-search'],
    topics: ['ai', 'code-analysis', 'semantic-search'],
    lastModified: new Date().toISOString(),
    stats: {
      files: 156,
      loc: 12450,
      size: 4500000
    },
    analyzed: true,
    analysis: {
      summary: 'MCP-AAS is a code analysis platform that provides semantic understanding of codebases.',
      architecture: {
        components: [
          {
            name: 'CodeIndexer',
            path: 'src/indexer',
            description: 'Indexes code for semantic search',
            type: 'module',
            dependencies: ['SemanticModel', 'FileSystem']
          },
          {
            name: 'SemanticModel',
            path: 'src/models',
            description: 'AI model for code understanding',
            type: 'service',
            dependencies: ['TensorFlow', 'CodeEmbeddings']
          }
        ],
        dependencies: [
          {
            name: 'typescript',
            version: '4.9.5',
            type: 'direct'
          },
          {
            name: 'react',
            version: '18.2.0',
            type: 'direct'
          }
        ]
      },
      codeQuality: {
        score: 0.87,
        issues: [
          {
            type: 'warning',
            message: 'Unused variable',
            file: 'src/indexer/main.ts',
            line: 45,
            column: 10
          }
        ]
      },
      semanticIndex: {
        indexed: true,
        lastUpdated: new Date().toISOString()
      }
    }
  },
  {
    id: uuidv4(),
    name: 'project-explorer',
    path: '/Users/dev/projects/project-explorer',
    description: 'A tool for exploring and visualizing project structures',
    language: 'JavaScript',
    keywords: ['visualization', 'project-management', 'explorer'],
    topics: ['visualization', 'developer-tools'],
    lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    stats: {
      files: 78,
      loc: 5230,
      size: 2100000
    }
  },
  {
    id: uuidv4(),
    name: 'code-analyzer',
    path: '/Users/dev/projects/code-analyzer',
    description: 'Static code analysis tool for JavaScript and TypeScript',
    language: 'TypeScript',
    keywords: ['static-analysis', 'linting', 'code-quality'],
    topics: ['developer-tools', 'static-analysis'],
    lastModified: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    stats: {
      files: 112,
      loc: 8760,
      size: 3200000
    }
  }
];

// Function to index local projects
export const indexLocalProjects = async (): Promise<LocalProject[]> => {
  // In a real implementation, this would scan the file system
  // For now, we'll return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PROJECTS);
    }, 1000);
  });
};

// Function to search local projects
export const searchLocalProjects = async (
  query: string,
  keywords: string[] = []
): Promise<LocalProject[]> => {
  // In a real implementation, this would search the indexed projects
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalizedQuery = query.toLowerCase();
      const results = MOCK_PROJECTS.filter(project => {
        // Match by name or description
        const nameMatch = project.name.toLowerCase().includes(normalizedQuery);
        const descMatch = project.description?.toLowerCase().includes(normalizedQuery);
        
        // Match by keywords/topics if provided
        const keywordMatch = keywords.length === 0 || 
          keywords.some(k => 
            project.keywords?.includes(k) || 
            project.topics?.includes(k)
          );
        
        return (query === '' || nameMatch || descMatch) && keywordMatch;
      });
      
      resolve(results);
    }, 800);
  });
};

// Function to get project details
export const getLocalProjectDetails = async (projectPath: string): Promise<Partial<LocalProject>> => {
  // In a real implementation, this would analyze the project at the given path
  return new Promise((resolve) => {
    setTimeout(() => {
      // Find the project in our mock data
      const project = MOCK_PROJECTS.find(p => p.path === projectPath);
      
      if (project) {
        // Return additional details that might not be in the initial index
        resolve({
          stats: project.stats,
          analysis: project.analysis
        });
      } else {
        // Return some default stats
        resolve({
          stats: {
            files: Math.floor(Math.random() * 200) + 50,
            loc: Math.floor(Math.random() * 10000) + 1000,
            size: Math.floor(Math.random() * 5000000) + 1000000
          }
        });
      }
    }, 1200);
  });
};

// Function to analyze a project with MCP
export const analyzeProjectWithMcp = async (projectPath: string): Promise<ProjectAnalysis> => {
  // In a real implementation, this would call the MCP-AAS API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a mock analysis
      const analysis: ProjectAnalysis = {
        summary: 'This project appears to be a web application built with modern JavaScript frameworks.',
        architecture: {
          components: [
            {
              name: 'Frontend',
              path: 'src/components',
              description: 'React components for the UI',
              type: 'module',
              dependencies: ['React', 'Redux']
            },
            {
              name: 'API Client',
              path: 'src/api',
              description: 'Client for backend API communication',
              type: 'service',
              dependencies: ['Axios', 'Backend']
            }
          ],
          dependencies: [
            {
              name: 'react',
              version: '18.2.0',
              type: 'direct'
            },
            {
              name: 'typescript',
              version: '4.9.5',
              type: 'direct'
            },
            {
              name: 'jest',
              version: '29.5.0',
              type: 'dev'
            }
          ]
        },
        codeQuality: {
          score: 0.75 + Math.random() * 0.2,
          issues: [
            {
              type: 'warning',
              message: 'Unused variable',
              file: 'src/components/App.tsx',
              line: 45,
              column: 10
            },
            {
              type: 'info',
              message: 'Consider using a more specific type',
              file: 'src/api/client.ts',
              line: 23,
              column: 15
            }
          ]
        },
        semanticIndex: {
          indexed: true,
          lastUpdated: new Date().toISOString()
        }
      };
      
      resolve(analysis);
    }, 3000);
  });
};

// Function to search code semantically
export const searchCodeSemantically = async (
  query: string,
  projectPath?: string,
  semantic: boolean = true
): Promise<CodeSearchResult[]> => {
  // In a real implementation, this would use the MCP semantic search API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock code search results
      const results: CodeSearchResult[] = [
        {
          fileName: 'IndexService.ts',
          filePath: projectPath ? `${projectPath}/src/services/IndexService.ts` : '/Users/dev/projects/mcp-aas/src/services/IndexService.ts',
          lineStart: 45,
          lineEnd: 60,
          snippet: `export async function indexCodebase(path: string): Promise<IndexResult> {
  const files = await getSourceFiles(path);
  const tokens = await tokenizeFiles(files);
  return buildSemanticIndex(tokens);
}`,
          content: `import { getSourceFiles } from '../utils/fileSystem';
import { tokenizeFiles } from '../utils/parser';
import { buildSemanticIndex } from '../models/semanticIndex';
import { IndexResult } from '../types';

/**
 * Indexes a codebase for semantic search
 * @param path Path to the codebase root
 * @returns IndexResult with statistics and status
 */
export async function indexCodebase(path: string): Promise<IndexResult> {
  const files = await getSourceFiles(path);
  const tokens = await tokenizeFiles(files);
  return buildSemanticIndex(tokens);
}

/**
 * Searches the semantic index for relevant code
 * @param query Search query in natural language
 * @returns Array of search results with relevance scores
 */
export async function searchIndex(query: string): Promise<SearchResult[]> {
  const embedding = await getQueryEmbedding(query);
  const results = await findSimilarEmbeddings(embedding);
  return results.map(formatSearchResult);
}`,
          relevanceScore: 0.92
        },
        {
          fileName: 'semanticIndex.ts',
          filePath: projectPath ? `${projectPath}/src/models/semanticIndex.ts` : '/Users/dev/projects/mcp-aas/src/models/semanticIndex.ts',
          lineStart: 12,
          lineEnd: 25,
          snippet: `export async function buildSemanticIndex(tokens: Token[]): Promise<IndexResult> {
  const embeddings = await getEmbeddings(tokens);
  const index = new VectorIndex();
  
  for (const embedding of embeddings) {
    index.add(embedding);
  }
  
  return {
    size: embeddings.length,
    status: 'success'
  };
}`,
          content: `import { Token } from '../types';
import { VectorIndex } from './vectorIndex';
import { getEmbeddings } from './embeddings';
import { IndexResult } from '../types';

/**
 * Builds a semantic index from tokenized code
 * @param tokens Array of code tokens
 * @returns IndexResult with statistics
 */
export async function buildSemanticIndex(tokens: Token[]): Promise<IndexResult> {
  const embeddings = await getEmbeddings(tokens);
  const index = new VectorIndex();
  
  for (const embedding of embeddings) {
    index.add(embedding);
  }
  
  return {
    size: embeddings.length,
    status: 'success'
  };
}

/**
 * Finds similar embeddings in the vector index
 * @param embedding Query embedding
 * @returns Array of similar embeddings with scores
 */
export async function findSimilarEmbeddings(embedding: number[]): Promise<SimilarityResult[]> {
  const index = await loadIndex();
  return index.search(embedding, 10);
}`,
          relevanceScore: 0.85
        },
        {
          fileName: 'SearchService.ts',
          filePath: projectPath ? `${projectPath}/src/services/SearchService.ts` : '/Users/dev/projects/mcp-aas/src/services/SearchService.ts',
          lineStart: 18,
          lineEnd: 30,
          snippet: `export async function semanticCodeSearch(query: string): Promise<SearchResult[]> {
  // Convert query to embedding
  const embedding = await getQueryEmbedding(query);
  
  // Search the vector index
  const results = await findSimilarEmbeddings(embedding);
  
  // Format and return results
  return results.map(formatSearchResult);
}`,
          content: `import { getQueryEmbedding } from '../models/embeddings';
import { findSimilarEmbeddings } from '../models/semanticIndex';
import { formatSearchResult } from '../utils/formatter';
import { SearchResult, SimilarityResult } from '../types';

/**
 * Performs a semantic search over the codebase
 * @param query Natural language query
 * @returns Array of search results sorted by relevance
 */
export async function semanticCodeSearch(query: string): Promise<SearchResult[]> {
  // Convert query to embedding
  const embedding = await getQueryEmbedding(query);
  
  // Search the vector index
  const results = await findSimilarEmbeddings(embedding);
  
  // Format and return results
  return results.map(formatSearchResult);
}

/**
 * Performs a keyword-based search over the codebase
 * @param keywords Keywords to search for
 * @returns Array of search results
 */
export async function keywordCodeSearch(keywords: string[]): Promise<SearchResult[]> {
  // Use regex or other text-based search
  const results = await searchCodeByKeywords(keywords);
  
  // Format and return results
  return results.map(formatSearchResult);
}`,
          relevanceScore: 0.78
        }
      ];
      
      resolve(results);
    }, 1500);
  });
};