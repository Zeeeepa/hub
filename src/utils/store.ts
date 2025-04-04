const STORAGE_KEYS = {
  SAVE_LOCATION: 'saveLocation',
  PROJECTS: 'projects',
  CATEGORIES: 'categories',
  GITHUB_TOKEN: 'githubToken',
  SAVED_REPOS: 'savedRepos',
  AGENT_CONTEXTS: 'agentContexts'
} as const;

// Project interfaces
export interface Project {
  id: string;
  name: string;
  path: string;
  description?: string;
  lastOpened?: string;
  categoryId?: string;
  favorite?: boolean;
}

// Agent Context interfaces
export interface AgentContext {
  id: string;
  name: string;
  description: string;
  mainGoal: string;
  textOverview: string;
  codeFiles: {
    id: string;
    name: string;
    content: string;
    language: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Saved Repository interfaces
export interface SavedRepo {
  id: string;
  repoId: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  stars: number;
  forks: number;
  language: string;
  tags: string[];
  notes: string;
  savedAt: string;
  lastViewed: string | null;
}

export const getSaveLocation = (): string => {
  return localStorage.getItem(STORAGE_KEYS.SAVE_LOCATION) || '';
};

export const setSaveLocation = (path: string): void => {
  localStorage.setItem(STORAGE_KEYS.SAVE_LOCATION, path);
};

export const getProjects = (): Project[] => {
  try {
    const projects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return projects ? JSON.parse(projects) : [];
  } catch {
    return [];
  }
};

export const setProjects = (projects: Project[]): void => {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};

export const getCategories = (): any[] => {
  try {
    const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return categories ? JSON.parse(categories) : [];
  } catch {
    return [];
  }
};

export const setCategories = (categories: any[]): void => {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

export const getGitHubToken = (): string => {
  return localStorage.getItem(STORAGE_KEYS.GITHUB_TOKEN) || '';
};

export const setGitHubToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.GITHUB_TOKEN, token);
};

// Saved Repositories functions
export const getSavedRepositories = (): SavedRepo[] => {
  try {
    const repos = localStorage.getItem(STORAGE_KEYS.SAVED_REPOS);
    return repos ? JSON.parse(repos) : [];
  } catch {
    return [];
  }
};

export const addSavedRepository = (repo: Omit<SavedRepo, 'id' | 'savedAt'>): SavedRepo => {
  const savedRepos = getSavedRepositories();
  
  // Check if the repo is already saved
  if (savedRepos.some(r => r.repoId === repo.repoId)) {
    throw new Error('Repository already saved');
  }
  
  const newRepo: SavedRepo = {
    ...repo,
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(
    STORAGE_KEYS.SAVED_REPOS, 
    JSON.stringify([...savedRepos, newRepo])
  );
  
  return newRepo;
};

export const removeSavedRepository = (id: string): void => {
  const savedRepos = getSavedRepositories();
  const filteredRepos = savedRepos.filter(repo => repo.id !== id);
  localStorage.setItem(STORAGE_KEYS.SAVED_REPOS, JSON.stringify(filteredRepos));
};

export const updateSavedRepository = (id: string, updates: Partial<SavedRepo>): SavedRepo | null => {
  const savedRepos = getSavedRepositories();
  const repoIndex = savedRepos.findIndex(repo => repo.id === id);
  
  if (repoIndex === -1) return null;
  
  const updatedRepo = {
    ...savedRepos[repoIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  savedRepos[repoIndex] = updatedRepo;
  localStorage.setItem(STORAGE_KEYS.SAVED_REPOS, JSON.stringify(savedRepos));
  
  return updatedRepo;
};

export const updateLastViewed = (id: string): void => {
  const savedRepos = getSavedRepositories();
  const repoIndex = savedRepos.findIndex(repo => repo.id === id);
  
  if (repoIndex === -1) return;
  
  savedRepos[repoIndex] = {
    ...savedRepos[repoIndex],
    lastViewed: new Date().toISOString()
  };
  
  localStorage.setItem(STORAGE_KEYS.SAVED_REPOS, JSON.stringify(savedRepos));
};

// Agent Context functions
export const getAgentContexts = (): AgentContext[] => {
  try {
    const contexts = localStorage.getItem(STORAGE_KEYS.AGENT_CONTEXTS);
    return contexts ? JSON.parse(contexts) : [];
  } catch {
    return [];
  }
};

export const saveAgentContext = (contextData: Omit<AgentContext, 'id' | 'createdAt' | 'updatedAt'>): AgentContext => {
  const contexts = getAgentContexts();
  
  const newContext: AgentContext = {
    ...contextData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(
    STORAGE_KEYS.AGENT_CONTEXTS, 
    JSON.stringify([...contexts, newContext])
  );
  
  return newContext;
};

export const updateAgentContext = (id: string, updates: Omit<AgentContext, 'id' | 'createdAt' | 'updatedAt'>): AgentContext | null => {
  const contexts = getAgentContexts();
  const contextIndex = contexts.findIndex(ctx => ctx.id === id);
  
  if (contextIndex === -1) return null;
  
  const updatedContext: AgentContext = {
    ...contexts[contextIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  contexts[contextIndex] = updatedContext;
  localStorage.setItem(STORAGE_KEYS.AGENT_CONTEXTS, JSON.stringify(contexts));
  
  return updatedContext;
};

export const deleteAgentContext = (id: string): void => {
  const contexts = getAgentContexts();
  const filteredContexts = contexts.filter(ctx => ctx.id !== id);
  localStorage.setItem(STORAGE_KEYS.AGENT_CONTEXTS, JSON.stringify(filteredContexts));
};