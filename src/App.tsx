import React, { useState } from 'react';
import {
  Github,
  GitPullRequest
} from 'lucide-react';

// Import module pages
import GitHubProjectManagement from './pages/GitHubProjectManagement/main';
import DiscoveryProject from './pages/DiscoveryProject/main';

function App() {
  const [activeTab, setActiveTab] = useState<
    'github-project-management' |
    'discovery-project'
  >('github-project-management');

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <div className="fixed h-full w-16 glass-card border-r border-gray-700/30 flex flex-col items-center py-4 space-y-4">
        <div className="group relative">
          <button
            onClick={() => setActiveTab('github-project-management')}
            className={`nav-button ${activeTab === 'github-project-management' ? 'active' : ''}`}
            title="GitHub Project Management"
          >
            <Github className="w-6 h-6" />
          </button>
          <div className="absolute left-16 transform -translate-y-1/2 top-1/2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
            GitHub Project Management
          </div>
        </div>

        <div className="group relative">
          <button
            onClick={() => setActiveTab('discovery-project')}
            className={`nav-button ${activeTab === 'discovery-project' ? 'active' : ''}`}
            title="Discovery Project"
          >
            <GitPullRequest className="w-6 h-6" />
          </button>
          <div className="absolute left-16 transform -translate-y-1/2 top-1/2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
            Discovery Project
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-16 p-8">
        {activeTab === 'github-project-management' && <GitHubProjectManagement />}
        {activeTab === 'discovery-project' && <DiscoveryProject />}
      </div>
    </div>
  );
}

export default App;
