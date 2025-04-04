import { Octokit } from '@octokit/rest';

// GitHub repository interface
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  open_issues_count: number;
  topics: string[];
}

// Symbol tree item interface
export interface SymbolTreeItem {
  name: string;
  kind: string;
  path: string;
  line: number;
  children?: SymbolTreeItem[];
}

// File or directory item interface
export interface RepoContentItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  content?: string;
}

// GitHub user interface
export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

// Initialize Octokit with token from localStorage
let octokit: Octokit | null = null;

export function initializeOctokit(token?: string): void {
  const storedToken = token || localStorage.getItem('github_token');
  
  if (storedToken) {
    octokit = new Octokit({
      auth: storedToken
    });
  } else {
    octokit = new Octokit();
  }
}

// Validate GitHub token
export async function validateGitHubToken(token: string): Promise<boolean> {
  try {
    const tempOctokit = new Octokit({ auth: token });
    const { status } = await tempOctokit.rest.users.getAuthenticated();
    return status === 200;
  } catch (error) {
    console.error('Error validating GitHub token:', error);
    return false;
  }
}

// Get user profile
export async function getUserProfile(): Promise<GitHubUser | null> {
  if (!octokit) initializeOctokit();
  
  try {
    const { data } = await octokit!.rest.users.getAuthenticated();
    return {
      login: data.login,
      avatar_url: data.avatar_url,
      name: data.name || data.login,
      bio: data.bio || '',
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      html_url: data.html_url
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// Search repositories
export async function searchRepositories(
  query: string,
  sort: 'stars' | 'forks' | 'updated' = 'stars',
  order: 'asc' | 'desc' = 'desc',
  perPage: number = 10,
  page: number = 1
): Promise<GitHubRepo[]> {
  if (!octokit) initializeOctokit();
  
  try {
    const { data } = await octokit!.rest.search.repos({
      q: query,
      sort,
      order,
      per_page: perPage,
      page
    });
    
    return data.items as GitHubRepo[];
  } catch (error) {
    console.error('Error searching repositories:', error);
    return [];
  }
}

// Get repository details
export async function getRepoDetails(owner: string, repo: string): Promise<GitHubRepo | null> {
  if (!octokit) initializeOctokit();
  
  try {
    const { data } = await octokit!.rest.repos.get({
      owner,
      repo
    });
    
    return data as GitHubRepo;
  } catch (error) {
    console.error('Error fetching repository details:', error);
    return null;
  }
}

// Get repository README
export async function getReadme(owner: string, repo: string): Promise<string | null> {
  if (!octokit) initializeOctokit();
  
  try {
    const { data } = await octokit!.rest.repos.getReadme({
      owner,
      repo,
      mediaType: {
        format: 'html'
      }
    });
    
    return data as string;
  } catch (error) {
    console.error('Error fetching README:', error);
    return null;
  }
}

// Get repository contents
export async function getRepoContents(
  owner: string,
  repo: string,
  path: string,
  getContent: boolean = false
): Promise<RepoContentItem[] | string> {
  if (!octokit) initializeOctokit();
  
  try {
    const { data } = await octokit!.rest.repos.getContent({
      owner,
      repo,
      path
    });
    
    if (Array.isArray(data)) {
      return data.map(item => ({
        name: item.name,
        path: item.path,
        type: item.type as 'file' | 'dir',
        size: item.size
      }));
    } else if (getContent) {
      // For a single file when content is requested
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return content;
    } else {
      // For a single file when content is not requested
      return [{
        name: data.name,
        path: data.path,
        type: data.type as 'file' | 'dir',
        size: data.size
      }];
    }
  } catch (error) {
    console.error('Error fetching repository contents:', error);
    return [];
  }
}

// Get symbol tree (mock implementation)
export async function getSymbolTree(owner: string, repo: string): Promise<SymbolTreeItem[]> {
  // This is a mock implementation
  // In a real application, you would use a code analysis service or GitHub's API
  return [
    {
      name: 'App',
      kind: 'class',
      path: 'src/App.tsx',
      line: 10,
      children: [
        {
          name: 'render',
          kind: 'function',
          path: 'src/App.tsx',
          line: 15,
          children: []
        }
      ]
    },
    {
      name: 'utils',
      kind: 'namespace',
      path: 'src/utils',
      line: 1,
      children: [
        {
          name: 'formatDate',
          kind: 'function',
          path: 'src/utils/date.ts',
          line: 5,
          children: []
        },
        {
          name: 'parseJSON',
          kind: 'function',
          path: 'src/utils/json.ts',
          line: 8,
          children: []
        }
      ]
    }
  ];
}

// Get trending repositories
export async function getTrendingRepositories(
  language: string = '',
  since: 'daily' | 'weekly' | 'monthly' = 'weekly',
  limit: number = 10
): Promise<GitHubRepo[]> {
  if (!octokit) initializeOctokit();
  
  // Calculate date range based on 'since' parameter
  const now = new Date();
  let daysAgo;
  
  switch (since) {
    case 'daily':
      daysAgo = 1;
      break;
    case 'monthly':
      daysAgo = 30;
      break;
    case 'weekly':
    default:
      daysAgo = 7;
      break;
  }
  
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  const dateString = date.toISOString().split('T')[0];
  
  // Build query
  let query = `created:>${dateString}`;
  if (language) {
    query += ` language:${language}`;
  }
  
  try {
    const { data } = await octokit!.rest.search.repos({
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: limit
    });
    
    return data.items as GitHubRepo[];
  } catch (error) {
    console.error('Error fetching trending repositories:', error);
    return [];
  }
}

// Get related repositories
export async function getRelatedRepositories(
  repo: GitHubRepo,
  limit: number = 5
): Promise<GitHubRepo[]> {
  if (!octokit) initializeOctokit();
  
  // Build query based on repository topics, language, and name
  let query = '';
  
  if (repo.topics && repo.topics.length > 0) {
    // Use up to 3 topics
    const topics = repo.topics.slice(0, 3);
    query += topics.map(topic => `topic:${topic}`).join(' ');
  }
  
  if (repo.language) {
    query += ` language:${repo.language}`;
  }
  
  // Exclude the current repository
  query += ` NOT repo:${repo.full_name}`;
  
  try {
    const { data } = await octokit!.rest.search.repos({
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: limit
    });
    
    return data.items as GitHubRepo[];
  } catch (error) {
    console.error('Error fetching related repositories:', error);
    return [];
  }
}