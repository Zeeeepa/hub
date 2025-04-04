import React, { useState } from 'react';
import { MessageSquare, Search, Github, Star, GitFork, Eye, BookOpen, Filter } from 'lucide-react';
import ChatInterface from '../../components/projectPlanner/ChatInterface';

const GitHubDiscovery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'search' | 'saved'>('chat');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([ 
    { role: 'system', content: 'Welcome to GitHub Discovery! I can help you find interesting and useful GitHub projects. How would you like to start?' }
  ]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Array<{id: string, name: string, description: string, stars: number, forks: number, language: string, url: string, saved: boolean}>>([]);
  const [filters, setFilters] = useState<{language: string, minStars: number, sort: string}>({
    language: '',
    minStars: 0,
    sort: 'stars'
  });

  // Function to handle sending messages to the AI
  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    setLoading(true);
    
    // Simulate AI response (in a real implementation, this would call an API)
    setTimeout(() => {
      // Example AI response
      const aiResponse = { role: 'system', content: 'I can help you discover GitHub projects. Would you like to search for projects related to a specific topic, or would you prefer recommendations based on your interests?' };
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1500);
  };

  // Mock function to handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Mock search results
    const mockResults = [
      { id: 'repo1', name: 'awesome-ai', description: 'A curated list of AI resources and libraries', stars: 15420, forks: 2340, language: 'Python', url: 'https://github.com/example/awesome-ai', saved: false },
      { id: 'repo2', name: 'react-patterns', description: 'Design patterns and best practices for React.js', stars: 8750, forks: 1230, language: 'JavaScript', url: 'https://github.com/example/react-patterns', saved: false },
      { id: 'repo3', name: 'data-science-toolkit', description: 'Tools and utilities for data science projects', stars: 6320, forks: 890, language: 'Python', url: 'https://github.com/example/data-science-toolkit', saved: false },
      { id: 'repo4', name: 'ml-algorithms', description: 'Implementation of common machine learning algorithms', stars: 4560, forks: 780, language: 'Python', url: 'https://github.com/example/ml-algorithms', saved: false },
      { id: 'repo5', name: 'web-dev-resources', description: 'Resources for web developers', stars: 3210, forks: 450, language: 'HTML', url: 'https://github.com/example/web-dev-resources', saved: false },
    ];
    
    setSearchResults(mockResults);
  };

  // Function to toggle saved status of a repository
  const toggleSaveRepo = (repoId: string) => {
    setSearchResults(prev => 
      prev.map(r => r.id === repoId ? {...r, saved: !r.saved} : r)
    );
  };

  // Function to apply filters
  const applyFilters = () => {
    // In a real implementation, this would filter the search results based on the filters
    // For now, we'll just log the filters
    console.log('Applying filters:', filters);
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">GitHub Discovery</h1>
      <p className="mb-4 text-gray-300">
        Discover interesting and useful GitHub projects. Search for repositories, get AI-powered recommendations,
        and save projects for later reference.
      </p>
      
      {/* Integration links */}
      <div className="mb-4 p-3 bg-gray-800 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Integrated Tools:</h2>
        <div className="flex flex-wrap gap-2">
          <a href="https://github.com/Zeeeepa/mcp-aas" target="_blank" rel="noopener noreferrer" 
             className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700">
            mcp-aas
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700/30 mb-4">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 flex items-center ${activeTab === 'chat' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Chat
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`px-4 py-2 flex items-center ${activeTab === 'search' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 flex items-center ${activeTab === 'saved' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Star className="w-4 h-4 mr-2" />
          Saved Projects
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'chat' && (
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            loading={loading} 
          />
        )}
        {activeTab === 'search' && (
          <div className="p-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Search GitHub Projects</h2>
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for repositories, topics, or keywords..."
                  className="flex-1 bg-gray-700 text-white p-2 rounded-l-md focus:outline-none"
                />
                <button 
                  className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none"
                  onClick={() => handleSearch(searchQuery)}
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Filters */}
            <div className="mb-4 p-3 bg-gray-800 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold flex items-center">
                  <Filter className="w-4 h-4 mr-1" /> Filters
                </h3>
                <button 
                  className="text-xs text-blue-400 hover:text-blue-300"
                  onClick={applyFilters}
                >
                  Apply Filters
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Language</label>
                  <select 
                    className="w-full bg-gray-700 text-white p-1.5 rounded-md"
                    value={filters.language}
                    onChange={(e) => setFilters({...filters, language: e.target.value})}
                  >
                    <option value="">Any</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="TypeScript">TypeScript</option>
                    <option value="Java">Java</option>
                    <option value="Go">Go</option>
                    <option value="Rust">Rust</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Minimum Stars</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-700 text-white p-1.5 rounded-md"
                    value={filters.minStars}
                    onChange={(e) => setFilters({...filters, minStars: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Sort By</label>
                  <select 
                    className="w-full bg-gray-700 text-white p-1.5 rounded-md"
                    value={filters.sort}
                    onChange={(e) => setFilters({...filters, sort: e.target.value})}
                  >
                    <option value="stars">Stars</option>
                    <option value="forks">Forks</option>
                    <option value="updated">Recently Updated</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Search Results */}
            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Github className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Enter a search query to find GitHub repositories.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.map(repo => (
                  <div key={repo.id} className="bg-gray-800 rounded-md p-4 border border-gray-700">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-blue-400">
                          <a href={repo.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
                            <Github className="w-4 h-4 mr-1" /> {repo.name}
                          </a>
                        </h3>
                        <p className="text-sm text-gray-300 mt-1">{repo.description}</p>
                      </div>
                      <button 
                        className={`${repo.saved ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-300`}
                        onClick={() => toggleSaveRepo(repo.id)}
                      >
                        <Star className="w-5 h-5" fill={repo.saved ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <div className="flex items-center mt-3 text-xs text-gray-400">
                      <span className="flex items-center mr-4">
                        <Star className="w-3 h-3 mr-1" /> {repo.stars.toLocaleString()}
                      </span>
                      <span className="flex items-center mr-4">
                        <GitFork className="w-3 h-3 mr-1" /> {repo.forks.toLocaleString()}
                      </span>
                      <span className="bg-gray-700 px-2 py-0.5 rounded-full">
                        {repo.language}
                      </span>
                    </div>
                    <div className="flex justify-end mt-3">
                      <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center">
                        <Eye className="w-3 h-3 mr-1" /> View Details
                      </button>
                      <button className="text-xs text-green-400 hover:text-green-300 ml-3 flex items-center">
                        <BookOpen className="w-3 h-3 mr-1" /> Explore Code
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === 'saved' && (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Saved Projects</h2>
            
            {searchResults.filter(r => r.saved).length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>You haven't saved any projects yet. Star projects to save them for later reference.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.filter(r => r.saved).map(repo => (
                  <div key={repo.id} className="bg-gray-800 rounded-md p-4 border border-gray-700">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-blue-400">
                          <a href={repo.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
                            <Github className="w-4 h-4 mr-1" /> {repo.name}
                          </a>
                        </h3>
                        <p className="text-sm text-gray-300 mt-1">{repo.description}</p>
                      </div>
                      <button 
                        className="text-yellow-400 hover:text-yellow-300"
                        onClick={() => toggleSaveRepo(repo.id)}
                      >
                        <Star className="w-5 h-5" fill="currentColor" />
                      </button>
                    </div>
                    <div className="flex items-center mt-3 text-xs text-gray-400">
                      <span className="flex items-center mr-4">
                        <Star className="w-3 h-3 mr-1" /> {repo.stars.toLocaleString()}
                      </span>
                      <span className="flex items-center mr-4">
                        <GitFork className="w-3 h-3 mr-1" /> {repo.forks.toLocaleString()}
                      </span>
                      <span className="bg-gray-700 px-2 py-0.5 rounded-full">
                        {repo.language}
                      </span>
                    </div>
                    <div className="flex justify-end mt-3">
                      <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center">
                        <Eye className="w-3 h-3 mr-1" /> View Details
                      </button>
                      <button className="text-xs text-green-400 hover:text-green-300 ml-3 flex items-center">
                        <BookOpen className="w-3 h-3 mr-1" /> Explore Code
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubDiscovery;