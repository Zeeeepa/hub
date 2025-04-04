// Interface for code search results
export interface CodeSearchResult {
  filePath: string;
  fileName: string;
  language: string;
  snippet: string;
  lineStart: number;
  lineEnd: number;
  score: number;
  matchedQuery: string;
}

// Mock function to simulate semantic code search
export async function searchCodeSemantically(
  query: string,
  projectPath?: string,
  semantic: boolean = true
): Promise<CodeSearchResult[]> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock results based on query
  const results: CodeSearchResult[] = [];
  
  // Generate some mock results based on the query
  if (query.toLowerCase().includes('react')) {
    results.push({
      filePath: 'src/components/App.tsx',
      fileName: 'App.tsx',
      language: 'typescript',
      snippet: `import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './ThemeContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <ThemeProvider>
      <div className="app">
        {isLoading ? <LoadingSpinner /> : <MainContent />}
      </div>
    </ThemeProvider>
  );
}`,
      lineStart: 3,
      lineEnd: 21,
      score: 0.92,
      matchedQuery: 'react component'
    });
  }
  
  if (query.toLowerCase().includes('api') || query.toLowerCase().includes('fetch')) {
    results.push({
      filePath: 'src/services/api.ts',
      fileName: 'api.ts',
      language: 'typescript',
      snippet: `import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

export async function fetchData<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await axios.get(\`\${API_BASE_URL}/\${endpoint}\`, options);
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export async function postData<T, R>(endpoint: string, data: T): Promise<R> {
  try {
    const response = await axios.post(\`\${API_BASE_URL}/\${endpoint}\`, data);
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}`,
      lineStart: 1,
      lineEnd: 22,
      score: 0.88,
      matchedQuery: 'api fetch'
    });
  }
  
  if (query.toLowerCase().includes('github')) {
    results.push({
      filePath: 'src/services/github.ts',
      fileName: 'github.ts',
      language: 'typescript',
      snippet: `import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

export async function searchRepositories(query: string, page = 1, perPage = 10) {
  try {
    const response = await octokit.search.repos({
      q: query,
      page,
      per_page: perPage,
      sort: 'stars',
      order: 'desc'
    });
    
    return {
      items: response.data.items,
      totalCount: response.data.total_count
    };
  } catch (error) {
    console.error('GitHub search failed:', error);
    throw error;
  }
}`,
      lineStart: 1,
      lineEnd: 22,
      score: 0.95,
      matchedQuery: 'github api'
    });
  }
  
  if (query.toLowerCase().includes('component') || query.toLowerCase().includes('button')) {
    results.push({
      filePath: 'src/components/Button.tsx',
      fileName: 'Button.tsx',
      language: 'typescript',
      snippet: `import React from 'react';
import classNames from 'classnames';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  children,
  className,
  ...rest
}) => {
  const baseClasses = 'rounded font-medium focus:outline-none transition-colors';
  
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };
  
  const sizeClasses = {
    small: 'py-1 px-2 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg'
  };
  
  const buttonClasses = classNames(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabled && 'opacity-50 cursor-not-allowed',
    className
  );
  
  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;`,
      lineStart: 1,
      lineEnd: 53,
      score: 0.89,
      matchedQuery: 'button component'
    });
  }
  
  // Add more mock results based on common queries
  if (results.length === 0) {
    // Default result if no specific matches
    results.push({
      filePath: 'src/utils/helpers.ts',
      fileName: 'helpers.ts',
      language: 'typescript',
      snippet: `/**
 * Collection of helper functions
 */

/**
 * Format a date string to a human-readable format
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Safely parse JSON with error handling
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return fallback;
  }
}

/**
 * Debounce a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`,
      lineStart: 1,
      lineEnd: 42,
      score: 0.75,
      matchedQuery: query
    });
  }
  
  // Sort results by score
  return results.sort((a, b) => b.score - a.score);
}

// Function to get language from file extension
export function getLanguageFromExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  
  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    tsx: 'tsx',
    py: 'python',
    rb: 'ruby',
    java: 'java',
    go: 'go',
    rs: 'rust',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    php: 'php',
    html: 'html',
    css: 'css',
    scss: 'scss',
    json: 'json',
    md: 'markdown',
    yml: 'yaml',
    yaml: 'yaml',
    sh: 'bash',
    bash: 'bash',
    txt: 'text'
  };
  
  return languageMap[ext] || 'text';
}

// Enhanced semantic search with code understanding capabilities
export async function searchCodeWithContext(
  query: string,
  projectPath?: string
): Promise<CodeSearchResult[]> {
  // This would be implemented with a real semantic search engine
  // For now, we'll just return the same mock results
  return searchCodeSemantically(query, projectPath, true);
}

// Function to search for code patterns (regex-based search)
export async function searchCodePatterns(
  pattern: string,
  projectPath?: string
): Promise<CodeSearchResult[]> {
  // This would be implemented with a real regex search engine
  // For now, we'll just return the same mock results but with lower scores
  const results = await searchCodeSemantically(pattern, projectPath, false);
  return results.map(result => ({
    ...result,
    score: result.score * 0.8 // Lower score for pattern matching vs semantic
  }));
}