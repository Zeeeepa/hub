// Interface for code search results
export interface CodeSearchResult {
  path: string;
  content: string;
  language: string;
  lineStart: number;
  lineEnd: number;
  score: number;
  repository?: string;
  matches?: {
    line: number;
    content: string;
  }[];
}

// Mock data for semantic code search
const mockResults: CodeSearchResult[] = [
  {
    path: 'src/components/Button.tsx',
    content: `import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  children
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-800';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  return (
    <button
      className={`rounded-md font-medium transition-colors ${getVariantClasses()} ${getSizeClasses()} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;`,
    language: 'typescript',
    lineStart: 1,
    lineEnd: 53,
    score: 0.95,
    matches: [
      {
        line: 3,
        content: 'interface ButtonProps {'
      },
      {
        line: 10,
        content: 'const Button: React.FC<ButtonProps> = ({'
      }
    ]
  },
  {
    path: 'src/utils/api.ts',
    content: `import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;`,
    language: 'typescript',
    lineStart: 1,
    lineEnd: 35,
    score: 0.89,
    matches: [
      {
        line: 6,
        content: 'const api = axios.create({'
      },
      {
        line: 14,
        content: 'api.interceptors.request.use('
      }
    ]
  },
  {
    path: 'src/hooks/useLocalStorage.ts',
    content: `import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = (): T => {
    // Prevent build error "window is undefined" but keep working
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  };

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save to state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(\`Error setting localStorage key "\${key}":\`, error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        setStoredValue(JSON.parse(event.newValue));
      }
    };

    // Listen for changes to this localStorage key in other tabs/windows
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;`,
    language: 'typescript',
    lineStart: 1,
    lineEnd: 60,
    score: 0.85,
    matches: [
      {
        line: 3,
        content: 'function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {'
      },
      {
        line: 22,
        content: 'const [storedValue, setStoredValue] = useState<T>(readValue);'
      }
    ]
  }
];

/**
 * Search code semantically using a natural language query
 * @param query The search query in natural language
 * @param projectPath Optional path to limit search to a specific project
 * @param semantic Whether to use semantic search (true) or keyword search (false)
 * @returns Array of code search results
 */
export async function searchCodeSemantically(
  query: string,
  projectPath?: string,
  semantic: boolean = true
): Promise<CodeSearchResult[]> {
  // This is a mock implementation
  // In a real application, you would call a semantic code search API
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock results
  return mockResults.map(result => ({
    ...result,
    // Add repository info if projectPath is provided
    repository: projectPath || 'example/repo'
  }));
}

/**
 * Get supported languages for code search
 * @returns Array of supported languages
 */
export function getSupportedLanguages(): string[] {
  return [
    'javascript',
    'typescript',
    'python',
    'java',
    'go',
    'rust',
    'c',
    'cpp',
    'csharp',
    'ruby',
    'php',
    'swift',
    'kotlin'
  ];
}

/**
 * Get file extension from language
 * @param language Programming language
 * @returns File extension (without dot)
 */
export function getFileExtensionFromLanguage(language: string): string {
  const extensionMap: Record<string, string> = {
    javascript: 'js',
    typescript: 'ts',
    python: 'py',
    java: 'java',
    go: 'go',
    rust: 'rs',
    c: 'c',
    cpp: 'cpp',
    csharp: 'cs',
    ruby: 'rb',
    php: 'php',
    swift: 'swift',
    kotlin: 'kt'
  };
  
  return extensionMap[language.toLowerCase()] || '';
}

/**
 * Get language from file extension
 * @param extension File extension (without dot)
 * @returns Programming language
 */
export function getLanguageFromFileExtension(extension: string): string {
  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    java: 'java',
    go: 'go',
    rs: 'rust',
    c: 'c',
    cpp: 'cpp',
    cs: 'csharp',
    rb: 'ruby',
    php: 'php',
    swift: 'swift',
    kt: 'kotlin'
  };
  
  return languageMap[extension.toLowerCase()] || 'plaintext';
}