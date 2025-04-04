import React, { useState } from 'react';
import {
  FileCode,
  Search,
  Laptop,
  Database,
  Github,
  GitPullRequest
} from 'lucide-react';

// Import module pages
import ProjectDevelopment from './pages/ProjectDevelopment/main';
import KnowledgeBase from './pages/KnowledgeBase/main';
import ContinuousDataMining from './pages/ContinuousDataMining/main';
import CodebaseManage from './pages/CodebaseManage/main';
import GitHubProjectManagement from './pages/GitHubProjectManagement/main';
import DiscoveryProject from './pages/DiscoveryProject/main';

function App() {
  const [activeTab, setActiveTab] = useState<
    'project-development' |
    'knowledge-base' |
    'continuous-data-mining' |
    'codebase-manage' |
    'github-project-management' |
    'discovery-project'
  >('project-development');

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <div className="fixed h-full w-16 glass-card border-r border-gray-700/30 flex flex-col items-center py-4 space-y-4">
        <div className="group relative">
          <button
            onClick={() => setActiveTab('project-development')}
            className={`nav-button ${activeTab === 'project-development' ? 'active' : ''}`}
            title="Project Development"
          >
            <FileCode className="w-6 h-6" />
          </button>
          <div className="absolute left-16 transform -translate-y-1/2 top-1/2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
            Project Development
          </div>
        </div>

        <div className="group relative">
          <button
            onClick={() => setActiveTab('knowledge-base')}
            className={`nav-button ${activeTab === 'knowledge-base' ? 'active' : ''}`}
            title="Knowledge Base"
          >
            <Database className="w-6 h-6" />
          </button>
          <div className="absolute left-16 transform -translate-y-1/2 top-1/2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
            Knowledge Base
          </div>
        </div>

        <div className="group relative">
          <button
            onClick={() => setActiveTab('continuous-data-mining')}
            className={`nav-button ${activeTab === 'continuous-data-mining' ? 'active' : ''}`}
            title="Continuous Data Mining"
          >
            <Search className="w-6 h-6" />
          </button>
          <div className="absolute left-16 transform -translate-y-1/2 top-1/2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
            Continuous Data Mining
          </div>
        </div>

        <div className="group relative">
          <button
            onClick={() => setActiveTab('codebase-manage')}
            className={`nav-button ${activeTab === 'codebase-manage' ? 'active' : ''}`}
            title="Codebase Management"
          >
            <Laptop className="w-6 h-6" />
          </button>
          <div className="absolute left-16 transform -translate-y-1/2 top-1/2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
            Codebase Management
          </div>
        </div>

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
        {activeTab === 'project-development' && <ProjectDevelopment />}
        {activeTab === 'knowledge-base' && <KnowledgeBase />}
        {activeTab === 'continuous-data-mining' && <ContinuousDataMining />}
        {activeTab === 'codebase-manage' && <CodebaseManage />}
        {activeTab === 'github-project-management' && <GitHubProjectManagement />}
        {activeTab === 'discovery-project' && <DiscoveryProject />}
      </div>
    </div>
  );
}

export default App;
