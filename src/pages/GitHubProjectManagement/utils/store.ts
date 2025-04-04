import { v4 as uuidv4 } from 'uuid';
import { GitHubRepo } from './github';

// Interface for saved repository
export interface SavedRepo {
  id: string;
  repoId: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  notes: string;
  tags: string[];
  savedAt: string;
  lastViewed: string | null;
}

// Local storage keys
const SAVED_REPOS_KEY = 'github_saved_repos';
const GITHUB_TOKEN_KEY = 'github_token';
const GITHUB_SETTINGS_KEY = 'github_settings';

// Default settings
const DEFAULT_SETTINGS = {
  defaultSearchSort: 'stars',
  defaultSearchOrder: 'desc',
  resultsPerPage: 10,
  theme: 'dark',
  showStarCount: true,
  showForkCount: true,
  showLanguage: true,
  showDescription: true,
  showLastUpdated: true
};

// Get saved repositories from local storage
export function getSavedRepositories(): SavedRepo[] {
  try {
    const savedRepos = localStorage.getItem(SAVED_REPOS_KEY);
    return savedRepos ? JSON.parse(savedRepos) : [];
  } catch (error) {
    console.error('Error getting saved repositories:', error);
    return [];
  }
}

// Save repository to local storage
export function saveRepository(repo: GitHubRepo, notes: string = '', tags: string[] = []): SavedRepo {
  try {
    const savedRepos = getSavedRepositories();
    
    // Check if repository is already saved
    const existingIndex = savedRepos.findIndex(r => r.repoId === repo.id);
    
    const savedRepo: SavedRepo = {
      id: existingIndex >= 0 ? savedRepos[existingIndex].id : uuidv4(),
      repoId: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || '',
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language || '',
      owner: {
        login: repo.owner.login,
        avatar_url: repo.owner.avatar_url
      },
      notes,
      tags,
      savedAt: existingIndex >= 0 ? savedRepos[existingIndex].savedAt : new Date().toISOString(),
      lastViewed: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      // Update existing repository
      savedRepos[existingIndex] = savedRepo;
    } else {
      // Add new repository
      savedRepos.push(savedRepo);
    }
    
    localStorage.setItem(SAVED_REPOS_KEY, JSON.stringify(savedRepos));
    return savedRepo;
  } catch (error) {
    console.error('Error saving repository:', error);
    throw error;
  }
}

// Remove saved repository from local storage
export function removeSavedRepository(id: string): boolean {
  try {
    const savedRepos = getSavedRepositories();
    const filteredRepos = savedRepos.filter(repo => repo.id !== id);
    
    if (filteredRepos.length === savedRepos.length) {
      return false; // Repository not found
    }
    
    localStorage.setItem(SAVED_REPOS_KEY, JSON.stringify(filteredRepos));
    return true;
  } catch (error) {
    console.error('Error removing saved repository:', error);
    return false;
  }
}

// Update saved repository
export function updateSavedRepository(
  id: string,
  updates: { notes?: string; tags?: string[] }
): boolean {
  try {
    const savedRepos = getSavedRepositories();
    const repoIndex = savedRepos.findIndex(repo => repo.id === id);
    
    if (repoIndex === -1) {
      return false; // Repository not found
    }
    
    if (updates.notes !== undefined) {
      savedRepos[repoIndex].notes = updates.notes;
    }
    
    if (updates.tags !== undefined) {
      savedRepos[repoIndex].tags = updates.tags;
    }
    
    localStorage.setItem(SAVED_REPOS_KEY, JSON.stringify(savedRepos));
    return true;
  } catch (error) {
    console.error('Error updating saved repository:', error);
    return false;
  }
}

// Update last viewed timestamp
export function updateLastViewed(id: string): boolean {
  try {
    const savedRepos = getSavedRepositories();
    const repoIndex = savedRepos.findIndex(repo => repo.id === id);
    
    if (repoIndex === -1) {
      return false; // Repository not found
    }
    
    savedRepos[repoIndex].lastViewed = new Date().toISOString();
    
    localStorage.setItem(SAVED_REPOS_KEY, JSON.stringify(savedRepos));
    return true;
  } catch (error) {
    console.error('Error updating last viewed timestamp:', error);
    return false;
  }
}

// Get GitHub token from local storage
export function getGitHubToken(): string | null {
  return localStorage.getItem(GITHUB_TOKEN_KEY);
}

// Save GitHub token to local storage
export function saveGitHubToken(token: string): void {
  localStorage.setItem(GITHUB_TOKEN_KEY, token);
}

// Remove GitHub token from local storage
export function removeGitHubToken(): void {
  localStorage.removeItem(GITHUB_TOKEN_KEY);
}

// Get GitHub settings from local storage
export function getGitHubSettings(): typeof DEFAULT_SETTINGS {
  try {
    const settings = localStorage.getItem(GITHUB_SETTINGS_KEY);
    return settings ? { ...DEFAULT_SETTINGS, ...JSON.parse(settings) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting GitHub settings:', error);
    return DEFAULT_SETTINGS;
  }
}

// Save GitHub settings to local storage
export function saveGitHubSettings(settings: Partial<typeof DEFAULT_SETTINGS>): void {
  try {
    const currentSettings = getGitHubSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    localStorage.setItem(GITHUB_SETTINGS_KEY, JSON.stringify(updatedSettings));
  } catch (error) {
    console.error('Error saving GitHub settings:', error);
  }
}

// Reset GitHub settings to defaults
export function resetGitHubSettings(): void {
  localStorage.setItem(GITHUB_SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
}

// Get all unique tags from saved repositories
export function getAllTags(): string[] {
  const savedRepos = getSavedRepositories();
  const tagsSet = new Set<string>();
  
  savedRepos.forEach(repo => {
    repo.tags.forEach(tag => tagsSet.add(tag));
  });
  
  return Array.from(tagsSet).sort();
}

// Search saved repositories
export function searchSavedRepositories(
  query: string,
  tags: string[] = []
): SavedRepo[] {
  const savedRepos = getSavedRepositories();
  
  return savedRepos.filter(repo => {
    // Match query
    const matchesQuery = query === '' || 
      repo.name.toLowerCase().includes(query.toLowerCase()) ||
      repo.description.toLowerCase().includes(query.toLowerCase()) ||
      repo.notes.toLowerCase().includes(query.toLowerCase());
    
    // Match tags
    const matchesTags = tags.length === 0 || 
      tags.every(tag => repo.tags.includes(tag));
    
    return matchesQuery && matchesTags;
  });
}