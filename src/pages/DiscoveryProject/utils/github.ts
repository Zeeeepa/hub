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

// Get repository README
export async function getReadme(owner: string, repo: string): Promise<string> {
  if (!octokit) initializeOctokit();
  
  try {
    console.log(`Fetching README for ${owner}/${repo}`);
    
    // Mock implementation
    return `# ${repo}\n\nThis is a sample README for the ${repo} repository.\n\n## Features\n\n- Feature 1\n- Feature 2\n- Feature 3`;
  } catch (error) {
    console.error('Error fetching README:', error);
    return 'README not found or error occurred';
  }
}

// Get repository contents
export async function getRepoContents(
  owner: string,
  repo: string,
  path: string = '',
  getContent: boolean = false
): Promise<any> {
  if (!octokit) initializeOctokit();
  
  try {
    console.log(`Fetching repo contents for ${owner}/${repo}/${path}`);
    
    // Mock implementation
    if (getContent) {
      return `// Sample content for ${path}\n\nfunction example() {\n  console.log("This is a sample file content");\n  return true;\n}`;
    }
    
    return [
      { name: 'src', type: 'dir', path: 'src' },
      { name: 'README.md', type: 'file', path: 'README.md' },
      { name: 'package.json', type: 'file', path: 'package.json' }
    ];
  } catch (error) {
    console.error('Error fetching repo contents:', error);
    return getContent ? '' : [];
  }
}

// Get symbol tree (mock implementation)
export async function getSymbolTree(owner: string, repo: string, path?: string): Promise<SymbolTreeItem[]> {
  try {
    // This would typically call a GitHub API or a language server
    // For now, we'll return mock data
    console.log(`Fetching symbol tree for ${owner}/${repo}${path ? '/' + path : ''}`);
    
    // Mock implementation
    return [
      {
        name: 'Component',
        kind: 'class',
        path: 'src/components/Component.tsx',
        line: 10,
        children: [
          {
            name: 'render',
            kind: 'function',
            path: 'src/components/Component.tsx',
            line: 15,
            children: []
          }
        ]
      },
      {
        name: 'fetchData',
        kind: 'function',
        path: 'src/utils/api.ts',
        line: 5,
        children: []
      },
      {
        name: 'API_URL',
        kind: 'variable',
        path: 'src/utils/constants.ts',
        line: 3,
        children: []
      }
    ];
  } catch (error) {
    console.error('Error fetching symbol tree:', error);
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

// Get repository contributors
export async function getRepositoryContributors(
  owner: string,
  repo: string,
  limit: number = 10
): Promise<Array<{ login: string; avatar_url: string; contributions: number }>> {
  if (!octokit) initializeOctokit();
  
  try {
    const { data } = await octokit!.rest.repos.listContributors({
      owner,
      repo,
      per_page: limit
    });
    
    return data.map(contributor => ({
      login: contributor.login,
      avatar_url: contributor.avatar_url,
      contributions: contributor.contributions
    }));
  } catch (error) {
    console.error('Error fetching repository contributors:', error);
    return [];
  }
}

// Get repository issues
export async function getRepositoryIssues(
  owner: string,
  repo: string,
  state: 'open' | 'closed' | 'all' = 'open',
  limit: number = 10
): Promise<Array<{ 
  number: number; 
  title: string; 
  state: string; 
  html_url: string;
  user: { login: string; avatar_url: string };
  created_at: string;
  updated_at: string;
  comments: number;
}>> {
  if (!octokit) initializeOctokit();
  
  try {
    const { data } = await octokit!.rest.issues.listForRepo({
      owner,
      repo,
      state,
      per_page: limit
    });
    
    return data.map(issue => ({
      number: issue.number,
      title: issue.title,
      state: issue.state,
      html_url: issue.html_url,
      user: {
        login: issue.user.login,
        avatar_url: issue.user.avatar_url
      },
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      comments: issue.comments
    }));
  } catch (error) {
    console.error('Error fetching repository issues:', error);
    return [];
  }
}

// Get repository pull requests
export async function getRepositoryPullRequests(
  owner: string,
  repo: string,
  state: 'open' | 'closed' | 'all' = 'open',
  limit: number = 10
): Promise<Array<{
  number: number;
  title: string;
  state: string;
  html_url: string;
  user: { login: string; avatar_url: string };
  created_at: string;
  updated_at: string;
  merged_at: string | null;
}>> {
  if (!octokit) initializeOctokit();
  
  try {
    const { data } = await octokit!.rest.pulls.list({
      owner,
      repo,
      state,
      per_page: limit
    });
    
    return data.map(pr => ({
      number: pr.number,
      title: pr.title,
      state: pr.state,
      html_url: pr.html_url,
      user: {
        login: pr.user.login,
        avatar_url: pr.user.avatar_url
      },
      created_at: pr.created_at,
      updated_at: pr.updated_at,
      merged_at: pr.merged_at
    }));
  } catch (error) {
    console.error('Error fetching repository pull requests:', error);
    return [];
  }
}

// Get repository commit history
export async function getRepositoryCommits(
  owner: string,
  repo: string,
  limit: number = 10
): Promise<Array<{
  sha: string;
  html_url: string;
  commit: { message: string; author: { name: string; date: string } };
  author: { login: string; avatar_url: string } | null;
}>> {
  if (!octokit) initializeOctokit();
  
  try {
    const { data } = await octokit!.rest.repos.listCommits({
      owner,
      repo,
      per_page: limit
    });
    
    return data.map(commit => ({
      sha: commit.sha,
      html_url: commit.html_url,
      commit: {
        message: commit.commit.message,
        author: {
          name: commit.commit.author.name,
          date: commit.commit.author.date
        }
      },
      author: commit.author ? {
        login: commit.author.login,
        avatar_url: commit.author.avatar_url
      } : null
    }));
  } catch (error) {
    console.error('Error fetching repository commits:', error);
    return [];
  }
}

// Get popular repositories
export async function getPopularRepositories(
  language: string = '',
  limit: number = 10
): Promise<GitHubRepo[]> {
  if (!octokit) initializeOctokit();
  
  // Build query
  let query = 'stars:>1000';
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
    console.error('Error fetching popular repositories:', error);
    return [];
  }
}