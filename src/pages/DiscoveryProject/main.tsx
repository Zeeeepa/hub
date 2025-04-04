import React, { useState } from 'react';
import { Search, Code, FileText, GitBranch } from 'lucide-react';

// Import components
import SearchBar from './components/SearchBar';
import SemanticCodeSearch from './components/SemanticCodeSearch';
import ProjectReadme from './components/ProjectReadme';
import RelatedRepos from './components/RelatedRepos';

const DiscoveryProject: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'semantic' | 'readme' | 'related'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const handleSearch = (query: string) => {
    // Simulate search results
    console.log(`Searching for: ${query}`);
    // In a real implementation, this would call an API
    setSearchResults([
      { id: 1, name: 'Example Project 1', description: 'This is an example project' },
      { id: 2, name: 'Example Project 2', description: 'Another example project' }
    ]);
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">Discovery Project</h1>
      <p className="mb-4 text-gray-300">
        Discover and explore projects. Search for code, view project documentation, and find related repositories.
      </p>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-700/30 mb-4">
        <button
          onClick={() => setActiveTab('search')}
          className={`px-4 py-2 flex items-center ${activeTab === 'search' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Search className="w-4 h-4 mr-2" />
          Basic Search
        </button>
        <button
          onClick={() => setActiveTab('semantic')}
          className={`px-4 py-2 flex items-center ${activeTab === 'semantic' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Code className="w-4 h-4 mr-2" />
          Semantic Code Search
        </button>
        <button
          onClick={() => setActiveTab('readme')}
          className={`px-4 py-2 flex items-center ${activeTab === 'readme' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <FileText className="w-4 h-4 mr-2" />
          Project README
        </button>
        <button
          onClick={() => setActiveTab('related')}
          className={`px-4 py-2 flex items-center ${activeTab === 'related' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <GitBranch className="w-4 h-4 mr-2" />
          Related Repositories
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'search' && (
          <div className="space-y-4">
            <div className="relative">
              <SearchBar 
                placeholder="Search for projects..." 
                value={searchQuery} 
                onChange={setSearchQuery} 
                className="w-full"
              />
              <button 
                onClick={() => handleSearch(searchQuery)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md"
              >
                Search
              </button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="space-y-4 mt-6">
                <h2 className="text-xl font-semibold">Search Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map(result => (
                    <div 
                      key={result.id} 
                      className="glass-card p-4 rounded-xl cursor-pointer hover:bg-gray-800/50 transition-colors"
                      onClick={() => setSelectedProject(result)}
                    >
                      <h3 className="text-lg font-medium">{result.name}</h3>
                      <p className="text-gray-400">{result.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'semantic' && <SemanticCodeSearch />}
        {activeTab === 'readme' && (
          selectedProject ? (
            <ProjectReadme owner="Zeeeepa" repo="hub" onBack={() => setSelectedProject(null)} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <FileText className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No project selected</h3>
              <p>Search for a project or select one from your saved repositories</p>
            </div>
          )
        )}
        {activeTab === 'related' && (
          selectedProject ? (
            <RelatedRepos 
              repos={[
                {
                  id: 3,
                  name: "Related Project 1",
                  full_name: "user/related-project-1",
                  description: "A related project",
                  html_url: "https://github.com/user/related-project-1",
                  stargazers_count: 120,
                  forks_count: 30,
                  watchers_count: 15,
                  language: "TypeScript",
                  owner: {
                    login: "user",
                    avatar_url: "https://github.com/github.png"
                  },
                  created_at: "2023-01-01",
                  updated_at: "2023-06-01",
                  open_issues_count: 5,
                  topics: ["react", "typescript"]
                }
              ]} 
              title="Related Repositories" 
              emptyMessage="No related repositories found" 
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <GitBranch className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No project selected</h3>
              <p>Select a project to view related repositories</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DiscoveryProject;
