import React, { useState } from 'react';
import { Search, Filter, Code, Tag, Calendar, Star, GitFork, Users, Loader, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';
import { searchRepositories, GitHubRepo } from '../utils/github';
import { saveRepository, getSavedRepositories } from '../utils/store';

interface AdvancedGitHubSearchProps {
  onSelectRepo?: (repo: GitHubRepo) => void;
}

export default function AdvancedGitHubSearch({ onSelectRepo }: AdvancedGitHubSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState('');
  const [minStars, setMinStars] = useState('');
  const [createdAfter, setCreatedAfter] = useState('');
  const [topics, setTopics] = useState('');
  const [sort, setSort] = useState<'stars' | 'forks' | 'updated'>('stars');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<GitHubRepo[]>([]);
  const [savedRepoIds, setSavedRepoIds] = useState<Set<number>>(new Set());

  React.useEffect(() => {
    const savedRepos = getSavedRepositories();
    const savedIds = new Set(savedRepos.map(repo => repo.repoId));
    setSavedRepoIds(savedIds);
  }, []);

  const buildSearchQuery = () => {
    let query = searchQuery.trim();
    
    if (language) {
      query += ` language:${language}`;
    }
    
    if (minStars) {
      query += ` stars:>=${minStars}`;
    }
    
    if (createdAfter) {
      query += ` created:>=${createdAfter}`;
    }
    
    if (topics) {
      const topicsList = topics.split(',').map(t => t.trim());
      topicsList.forEach(topic => {
        if (topic) query += ` topic:${topic}`;
      });
    }
    
    return query;
  };

  const handleSearch = async () => {
    const query = buildSearchQuery();
    if (!query) return;
    
    setIsLoading(true);
    try {
      const results = await searchRepositories(query, sort, order);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching repositories:', error);
    } finally {
      setIsLoading(false);
    }
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
          Advanced GitHub Search
        </h2>
      </div>

      <div className="glass-card p-6 rounded-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Search Query
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input pl-10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Language
            </label>
            <div className="relative">
              <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="search-input pl-10"
              >
                <option value="">Any Language</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="c++">C++</option>
                <option value="c#">C#</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Minimum Stars
            </label>
            <div className="relative">
              <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                placeholder="e.g. 1000"
                value={minStars}
                onChange={(e) => setMinStars(e.target.value)}
                className="search-input pl-10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Created After
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={createdAfter}
                onChange={(e) => setCreatedAfter(e.target.value)}
                className="search-input pl-10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Topics (comma separated)
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="e.g. react, machine-learning"
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                className="search-input pl-10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Sort By
            </label>
            <div className="flex space-x-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="search-input flex-1"
              >
                <option value="stars">Stars</option>
                <option value="forks">Forks</option>
                <option value="updated">Updated</option>
              </select>
              
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value as any)}
                className="search-input w-24"
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleSearch}
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span>Search</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-3 text-gray-400">Searching repositories...</span>
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
            {searchQuery ? "Try adjusting your search criteria" : "Enter a search query to find repositories"}
          </p>
        </div>
      )}
    </div>
  );
}