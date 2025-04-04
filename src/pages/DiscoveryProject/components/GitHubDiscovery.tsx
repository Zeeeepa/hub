import React, { useState, useEffect } from 'react';
import { 
  Search, Star, GitFork, Eye, Code, Tag, Zap, Users, Building, 
  Activity, Globe, Filter, Calendar, Award, Bookmark, 
  TrendingUp, Compass, Cpu, Database, FileCode, Layers, Sliders,
  ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import { 
  searchRepositories, 
  getTrendingRepositories, 
  getTopicRepositories,
  getRecommendedRepositories,
  getPopularTopics,
  searchUserRepositories,
  searchOrganizationRepositories,
  getSimilarRepositories,
  GitHubRepo 
} from '../utils/github';
import {
  getAdvancedSearch,
  getEcosystemProjects,
  getRecentlyUpdatedRepositories,
  getMostActiveRepositories,
  getRepositoryRecommendations
} from '../utils/githubExtended';

interface GitHubDiscoveryProps {
  onSelectRepo: (repo: GitHubRepo) => void;
  currentRepo?: { owner: string; name: string } | null;
  initialActiveTab?: 'search' | 'trending' | 'topics' | 'recommended' | 'user' | 'org' | 'similar' | 
    'ecosystem' | 'recent' | 'active' | 'advanced' | 'discover' | 'semantic';
  containerClassName?: string;
}

const LANGUAGES = [
  'All',
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'Go',
  'Rust',
  'C++',
  'PHP',
  'Ruby'
];

const TIME_PERIODS = [
  { label: 'Today', value: 'daily' },
  { label: 'This Week', value: 'weekly' },
  { label: 'This Month', value: 'monthly' }
] as const;

export default function GitHubDiscovery({ 
  onSelectRepo, 
  currentRepo, 
  initialActiveTab,
  containerClassName = ''
}: GitHubDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'search' | 'trending' | 'topics' | 'recommended' | 'user' | 'org' | 'similar' | 
    'ecosystem' | 'recent' | 'active' | 'advanced' | 'discover' | 'semantic'
  >(initialActiveTab || 'trending');
  const [popularTopics, setPopularTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [topicSearch, setTopicSearch] = useState('');
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [username, setUsername] = useState('');
  const [orgName, setOrgName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [semanticSearchQuery, setSemanticSearchQuery] = useState('');

  useEffect(() => {
    fetchTrendingRepos();
    fetchPopularTopics();
  }, []);

  useEffect(() => {
    if (activeTab === 'trending') {
      fetchTrendingRepos();
    }
  }, [selectedLanguage, timePeriod, activeTab, currentPage]);

  useEffect(() => {
    if (activeTab === 'topics' && selectedTopic) {
      fetchTopicRepos();
    }
  }, [selectedTopic, activeTab, currentPage]);

  useEffect(() => {
    if (activeTab === 'recommended' && userInterests.length > 0) {
      fetchRecommendedRepos();
    }
  }, [userInterests, selectedLanguage, activeTab, currentPage]);

  useEffect(() => {
    if (activeTab === 'similar' && currentRepo) {
      fetchSimilarRepos();
    }
  }, [currentRepo, activeTab, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const fetchPopularTopics = async () => {
    const topics = await getPopularTopics();
    setPopularTopics(topics);
    if (topics.length > 0) {
      setSelectedTopic(topics[0]);
    }
  };

  const fetchTrendingRepos = async () => {
    setIsLoading(true);
    const repos = await getTrendingRepositories(
      selectedLanguage === 'All' ? '' : selectedLanguage,
      timePeriod,
      currentPage
    );
    setRepositories(repos);
    setIsLoading(false);
  };

  const fetchTopicRepos = async () => {
    if (!selectedTopic) return;
    setIsLoading(true);
    const repos = await getTopicRepositories(selectedTopic, currentPage);
    setRepositories(repos);
    setIsLoading(false);
  };

  const fetchRecommendedRepos = async () => {
    setIsLoading(true);
    const repos = await getRecommendedRepositories(
      userInterests,
      selectedLanguage === 'All' ? '' : selectedLanguage,
      currentPage
    );
    setRepositories(repos);
    setIsLoading(false);
  };

  const fetchUserRepos = async () => {
    if (!username.trim()) return;
    setIsLoading(true);
    const repos = await searchUserRepositories(username, currentPage);
    setRepositories(repos);
    setIsLoading(false);
  };

  const fetchOrgRepos = async () => {
    if (!orgName.trim()) return;
    setIsLoading(true);
    const repos = await searchOrganizationRepositories(orgName, currentPage);
    setRepositories(repos);
    setIsLoading(false);
  };

  const fetchSimilarRepos = async () => {
    if (!currentRepo) return;
    setIsLoading(true);
    const repos = await getSimilarRepositories(currentRepo.owner, currentRepo.name, currentPage);
    setRepositories(repos);
    setIsLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    const repos = await searchRepositories(searchQuery, currentPage);
    setRepositories(repos);
    setIsLoading(false);
  };

  const handleSemanticSearch = async () => {
    if (!semanticSearchQuery.trim()) return;
    setIsLoading(true);
    const repos = await searchRepositories(semanticSearchQuery, currentPage);
    setRepositories(repos);
    setIsLoading(false);
  };

  const handleTopicSearch = () => {
    if (!topicSearch.trim()) return;
    setSelectedTopic(topicSearch);
  };

  const handleKeyPress = (e: React.KeyboardEvent, actionType: string) => {
    if (e.key === 'Enter') {
      if (actionType === 'search') {
        handleSearch();
      } else if (actionType === 'user') {
        fetchUserRepos();
      } else if (actionType === 'org') {
        fetchOrgRepos();
      } else if (actionType === 'topic') {
        handleTopicSearch();
      } else if (actionType === 'semantic') {
        handleSemanticSearch();
      }
    }
  };

  const toggleInterest = (topic: string) => {
    setUserInterests(prev => 
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const filteredTopics = topicSearch
    ? popularTopics.filter(topic => topic.toLowerCase().includes(topicSearch.toLowerCase()))
    : popularTopics;

  return (
    <div className={`space-y-6 ${containerClassName}`}>
      {/* Persistent Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search GitHub repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, 'search')}
          className="search-input pr-24"
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary py-1 px-3 text-sm"
        >
          Search
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-gray-700/30">
        <button
          onClick={() => setActiveTab('trending')}
          className={`pb-2 px-3 transition-colors flex items-center space-x-1 text-sm ${
            activeTab === 'trending'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Trending</span>
        </button>
        <button
          onClick={() => setActiveTab('topics')}
          className={`pb-2 px-3 transition-colors flex items-center space-x-1 text-sm ${
            activeTab === 'topics'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Topics</span>
        </button>
        <button
          onClick={() => setActiveTab('recommended')}
          className={`pb-2 px-3 transition-colors flex items-center space-x-1 text-sm ${
            activeTab === 'recommended'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>For You</span>
        </button>
        <button
          onClick={() => setActiveTab('user')}
          className={`pb-2 px-3 transition-colors flex items-center space-x-1 text-sm ${
            activeTab === 'user'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User</span>
        </button>
        <button
          onClick={() => setActiveTab('org')}
          className={`pb-2 px-3 transition-colors flex items-center space-x-1 text-sm ${
            activeTab === 'org'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Organization</span>
        </button>
        {currentRepo && (
          <button
            onClick={() => setActiveTab('similar')}
            className={`pb-2 px-3 transition-colors flex items-center space-x-1 text-sm ${
              activeTab === 'similar'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Similar</span>
          </button>
        )}
        <button
          onClick={() => setActiveTab('semantic')}
          className={`pb-2 px-3 transition-colors flex items-center space-x-1 text-sm ${
            activeTab === 'semantic'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Semantic Search</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex flex-wrap gap-2">
        {activeTab === 'user' && (
          <div className="w-full">
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter GitHub username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'user')}
                className="search-input"
              />
            </div>
          </div>
        )}

        {activeTab === 'org' && (
          <div className="w-full">
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter organization name..."
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'org')}
                className="search-input"
              />
            </div>
          </div>
        )}

        {activeTab === 'trending' && (
          <div className="flex flex-wrap gap-2 w-full">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="py-1 px-2 rounded-md text-sm bg-gray-800 border border-gray-700"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang} className="bg-gray-800">
                  {lang}
                </option>
              ))}
            </select>

            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value as typeof timePeriod)}
              className="py-1 px-2 rounded-md text-sm bg-gray-800 border border-gray-700"
            >
              {TIME_PERIODS.map((period) => (
                <option key={period.value} value={period.value} className="bg-gray-800">
                  {period.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {activeTab === 'topics' && (
          <div className="w-full">
            <div className="relative mb-3">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search topics..."
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'topic')}
                className="search-input"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {filteredTopics.slice(0, 10).map(topic => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedTopic === topic
                      ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                      : 'bg-gray-700/30 text-gray-300 border border-gray-600/30 hover:bg-gray-700/50'
                  }`}
                >
                  {topic}
                </button>
              ))}
              {filteredTopics.length > 10 && (
                <span className="text-xs text-gray-400 self-center">+ {filteredTopics.length - 10} more</span>
              )}
            </div>
          </div>
        )}

        {activeTab === 'recommended' && (
          <div className="w-full">
            <div className="flex gap-2 items-center mb-3">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="py-1 px-2 rounded-md text-sm bg-gray-800 border border-gray-700"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang} className="bg-gray-800">
                    {lang}
                  </option>
                ))}
              </select>
              
              <div className="relative flex-grow">
                <select
                  className="py-1 px-2 rounded-md text-sm bg-gray-800 border border-gray-700 w-full"
                >
                  <option value="" className="bg-gray-800">Select a category...</option>
                  <option value="web" className="bg-gray-800">Web Development</option>
                  <option value="ai" className="bg-gray-800">AI & Machine Learning</option>
                  <option value="mobile" className="bg-gray-800">Mobile Development</option>
                  <option value="data" className="bg-gray-800">Data Science</option>
                </select>
              </div>
            </div>
            
            <h3 className="text-sm font-medium text-gray-300 mb-2">Select interests (up to 5):</h3>
            <div className="flex flex-wrap gap-1">
              {popularTopics.slice(0, 12).map(topic => (
                <button
                  key={topic}
                  onClick={() => toggleInterest(topic)}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                    userInterests.includes(topic)
                      ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                      : 'bg-gray-700/30 text-gray-300 border border-gray-600/30 hover:bg-gray-700/50'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'similar' && currentRepo && (
          <div className="w-full">
            <div className="glass-card p-3 rounded-xl">
              <h3 className="text-md font-semibold mb-2">Finding repositories similar to:</h3>
              <div className="flex items-center space-x-2">
                <span className="text-indigo-400 font-medium">{currentRepo.owner}/{currentRepo.name}</span>
                <button 
                  onClick={fetchSimilarRepos}
                  className="btn-secondary text-xs py-1 px-2"
                >
                  <Zap className="w-3 h-3" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'semantic' && (
          <div className="w-full">
            <div className="relative">
              <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Describe the project you're looking for..."
                value={semanticSearchQuery}
                onChange={(e) => setSemanticSearchQuery(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'semantic')}
                className="search-input pl-12 pr-24"
              />
              <button
                onClick={handleSemanticSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary py-1 px-3 text-sm"
              >
                Search
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Semantic search uses AI to understand your request and find the most relevant projects
            </p>
          </div>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {repositories.map((repo) => (
              <div
                key={repo.id}
                className="glass-card rounded-xl space-y-3 cursor-pointer hover:scale-[1.02] transition-all duration-300 flex flex-col"
                style={{ 
                  width: '160px', 
                  height: '240px',
                  padding: '14px'
                }}
                onClick={() => onSelectRepo(repo)}
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={repo.owner.avatar_url}
                    alt={`${repo.name} owner avatar`}
                    className="w-7 h-7 rounded-lg"
                  />
                  <div className="overflow-hidden">
                    <h3 className="text-sm font-semibold text-white truncate">{repo.name}</h3>
                    <div className="text-xs text-gray-400 truncate">by {repo.owner.login}</div>
                  </div>
                </div>

                <p className="text-gray-400 text-xs line-clamp-3 flex-grow">{repo.description}</p>

                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span>{repo.stargazers_count.toLocaleString()}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <GitFork className="w-3 h-3 text-blue-400" />
                    <span>{repo.forks_count.toLocaleString()}</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {repo.language && (
                    <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      {repo.language}
                    </span>
                  )}
                  {repo.topics?.slice(0, 2).map(topic => (
                    <span key={topic} className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 truncate" style={{ maxWidth: '70px' }}>
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {repositories.length > 0 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-1 rounded-md ${
                    currentPage === 1 
                      ? 'text-gray-600 cursor-not-allowed' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-md ${
                        currentPage === pageNum
                          ? 'bg-purple-500 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-1 rounded-md ${
                    currentPage === totalPages
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}