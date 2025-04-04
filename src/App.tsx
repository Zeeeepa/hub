import React, { useState } from 'react';
import {
  Github,
  Settings,
  Laptop,
  BookOpen,
  BrainCircuit,
  FileCode,
  Search,
  Database
} from 'lucide-react';

// Import pages
import GitHubProjects from './pages/GitHubProjects';
import Knowledgebase from './pages/Knowledgebase';
import AgentStudio from './pages/AgentStudio';
import SettingsPage from './pages/Settings';
import ProjectPlanner from './pages/ProjectPlanner';

// Import module pages
import ProjectDevelopment from './pages/modules/ProjectDevelopment';
import KnowledgeBase from './pages/modules/KnowledgeBase';
import ContinuousDataMining from './pages/modules/ContinuousDataMining';
import CodebaseManage from './pages/modules/CodebaseManage';
import GitHubDiscovery from './pages/modules/GitHubDiscovery';

function App() {
  const [activeTab, setActiveTab] = useState<
    'github-projects' | 
    'knowledgebase' | 
    'agent-studio' | 
    'project-planner' | 
    'settings' |
    'project-development' |
    'knowledge-base' |
    'continuous-data-mining' |
    'codebase-manage' |
    'github-discovery'
  >('github-projects');

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <div className="fixed h-full w-16 glass-card border-r border-gray-700/30 flex flex-col items-center py-4 space-y-4">
        <div className="group relative">
          <button
            onClick={() => setActiveTab('github-projects')}
            className={`nav-button ${activeTab === 'github-projects' ? 'active' : ''}`}
            title="GitHub Projects"
          >
            <Github className="w-6 h-6" />
          </button>
          <div className="absolute left-16 transform -translate-y-1/2 top-1/2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
            GitHub Projects
          </div>
        </div>

        <div className="group relative">
          <button
            onClick={() => setActiveTab('knowledgebase')}
            className={`nav-button ${activeTab === 'knowledgebase' ? 'active' : ''}`}
            title="Knowledgebase"
          >
            <BookOpen className="w-6 h-6" />
          </button>
          <div className="absolute left-16 transform -translate-y-1/2 top-1/2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
            Knowledgebase
          </div>
        </div>

        <div className="group relative">
          <button
            onClick={() => setActiveTab('agent-studio')}
            className={`nav-button ${activeTab === 'agent-studio' ? 'active' : ''}`}
            title="Agent Studio"
          >
            <BrainCircuit className="w-6 h-6" />
          </button>
          <div className="absolute left-16 transform -translate-y-1/2 top-1/2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
            Agent Studio
          </div>
        </div>

        <div className="group relative">
          <button
            onClick={() => setActiveTab('project-planner')}
            className={`nav-button ${activeTab === 'project-planner' ? 'active' : ''}`}
            title="Project Planner"
          >
            <FileCode className="w-6 h-6" />
          </button>
          <div className="absolute left-16 transform -translate-y-1/2 top-1/2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
            Project Planner
          </div>
        </div>

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
            onClick={() => setActiveTab('github-discovery')}
            className={`nav-button ${activeTab === 'github-discovery' ? 'active' : ''}`}
            title="GitHub Discovery"
          >
            <Github className="w-6 h-6" />
          </button>
          <div className="absolute left-16 transform -translate-y-1/2 top-1/2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
            GitHub Discovery
          </div>
        </div>

        <div className="group relative">
          <button
            onClick={() => setActiveTab('settings')}
            className={`nav-button ${activeTab === 'settings' ? 'active' : ''}`}
            title="Settings"
          >
            <Settings className="w-6 h-6" />
          </button>
          <div className="absolute left-16 transform -translate-y-1/2 top-1/2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
            Settings
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-16 p-8">
        {activeTab === 'github-projects' && <GitHubProjects />}
        {activeTab === 'knowledgebase' && <Knowledgebase />}
        {activeTab === 'agent-studio' && <AgentStudio />}
        {activeTab === 'project-planner' && <ProjectPlanner />}
        {activeTab === 'settings' && <SettingsPage />}
        
        {activeTab === 'project-development' && <ProjectDevelopment />}
        {activeTab === 'knowledge-base' && <KnowledgeBase />}
        {activeTab === 'continuous-data-mining' && <ContinuousDataMining />}
        {activeTab === 'codebase-manage' && <CodebaseManage />}
        {activeTab === 'github-discovery' && <GitHubDiscovery />}
      </div>
    </div>
  );
}

export default App;
