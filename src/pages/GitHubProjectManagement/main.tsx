import React, { useState, useEffect } from 'react';
import { Search, Settings, Github, Database, GitBranch, GitPullRequest, Users, Star, Activity, Zap } from 'lucide-react';

// Import components
import GitHubSearch from './components/GitHubSearch';
import GitHubSettings from './components/GitHubSettings';
import SavedRepositories from './components/SavedRepositories';
import { initializeOctokit, getUserProfile } from './utils/github';

const GitHubProjectManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'saved' | 'settings' | 'projects' | 'prs' | 'issues'>('search');
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize GitHub API
    initializeOctokit();
    
    // Fetch user profile if token exists
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  const handleSelectRepo = (repo: any) => {
    setSelectedRepo(repo);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">GitHub Project Management</h1>
        
        {userProfile && (
          <div className="flex items-center space-x-2">
            <img 
              src={userProfile.avatar_url} 
              alt={`${userProfile.name}'s avatar`}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-gray-300">{userProfile.name}</span>
          </div>
        )}
      </div>
      
      <p className="mb-6 text-gray-300">
        Comprehensive GitHub project management with advanced repository discovery, issue tracking, and PR management.
      </p>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-700/30 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('search')}
          className={`px-4 py-2 flex items-center whitespace-nowrap ${activeTab === 'search' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <Search className="w-4 h-4 mr-2" />
          Repository Search
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 flex items-center whitespace-nowrap ${activeTab === 'saved' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <Star className="w-4 h-4 mr-2" />
          Saved Repositories
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 flex items-center whitespace-nowrap ${activeTab === 'projects' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <GitBranch className="w-4 h-4 mr-2" />
          Projects
        </button>
        <button
          onClick={() => setActiveTab('issues')}
          className={`px-4 py-2 flex items-center whitespace-nowrap ${activeTab === 'issues' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <Activity className="w-4 h-4 mr-2" />
          Issues
        </button>
        <button
          onClick={() => setActiveTab('prs')}
          className={`px-4 py-2 flex items-center whitespace-nowrap ${activeTab === 'prs' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <GitPullRequest className="w-4 h-4 mr-2" />
          Pull Requests
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 flex items-center whitespace-nowrap ${activeTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'search' && <GitHubSearch onSelectRepo={handleSelectRepo} />}
        {activeTab === 'saved' && <SavedRepositories onSelectRepo={handleSelectRepo} />}
        {activeTab === 'settings' && <GitHubSettings />}
        {activeTab === 'projects' && (
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <GitBranch className="w-5 h-5 text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold">GitHub Projects</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Manage your GitHub projects, track progress, and organize tasks.
            </p>
            
            {userProfile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-700/30 rounded-lg p-4 hover:bg-gray-800/50 transition-all duration-200">
                  <h3 className="font-medium text-lg mb-2">Project Dashboard</h3>
                  <p className="text-gray-400 text-sm mb-4">View and manage your GitHub projects in one place.</p>
                  <div className="flex justify-end">
                    <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
                      View Projects
                    </button>
                  </div>
                </div>
                
                <div className="border border-gray-700/30 rounded-lg p-4 hover:bg-gray-800/50 transition-all duration-200">
                  <h3 className="font-medium text-lg mb-2">Create New Project</h3>
                  <p className="text-gray-400 text-sm mb-4">Set up a new GitHub project board for your repository.</p>
                  <div className="flex justify-end">
                    <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm">
                      Create Project
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Sign in with GitHub to manage your projects</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'issues' && (
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <Activity className="w-5 h-5 text-yellow-400 mr-2" />
              <h2 className="text-xl font-semibold">Issue Tracking</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Track and manage issues across your repositories.
            </p>
            
            {userProfile ? (
              <div className="space-y-4">
                <div className="flex justify-between mb-4">
                  <div className="flex space-x-2">
                    <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm">
                      All Issues
                    </button>
                    <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md text-sm">
                      Assigned to me
                    </button>
                    <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md text-sm">
                      Created by me
                    </button>
                  </div>
                  <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm flex items-center">
                    <Zap className="w-4 h-4 mr-1" />
                    New Issue
                  </button>
                </div>
                
                <div className="border border-gray-700/30 rounded-lg divide-y divide-gray-700/30">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 hover:bg-gray-800/50 transition-all duration-200">
                      <div className="flex items-start">
                        <div className="w-5 h-5 rounded-full bg-green-500 mt-1 mr-3"></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-blue-400 hover:text-blue-300 cursor-pointer">
                            Example issue #{i}: Implement new feature
                          </h4>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <span>Opened 3 days ago</span>
                            <span className="mx-2">•</span>
                            <span>4 comments</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                            enhancement
                          </div>
                          <div className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                            good first issue
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Sign in with GitHub to view issues</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'prs' && (
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <GitPullRequest className="w-5 h-5 text-indigo-400 mr-2" />
              <h2 className="text-xl font-semibold">Pull Requests</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Manage pull requests across your repositories.
            </p>
            
            {userProfile ? (
              <div className="space-y-4">
                <div className="flex justify-between mb-4">
                  <div className="flex space-x-2">
                    <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm">
                      All Pull Requests
                    </button>
                    <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md text-sm">
                      Created by me
                    </button>
                    <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md text-sm">
                      Review requests
                    </button>
                  </div>
                  <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm flex items-center">
                    <GitPullRequest className="w-4 h-4 mr-1" />
                    New Pull Request
                  </button>
                </div>
                
                <div className="border border-gray-700/30 rounded-lg divide-y divide-gray-700/30">
                  {[1, 2].map(i => (
                    <div key={i} className="p-4 hover:bg-gray-800/50 transition-all duration-200">
                      <div className="flex items-start">
                        <div className="w-5 h-5 rounded-full bg-indigo-500 mt-1 mr-3"></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-blue-400 hover:text-blue-300 cursor-pointer">
                            Example PR #{i}: Add new feature implementation
                          </h4>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <span>Opened 2 days ago</span>
                            <span className="mx-2">•</span>
                            <span>3 commits</span>
                            <span className="mx-2">•</span>
                            <span>2 changed files</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full text-xs">
                            ready to merge
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Sign in with GitHub to view pull requests</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubProjectManagement;
