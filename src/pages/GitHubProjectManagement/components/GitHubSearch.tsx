import React, { useState, useEffect } from 'react';
import { 
  Search, Star, GitFork, ExternalLink, Bookmark, 
  BookmarkCheck, Filter, SortAsc, SortDesc, Loader
} from 'lucide-react';
import { 
  searchRepositories, 
  getTrendingRepositories, 
  getPopularRepositories,
  GitHubRepo 
} from '../utils/github';
import { saveRepository, getSavedRepositories } from '../utils/store';

interface GitHubSearchProps {
  onSelectRepo?: (repo: GitHubRepo) => void;
}

export default function GitHubSearch({ onSelectRepo }: GitHubSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sort, setSort] = useState<'stars' | 'forks' | 'updated'>('stars');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState<'search' | 'trending' | 'popular'>('trending');
  const [savedRepoIds, setSavedRepoIds] = useState<Set<number>>(new Set());
  const [language, setLanguage] = useState('');
  const [since, setSince] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    const savedRepos = getSavedRepositories();
    const savedIds = new Set(savedRepos.map(repo => repo.repoId));
    setSavedRepoIds(savedIds);
    
    handleLoadTrending();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setActiveTab('search');
    
    try {
      const results = await searchRepositories(searchQuery, sort, order);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching repositories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadTrending = async () => {
    setIsLoading(true);
    setActiveTab('trending');
    
    try {
      const results = await getTrendingRepositories(language, since);
      setSearchResults(results);
    } catch (error) {
      console.error('Error loading trending repositories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadPopular = async () => {
    setIsLoading(true);
    setActiveTab('popular');
    
    try {
      const results = await getPopularRepositories(language);
      setSearchResults(results);
    } catch (error) {
      console.error('Error loading popular repositories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleSortOrder = () => {
    setOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleSaveRepo = (repo: GitHubRepo, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      saveRepository(repo);
      setSavedRepoIds(prev => new Set([...prev, repo.id]));
    } catch (error) {
      console.error('Error saving repository:', error);
    }
  };

  const handleRepoClick = (repo: GitHubRepo) => {
    if (onSelectRepo) {
      onSelectRepo(repo);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          GitHub Repository Search
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search GitHub repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2"
          >
            <option value="stars">Stars</option>
            <option value="forks">Forks</option>
            <option value="updated">Updated</option>
          </select>
          
          <button
            onClick={toggleSortOrder}
            className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
            title={order === 'asc' ? 'Ascending' : 'Descending'}
          >
            {order === 'asc' ? (
              <SortAsc className="w-5 h-5 text-gray-400" />
            ) : (
              <SortDesc className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          <button
            onClick={handleSearch}
            className="btn-primary"
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-700/30 mb-4">
        <button
          onClick={handleSearch}
          className={`px-4 py-2 flex items-center ${activeTab === 'search' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Search className="w-4 h-4 mr-2" />
          Search Results
        </button>
        <button
          onClick={handleLoadTrending}
          className={`px-4 py-2 flex items-center ${activeTab === 'trending' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Star className="w-4 h-4 mr-2" />
          Trending
        </button>
        <button
          onClick={handleLoadPopular}
          className={`px-4 py-2 flex items-center ${activeTab === 'popular' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <GitFork className="w-4 h-4 mr-2" />
          Popular
        </button>
      </div>

      {activeTab === 'trending' && (
        <div className="flex items-center space-x-4 mb-4">
          <div>
            <label className="text-sm text-gray-400 mr-2">Time period:</label>
            <select
              value={since}
              onChange={(e) => setSince(e.target.value as any)}
              className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm text-gray-400 mr-2">Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1"
            >
              <option value="">All Languages</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="c++">C++</option>
              <option value="c#">C#</option>
            </select>
          </div>
          
          <button
            onClick={handleLoadTrending}
            className="btn-secondary"
          >
            <Filter className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-3 text-gray-400">Loading repositories...</span>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((repo) => (
            <div
              key={repo.id}
              className="glass-card p-6 rounded-xl space-y-4 cursor-pointer hover:scale-[1.02] transition-all duration-300"
              onClick={() => handleRepoClick(repo)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={repo.owner.avatar_url}
                    alt={`${repo.name} owner avatar`}
                    className="w-8 h-8 rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{repo.name}</h3>
                    <div className="text-xs text-gray-400">by {repo.owner.login}</div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => handleSaveRepo(repo, e)}
                    className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
                    title={savedRepoIds.has(repo.id) ? 'Saved' : 'Save Repository'}
                  >
                    {savedRepoIds.has(repo.id) ? (
                      <BookmarkCheck className="w-5 h-5 text-green-400" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </a>
                </div>
              </div>

              <p className="text-gray-400 line-clamp-2">{repo.description}</p>

              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{repo.stargazers_count.toLocaleString()}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <GitFork className="w-4 h-4 text-blue-400" />
                  <span>{repo.forks_count.toLocaleString()}</span>
                </span>
                {repo.language && (
                  <span className="flex items-center space-x-1">
                    <span className="w-3 h-3 rounded-full bg-purple-400" />
                    <span>{repo.language}</span>
                  </span>
                )}
              </div>

              {repo.topics && repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {repo.topics.slice(0, 3).map(topic => (
                    <span key={topic} className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {topic}
                    </span>
                  ))}
                  {repo.topics.length > 3 && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-400">
                      +{repo.topics.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Search className="w-16 h-16 text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No repositories found</h3>
          <p className="text-center">
            {activeTab === 'search' 
              ? "Try adjusting your search query or filters" 
              : "Try changing the filters or search for specific repositories"}
          </p>
        </div>
      )}
    </div>
  );
}