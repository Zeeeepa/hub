import { Octokit } from 'octokit';
import { z } from 'zod';

// Schema definitions for API responses
export const GitHubUserSchema = z.object({
  login: z.string(),
  id: z.number(),
  avatar_url: z.string(),
  name: z.string().nullable(),
  bio: z.string().nullable(),
  public_repos: z.number(),
  followers: z.number(),
  following: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  email: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  blog: z.string().nullable().optional(),
  twitter_username: z.string().nullable().optional(),
});

export const GitHubRepoOwnerSchema = z.object({
  login: z.string(),
  avatar_url: z.string(),
});

export const GitHubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullable(),
  html_url: z.string(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  watchers_count: z.number(),
  open_issues_count: z.number(),
  language: z.string().nullable(),
  owner: GitHubRepoOwnerSchema,
  created_at: z.string(),
  updated_at: z.string(),
  topics: z.array(z.string()).optional(),
  license: z.object({
    name: z.string(),
    spdx_id: z.string(),
  }).nullable().optional(),
  size: z.number().optional(),
  default_branch: z.string().optional(),
  homepage: z.string().nullable().optional(),
});

// Type definitions derived from schemas
export type GitHubUser = z.infer<typeof GitHubUserSchema>;
export type GitHubRepo = z.infer<typeof GitHubRepoSchema>;

// GitHub API client class
export class GitHubClient {
  private octokit: Octokit;
  
  constructor(token?: string) {
    this.octokit = new Octokit({
      auth: token
    });
  }

  // User methods
  async getUserProfile(username: string): Promise<GitHubUser> {
    try {
      const response = await this.octokit.request('GET /users/{username}', {
        username,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      
      // Validate response with Zod schema
      return GitHubUserSchema.parse(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Repository methods
  async searchRepositories(query: string): Promise<GitHubRepo[]> {
    try {
      const response = await this.octokit.request('GET /search/repositories', {
        q: query,
        sort: 'stars',
        order: 'desc',
        per_page: 30,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      // Validate each repository with Zod schema
      return z.array(GitHubRepoSchema).parse(response.data.items);
    } catch (error) {
      console.error('Error searching repositories:', error);
      throw error;
    }
  }

  async getTrendingRepositories(
    language: string = '',
    since: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<GitHubRepo[]> {
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
      
      const response = await this.octokit.request('GET /search/repositories', {
        q: query,
        sort: 'stars',
        order: 'desc',
        per_page: 30,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      return z.array(GitHubRepoSchema).parse(response.data.items);
    } catch (error) {
      console.error('Error fetching trending repositories:', error);
      throw error;
    }
  }

  async getTopicRepositories(topic: string): Promise<GitHubRepo[]> {
    try {
      const response = await this.octokit.request('GET /search/repositories', {
        q: `topic:${topic}`,
        sort: 'stars',
        order: 'desc',
        per_page: 30,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      return z.array(GitHubRepoSchema).parse(response.data.items);
    } catch (error) {
      console.error('Error fetching topic repositories:', error);
      throw error;
    }
  }

  // Repository content methods
  async getReadme(owner: string, repo: string): Promise<string | null> {
    try {
      const response = await this.octokit.request('GET /repos/{owner}/{repo}/readme', {
        owner,
        repo,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
          'Accept': 'application/vnd.github.html'
        }
      });

      return response.data as string;
    } catch (error) {
      console.error('Error fetching readme:', error);
      return null;
    }
  }

  // Authentication methods
  async validateToken(token: string): Promise<boolean> {
    try {
      const testOctokit = new Octokit({ auth: token });
      await testOctokit.request('GET /user');
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Create a singleton instance
let githubClient: GitHubClient | null = null;

export const getGitHubClient = (token?: string): GitHubClient => {
  if (!githubClient) {
    githubClient = new GitHubClient(token);
  }
  return githubClient;
};

export const resetGitHubClient = (token?: string): GitHubClient => {
  githubClient = new GitHubClient(token);
  return githubClient;
};