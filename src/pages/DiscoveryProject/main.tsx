import React, { useState } from 'react';
import { Search, Code, FileText, GitBranch } from 'lucide-react';

// Import components
import SearchBar from './components/SearchBar';
import SemanticCodeSearch from './components/SemanticCodeSearch';
import ProjectReadme from './components/ProjectReadme';
import RelatedRepos from './components/RelatedRepos';

const DiscoveryProject: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'semantic' | 'readme' | 'related'>('search');
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
        {activeTab === 'search' && <SearchBar onSearch={handleSearch} results={searchResults} onSelectProject={setSelectedProject} />}
        {activeTab === 'semantic' && <SemanticCodeSearch />}
        {activeTab === 'readme' && <ProjectReadme project={selectedProject} />}
        {activeTab === 'related' && <RelatedRepos project={selectedProject} />}
      </div>
    </div>
  );
};

export default DiscoveryProject;
