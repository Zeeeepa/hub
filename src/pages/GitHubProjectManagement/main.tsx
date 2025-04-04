import React, { useState } from 'react';
import { Search, Settings, Github, Database } from 'lucide-react';

// Import components
import GitHubSearch from './components/GitHubSearch';
import GitHubSettings from './components/GitHubSettings';
import SavedRepositories from './components/SavedRepositories';

const GitHubProjectManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'saved' | 'settings'>('search');
  const [selectedRepo, setSelectedRepo] = useState<any>(null);

  const handleSelectRepo = (repo: any) => {
    setSelectedRepo(repo);
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">GitHub Project Management</h1>
      <p className="mb-4 text-gray-300">
        Search, discover, and manage GitHub repositories. Save repositories for later reference and configure GitHub settings.
      </p>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-700/30 mb-4">
        <button
          onClick={() => setActiveTab('search')}
          className={`px-4 py-2 flex items-center ${activeTab === 'search' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Search className="w-4 h-4 mr-2" />
          Search Repositories
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 flex items-center ${activeTab === 'saved' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Database className="w-4 h-4 mr-2" />
          Saved Repositories
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 flex items-center ${activeTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Settings className="w-4 h-4 mr-2" />
          GitHub Settings
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'search' && <GitHubSearch onSelectRepo={handleSelectRepo} />}
        {activeTab === 'saved' && <SavedRepositories onSelectRepo={handleSelectRepo} />}
        {activeTab === 'settings' && <GitHubSettings />}
      </div>
    </div>
  );
};

export default GitHubProjectManagement;
