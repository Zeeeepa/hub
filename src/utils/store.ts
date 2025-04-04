// Store utilities for the hub application

// Types
export interface Category {
  id: string;
  name: string;
  color: string;
}

// Local storage keys
const SAVE_LOCATION_KEY = 'hub_save_location';
const CATEGORIES_KEY = 'hub_categories';
const GITHUB_TOKEN_KEY = 'github_token';
const GITHUB_USERNAME_KEY = 'github_username';

// Save location functions
export function getSaveLocation(): string {
  return localStorage.getItem(SAVE_LOCATION_KEY) || '';
}

export function setSaveLocation(path: string): void {
  localStorage.setItem(SAVE_LOCATION_KEY, path);
}

// Categories functions
export function getCategories(): Category[] {
  const categoriesJson = localStorage.getItem(CATEGORIES_KEY);
  return categoriesJson ? JSON.parse(categoriesJson) : [];
}

export function setCategories(categories: Category[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

export function addCategory(category: Category): void {
  const categories = getCategories();
  categories.push(category);
  setCategories(categories);
}

export function removeCategory(categoryId: string): void {
  const categories = getCategories();
  const updatedCategories = categories.filter(cat => cat.id !== categoryId);
  setCategories(updatedCategories);
}

// GitHub settings functions
export function getGitHubToken(): string {
  return localStorage.getItem(GITHUB_TOKEN_KEY) || '';
}

export function setGitHubToken(token: string): void {
  localStorage.setItem(GITHUB_TOKEN_KEY, token);
}

export function getGitHubUsername(): string {
  return localStorage.getItem(GITHUB_USERNAME_KEY) || '';
}

export function setGitHubUsername(username: string): void {
  localStorage.setItem(GITHUB_USERNAME_KEY, username);
}
