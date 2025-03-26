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
  };
  created_at: string;
  updated_at: string;
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

export const validateGitHubToken = async (token: string): Promise<boolean> => {
  try {
    const testOctokit = new Octokit({ auth: token });
    await testOctokit.request('GET /user');
    return true;
  } catch (error) {
    return false;
  }
};