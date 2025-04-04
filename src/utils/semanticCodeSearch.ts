import { Octokit } from 'octokit';
import { getGitHubToken } from './store';

// Enhanced GitHubRepo type to handle null fields
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  // Add other necessary properties
}

export interface CodeSearchResult {
  repo: GitHubRepo;
  file: {
    name: string;
    path: string;
    url: string;
    content?: string;
  };
  matches: {
    line: number;
    content: string;
  }[];
  score: number;
  fileName?: string;
  filePath?: string;
  snippet?: string;
  relevanceScore?: number;
  lineStart?: number;
  lineEnd?: number;
  content?: string;
}

export interface FunctionalitySearchResult {
  repo: GitHubRepo;
  matchScore: number;
  matchReason: string;
  relevantFiles?: {
    path: string;
    url: string;
    relevance: string;
  }[];
}

// Initialize Octokit
let octokit: Octokit;

export const initializeOctokit = () => {
  const token = getGitHubToken();
  octokit = new Octokit({
    auth: token
  });
};

// Initialize on load
initializeOctokit();

// Search for code across GitHub repositories
export const searchCode = async (
  query: string,
  language?: string,
  fileExtension?: string,
  organization?: string
): Promise<CodeSearchResult[]> => {
  // This is a simplified stub implementation
  console.log(`Searching code with query: ${query}, language: ${language || 'any'}`);
  return [];
};

// Semantic code search function required by the component
export const searchCodeSemantically = async (
  query: string,
  projectPath?: string,
  isSemanticSearch: boolean = true
): Promise<CodeSearchResult[]> => {
  try {
    if (projectPath) {
      // Local project search logic would go here
      // Since this is a stub implementation, we'll return an empty array for now
      console.log(`Searching in local project: ${projectPath}`);
      return [];
    } else {
      // Use GitHub search as fallback
      const language = detectLanguageFromQuery(query);
      const results = await searchCode(query, language);
      
      // Transform the results to match the expected format in the component
      return results.map(result => ({
        ...result,
        fileName: result.file.name,
        filePath: result.file.path,
        snippet: extractSnippet(result),
        relevanceScore: isSemanticSearch ? calculateSemanticRelevance(result, query) : undefined
      }));
    }
  } catch (error) {
    console.error('Error in semantic code search:', error);
    return [];
  }
};

// Helper function to extract a relevant snippet from the search result
const extractSnippet = (result: CodeSearchResult): string => {
  if (!result.file.content || result.matches.length === 0) {
    return '';
  }
  
  // Get the first match as the snippet
  const firstMatch = result.matches[0];
  const lines = result.file.content.split('\n');
  
  // Get a few lines before and after the match for context
  const startLine = Math.max(0, firstMatch.line - 3);
  const endLine = Math.min(lines.length - 1, firstMatch.line + 2);
  
  return lines.slice(startLine, endLine + 1).join('\n');
};

// Helper function to detect potential programming language from the query
const detectLanguageFromQuery = (query: string): string | undefined => {
  const languageKeywords: Record<string, string[]> = {
    'javascript': ['js', 'javascript', 'react', 'node', 'npm', 'express'],
    'typescript': ['ts', 'typescript', 'angular', 'nextjs'],
    'python': ['py', 'python', 'django', 'flask', 'numpy', 'pandas'],
    'java': ['java', 'spring', 'gradle', 'maven'],
    'go': ['go', 'golang'],
    'rust': ['rs', 'rust', 'cargo'],
  };
  
  const lowerQuery = query.toLowerCase();
  for (const [language, keywords] of Object.entries(languageKeywords)) {
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      return language;
    }
  }
  
  return undefined;
};

// Helper function to calculate semantic relevance score
const calculateSemanticRelevance = (result: CodeSearchResult, query: string): number => {
  // This would ideally use embeddings or other NLP techniques
  // For now, implement a simple relevance score based on term frequency
  const queryTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
  let matches = 0;
  
  // Count matches in the file content
  if (result.file.content) {
    const content = result.file.content.toLowerCase();
    queryTerms.forEach(term => {
      const count = (content.match(new RegExp(term, 'g')) || []).length;
      matches += count;
    });
  }
  
  // Normalize score between 0 and 1
  const baseScore = Math.min(1, matches / (queryTerms.length * 5));
  
  // Apply a boost based on the repo score
  const repoBoost = Math.min(0.3, Math.log10(result.repo.stargazers_count + 1) / 10);
  
  return baseScore + repoBoost;
};

// Search for repositories by functionality description
export const searchByFunctionality = async (
  functionality: string,
  language?: string,
  minStars?: number
): Promise<FunctionalitySearchResult[]> => {
  if (!octokit) return [];
  
  try {
    // Extract key terms from functionality description
    const keyTerms = extractKeyTerms(functionality);
    
    // Build search query
    let searchQuery = keyTerms.join(' OR ');
    
    if (language) {
      searchQuery += ` language:${language}`;
    }
    
    if (minStars && minStars > 0) {
      searchQuery += ` stars:>=${minStars}`;
    }
    
    // Search repositories
    const response = await octokit.request('GET /search/repositories', {
      q: searchQuery,
      sort: 'stars',
      order: 'desc',
      per_page: 30,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    
    // Process results
    const results: FunctionalitySearchResult[] = [];
    
    for (const repo of response.data.items) {
      // Calculate match score
      const matchScore = calculateFunctionalityMatchScore(repo, functionality, keyTerms);
      
      // Generate match reason
      const matchReason = generateMatchReason(repo, functionality, keyTerms);
      
      results.push({
        repo,
        matchScore,
        matchReason
      });
    }
    
    // Sort by match score
    return results.sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    console.error('Error searching by functionality:', error);
    return [];
  }
};

// Extract key terms from functionality description
const extractKeyTerms = (functionality: string): string[] => {
  // In a real implementation, this would use NLP techniques
  // For now, we'll just split by spaces and filter out common words
  const commonWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'for', 'with', 'in', 'on', 'at', 'to', 'from',
    'of', 'by', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
    'had', 'do', 'does', 'did', 'can', 'could', 'will', 'would', 'should', 'shall', 'may',
    'might', 'must', 'that', 'which', 'who', 'whom', 'whose', 'what', 'where', 'when',
    'why', 'how', 'this', 'these', 'those', 'it', 'its', 'it\'s', 'they', 'them', 'their',
    'theirs', 'we', 'us', 'our', 'ours', 'you', 'your', 'yours', 'he', 'him', 'his', 'she',
    'her', 'hers'
  ]);
  
  return functionality
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .filter(word => word.length > 2 && !commonWords.has(word));
};

// Calculate match score for functionality search
const calculateFunctionalityMatchScore = (
  repo: GitHubRepo,
  functionality: string,
  keyTerms: string[]
): number => {
  let score = 0;
  
  // Check description
  if (repo.description) {
    const lowerDescription = repo.description.toLowerCase();
    keyTerms.forEach(term => {
      if (lowerDescription.includes(term)) {
        score += 2;
      }
    });
    
    // Bonus for exact phrase match
    if (lowerDescription.includes(functionality.toLowerCase())) {
      score += 10;
    }
  }
  
  // Check topics
  if (repo.topics && repo.topics.length > 0) {
    const lowerTopics = repo.topics.map(t => t.toLowerCase());
    keyTerms.forEach(term => {
      if (lowerTopics.some(topic => topic.includes(term))) {
        score += 3;
      }
    });
  }
  
  // Add score based on repository metrics
  score += Math.log10(repo.stargazers_count + 1) * 0.5;
  score += Math.log10(repo.forks_count + 1) * 0.3;
  
  return score;
};

// Generate match reason for functionality search
const generateMatchReason = (
  repo: GitHubRepo,
  functionality: string,
  keyTerms: string[]
): string => {
  const reasons: string[] = [];
  
  // Check description
  if (repo.description) {
    const lowerDescription = repo.description.toLowerCase();
    const matchedTerms = keyTerms.filter(term => lowerDescription.includes(term));
    
    if (matchedTerms.length > 0) {
      reasons.push(`Repository description contains key terms: ${matchedTerms.join(', ')}`);
    }
    
    if (lowerDescription.includes(functionality.toLowerCase())) {
      reasons.push('Repository description closely matches the functionality description');
    }
  }
  
  // Check topics
  if (repo.topics && repo.topics.length > 0) {
    const lowerTopics = repo.topics.map(t => t.toLowerCase());
    const matchedTopics = repo.topics.filter(topic => 
      keyTerms.some(term => topic.toLowerCase().includes(term))
    );
    
    if (matchedTopics.length > 0) {
      reasons.push(`Repository has relevant topics: ${matchedTopics.join(', ')}`);
    }
  }
  
  // Add repository metrics
  reasons.push(`Repository has ${repo.stargazers_count} stars and ${repo.forks_count} forks`);
  
  return reasons.join('. ');
};

// Get relevant files for a repository based on functionality
export const getRelevantFiles = async (
  owner: string,
  repo: string,
  functionality: string
): Promise<{ path: string; url: string; relevance: string }[]> => {
  if (!octokit) return [];
  
  try {
    // Extract key terms from functionality description
    const keyTerms = extractKeyTerms(functionality);
    
    // Build search query for code search
    const searchQuery = `${keyTerms.join(' OR ')} repo:${owner}/${repo}`;
    
    // Search code
    const response = await octokit.request('GET /search/code', {
      q: searchQuery,
      per_page: 10,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    
    // Process results
    return response.data.items.map(item => ({
      path: item.path,
      url: item.html_url,
      relevance: `Contains key terms related to ${functionality}`
    }));
  } catch (error) {
    console.error('Error getting relevant files:', error);
    return [];
  }
};