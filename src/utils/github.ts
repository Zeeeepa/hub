import { Octokit } from 'octokit';
import { getGitHubToken } from './store';

let octokit: Octokit;

export const initializeOctokit = () => {
  const token = getGitHubToken();
  octokit = new Octokit({
    auth: token
  });
};

// Initialize on load
initializeOctokit();

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string;
  owner: {
    avatar_url: string;
    login: string;
  };
  created_at: string;
  updated_at: string;
  topics?: string[];
  license?: {
    name: string;
    spdx_id: string;
  };
  size?: number;
  default_branch?: string;
  homepage?: string;
}

export interface RepoDetails {
  languages: Record<string, number>;
  contributors: number;
  branches: number;
  commits: number;
  readme?: string;
  topics: string[];
  pullRequests: number;
  lastRelease?: {
    name: string;
    published_at: string;
    html_url: string;
  };
  relatedRepos?: GitHubRepo[];
  dependents?: GitHubRepo[];
  codeExamples?: {
    title: string;
    url: string;
    code: string;
    language: string;
  }[];
}

export interface RepoContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: 'file' | 'dir';
  content?: string;
  encoding?: string;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name?: string;
  bio?: string;
  public_repos: number;
  followers: number;
  following: number;
}

export const searchRepositories = async (query: string): Promise<GitHubRepo[]> => {
  if (!octokit) return [];
  
  try {
    const response = await octokit.request('GET /search/repositories', {
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: 30,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return response.data.items;
  } catch (error) {
    console.error('Error searching repositories:', error);
    return [];
  }
};

export const getTrendingRepositories = async (
  language: string = '',
  since: 'daily' | 'weekly' | 'monthly' = 'daily'
): Promise<GitHubRepo[]> => {
  if (!octokit) return [];

  try {
    const date = new Date();
    if (since === 'weekly') {
      date.setDate(date.getDate() - 7);
    } else if (since === 'monthly') {
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setDate(date.getDate() - 1);
    }

    const dateString = date.toISOString().split('T')[0];
    
    const query = `created:>${dateString} ${language ? `language:${language}` : ''}`;
    
    const response = await octokit.request('GET /search/repositories', {
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: 30,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return response.data.items;
  } catch (error) {
    console.error('Error fetching trending repositories:', error);
    return [];
  }
};

export const getRecommendedRepositories = async (
  topics: string[] = [],
  language: string = ''
): Promise<GitHubRepo[]> => {
  if (!octokit) return [];

  try {
    const topicsQuery = topics.map(topic => `topic:${topic}`).join(' ');
    const query = `${topicsQuery} ${language ? `language:${language}` : ''} stars:>100`;
    
    const response = await octokit.request('GET /search/repositories', {
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: 30,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return response.data.items;
  } catch (error) {
    console.error('Error fetching recommended repositories:', error);
    return [];
  }
};

export const getTopicRepositories = async (topic: string): Promise<GitHubRepo[]> => {
  if (!octokit) return [];

  try {
    const response = await octokit.request('GET /search/repositories', {
      q: `topic:${topic}`,
      sort: 'stars',
      order: 'desc',
      per_page: 30,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return response.data.items;
  } catch (error) {
    console.error('Error fetching topic repositories:', error);
    return [];
  }
};

export const getPopularTopics = async (): Promise<string[]> => {
  // GitHub doesn't have a direct API for popular topics, so we'll use a curated list
  return [
    'machine-learning',
    'react',
    'typescript',
    'python',
    'javascript',
    'ai',
    'web-development',
    'data-science',
    'blockchain',
    'mobile-app',
    'game-development',
    'devops',
    'cloud',
    'backend',
    'frontend',
    'llm',
    'agents',
    'rag',
    'vector-database',
    'embeddings'
  ];
};

export const getLanguages = async (owner: string, repo: string): Promise<Record<string, number>> => {
  if (!octokit) return {};

  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/languages', {
      owner,
      repo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching languages:', error);
    return {};
  }
};

export const getContributors = async (owner: string, repo: string): Promise<number> => {
  if (!octokit) return 0;

  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/contributors', {
      owner,
      repo,
      per_page: 1,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    const linkHeader = response.headers.link || '';
    const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
    return match ? parseInt(match[1]) : 1;
  } catch (error) {
    console.error('Error fetching contributors:', error);
    return 0;
  }
};

export const getBranches = async (owner: string, repo: string): Promise<number> => {
  if (!octokit) return 0;

  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/branches', {
      owner,
      repo,
      per_page: 1,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    const linkHeader = response.headers.link || '';
    const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
    return match ? parseInt(match[1]) : 1;
  } catch (error) {
    console.error('Error fetching branches:', error);
    return 0;
  }
};

export const getCommits = async (owner: string, repo: string): Promise<number> => {
  if (!octokit) return 0;

  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
      owner,
      repo,
      per_page: 1,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    const linkHeader = response.headers.link || '';
    const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
    return match ? parseInt(match[1]) : 1;
  } catch (error) {
    console.error('Error fetching commits:', error);
    return 0;
  }
};

export const getPullRequests = async (owner: string, repo: string): Promise<number> => {
  if (!octokit) return 0;

  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
      owner,
      repo,
      state: 'all',
      per_page: 1,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    const linkHeader = response.headers.link || '';
    const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
    return match ? parseInt(match[1]) : 1;
  } catch (error) {
    console.error('Error fetching pull requests:', error);
    return 0;
  }
};

export const getReadme = async (owner: string, repo: string): Promise<string | null> => {
  if (!octokit) return null;

  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/readme', {
      owner,
      repo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        'Accept': 'application/vnd.github.html'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching readme:', error);
    return null;
  }
};

export const getRepoContents = async (
  owner: string, 
  repo: string, 
  path: string,
  getContent: boolean = false
): Promise<any> => {
  if (!octokit) return [];

  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (getContent && !Array.isArray(response.data) && response.data.content) {
      // For file content, decode base64
      return Buffer.from(response.data.content, 'base64').toString('utf-8');
    }

    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error(`Error fetching repo contents for ${path}:`, error);
    return [];
  }
};

export const getLatestRelease = async (owner: string, repo: string): Promise<any | null> => {
  if (!octokit) return null;

  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
      owner,
      repo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return {
      name: response.data.name,
      published_at: response.data.published_at,
      html_url: response.data.html_url
    };
  } catch (error) {
    console.error('Error fetching latest release:', error);
    return null;
  }
};

export const getRelatedRepositories = async (owner: string, repo: string): Promise<GitHubRepo[]> => {
  if (!octokit) return [];

  try {
    // Get the repository to fetch topics
    const repoResponse = await octokit.request('GET /repos/{owner}/{repo}', {
      owner,
      repo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    
    const topics = repoResponse.data.topics || [];
    const language = repoResponse.data.language;
    
    if (topics.length === 0 && !language) return [];
    
    // Build a query based on topics and language
    let query = '';
    if (topics.length > 0) {
      // Use up to 3 topics to avoid too narrow results
      const topicsToUse = topics.slice(0, 3);
      query = topicsToUse.map(topic => `topic:${topic}`).join(' ');
    }
    
    if (language) {
      query += ` language:${language}`;
    }
    
    // Exclude the current repository
    query += ` -repo:${owner}/${repo}`;
    
    const response = await octokit.request('GET /search/repositories', {
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: 5,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return response.data.items;
  } catch (error) {
    console.error('Error fetching related repositories:', error);
    return [];
  }
};

export const getDependentRepositories = async (owner: string, repo: string): Promise<GitHubRepo[]> => {
  if (!octokit) return [];

  try {
    // Search for repositories that depend on this one
    const query = `dependency:${owner}/${repo}`;
    
    const response = await octokit.request('GET /search/repositories', {
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: 5,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return response.data.items;
  } catch (error) {
    console.error('Error fetching dependent repositories:', error);
    return [];
  }
};

export const getSymbolTree = async (owner: string, repo: string, path: string): Promise<any> => {
  if (!octokit) return null;

  try {
    // This is a simplified approach as GitHub API doesn't directly provide a symbol tree
    // In a real implementation, you might use a language server or parser
    const fileContent = await getRepoContents(owner, repo, path, true);
    
    if (typeof fileContent !== 'string') return null;
    
    // Simple regex-based parsing for demonstration purposes
    // This would be replaced with proper parsing in a real implementation
    const symbols = {
      classes: [],
      functions: [],
      variables: []
    };
    
    // Extract class definitions (very simplified)
    const classMatches = fileContent.match(/class\s+(\w+)/g);
    if (classMatches) {
      symbols.classes = classMatches.map(match => match.replace('class ', '').trim());
    }
    
    // Extract function definitions (very simplified)
    const functionMatches = fileContent.match(/function\s+(\w+)|def\s+(\w+)/g);
    if (functionMatches) {
      symbols.functions = functionMatches.map(match => 
        match.replace('function ', '').replace('def ', '').trim()
      );
    }
    
    return symbols;
  } catch (error) {
    console.error('Error fetching symbol tree:', error);
    return null;
  }
};

export const getUserProfile = async (username: string): Promise<GitHubUser | null> => {
  if (!octokit) return null;

  try {
    const response = await octokit.request('GET /users/{username}', {
      username,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const getUserRepositories = async (username: string): Promise<GitHubRepo[]> => {
  if (!octokit) return [];

  try {
    const response = await octokit.request('GET /users/{username}/repos', {
      username,
      sort: 'updated',
      per_page: 10,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user repositories:', error);
    return [];
  }
};

export const getRepoDetails = async (owner: string, repo: string): Promise<RepoDetails> => {
  const [
    languages, 
    contributors, 
    branches, 
    commits, 
    pullRequests, 
    readme, 
    latestRelease,
    relatedRepos,
    dependentRepos
  ] = await Promise.all([
    getLanguages(owner, repo),
    getContributors(owner, repo),
    getBranches(owner, repo),
    getCommits(owner, repo),
    getPullRequests(owner, repo),
    getReadme(owner, repo).catch(() => null),
    getLatestRelease(owner, repo).catch(() => null),
    getRelatedRepositories(owner, repo).catch(() => []),
    getDependentRepositories(owner, repo).catch(() => [])
  ]);

  // Get repository to fetch topics
  let topics: string[] = [];
  try {
    const repoResponse = await octokit.request('GET /repos/{owner}/{repo}', {
      owner,
      repo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    topics = repoResponse.data.topics || [];
  } catch (error) {
    console.error('Error fetching repository details:', error);
  }

  return {
    languages,
    contributors,
    branches,
    commits,
    readme,
    topics,
    pullRequests,
    lastRelease: latestRelease,
    relatedRepos,
    dependents: dependentRepos
  };
};

export const validateGitHubToken = async (token: string): Promise<boolean> => {
  try {
    const testOctokit = new Octokit({ auth: token });
    await testOctokit.request('GET /user');
    return true;
  } catch (error) {
    return false;
  }
};