import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGitHubClient, resetGitHubClient, GitHubRepo, GitHubUser } from '../api/github';
import { getGitHubToken } from '../utils/store';

// Initialize the GitHub client with the token from storage
const initializeClient = () => {
  const token = getGitHubToken();
  return getGitHubClient(token);
};

// Query keys for caching
export const queryKeys = {
  user: (username: string) => ['github', 'user', username],
  searchRepos: (query: string) => ['github', 'search', query],
  trendingRepos: (language: string, period: string) => ['github', 'trending', language, period],
  topicRepos: (topic: string) => ['github', 'topic', topic],
  readme: (owner: string, repo: string) => ['github', 'readme', owner, repo],
};

// Custom hooks for GitHub API
export const useGitHubUser = (username: string) => {
  return useQuery({
    queryKey: queryKeys.user(username),
    queryFn: async () => {
      const client = initializeClient();
      return await client.getUserProfile(username);
    },
    enabled: !!username, // Only run the query if username is provided
  });
};

export const useSearchRepositories = (query: string) => {
  return useQuery({
    queryKey: queryKeys.searchRepos(query),
    queryFn: async () => {
      const client = initializeClient();
      return await client.searchRepositories(query);
    },
    enabled: !!query, // Only run the query if query is provided
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });
};

export const useTrendingRepositories = (
  language: string = '',
  period: 'daily' | 'weekly' | 'monthly' = 'daily'
) => {
  return useQuery({
    queryKey: queryKeys.trendingRepos(language, period),
    queryFn: async () => {
      const client = initializeClient();
      return await client.getTrendingRepositories(language, period);
    },
    staleTime: 60 * 60 * 1000, // Consider data stale after 1 hour
  });
};

export const useTopicRepositories = (topic: string) => {
  return useQuery({
    queryKey: queryKeys.topicRepos(topic),
    queryFn: async () => {
      const client = initializeClient();
      return await client.getTopicRepositories(topic);
    },
    enabled: !!topic, // Only run the query if topic is provided
    staleTime: 30 * 60 * 1000, // Consider data stale after 30 minutes
  });
};

export const useReadme = (owner: string, repo: string) => {
  return useQuery({
    queryKey: queryKeys.readme(owner, repo),
    queryFn: async () => {
      const client = initializeClient();
      return await client.getReadme(owner, repo);
    },
    enabled: !!(owner && repo), // Only run the query if owner and repo are provided
    staleTime: 24 * 60 * 60 * 1000, // Consider data stale after 24 hours
  });
};

// Mutation for GitHub token
export const useUpdateGitHubToken = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (token: string) => {
      const client = resetGitHubClient(token);
      const isValid = await client.validateToken(token);
      if (!isValid) {
        throw new Error('Invalid GitHub token');
      }
      return token;
    },
    onSuccess: () => {
      // Invalidate all queries to refetch with new token
      queryClient.invalidateQueries({ queryKey: ['github'] });
    },
  });
};