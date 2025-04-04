import React, { useState, useEffect } from 'react';
import { Search, Code, FileText, GitBranch, GitPullRequest, Zap, Database, Layers, GitCommit, Users } from 'lucide-react';

// Import components
import SearchBar from './components/SearchBar';
import SemanticCodeSearch from './components/SemanticCodeSearch';
import ProjectReadme from './components/ProjectReadme';
import RelatedRepos from './components/RelatedRepos';
import { initializeOctokit, getPopularRepositories, GitHubRepo } from './utils/github';

const DiscoveryProject: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'semantic' | 'readme' | 'related' | 'insights' | 'architecture'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GitHubRepo[]>([]);
  const [selectedProject, setSelectedProject] = useState<GitHubRepo | null>(null);
  const [trendingRepos, setTrendingRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize GitHub API
    initializeOctokit();
    
    // Fetch trending repositories
    const fetchTrendingRepos = async () => {
      setIsLoading(true);
      try {
        const repos = await getPopularRepositories('', 5);
        setTrendingRepos(repos);
      } catch (error) {
        console.error('Error fetching trending repositories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrendingRepos();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would call the GitHub API
      // For now, we'll use mock data
      const mockResults: GitHubRepo[] = [
        {
          id: 1,
          name: "react",
          full_name: "facebook/react",
          description: "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
          html_url: "https://github.com/facebook/react",
          stargazers_count: 178000,
          forks_count: 36000,
          watchers_count: 6500,
          language: "JavaScript",
          owner: {
            login: "facebook",
            avatar_url: "https://github.com/facebook.png"
          },
          created_at: "2013-05-24T16:15:54Z",
          updated_at: "2023-03-15T12:43:21Z",
          open_issues_count: 1200,
          topics: ["javascript", "react", "frontend", "ui"]
        },
        {
          id: 2,
          name: "tensorflow",
          full_name: "tensorflow/tensorflow",
          description: "An Open Source Machine Learning Framework for Everyone",
          html_url: "https://github.com/tensorflow/tensorflow",
          stargazers_count: 165000,
          forks_count: 87000,
          watchers_count: 9800,
          language: "C++",
          owner: {
            login: "tensorflow",
            avatar_url: "https://github.com/tensorflow.png"
          },
          created_at: "2015-11-07T01:19:20Z",
          updated_at: "2023-03-16T09:12:45Z",
          open_issues_count: 2500,
          topics: ["machine-learning", "deep-learning", "ai", "python"]
        }
      ];
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Error searching repositories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Discovery Project</h1>
        
        {selectedProject && (
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Viewing:</span>
            <span className="font-medium text-indigo-400">{selectedProject.full_name}</span>
          </div>
        )}
      </div>
      
      <p className="mb-6 text-gray-300">
        Discover and explore projects with advanced code search, architecture visualization, and repository insights.
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
          onClick={() => setActiveTab('semantic')}
          className={`px-4 py-2 flex items-center whitespace-nowrap ${activeTab === 'semantic' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <Code className="w-4 h-4 mr-2" />
          Semantic Code Search
        </button>
        <button
          onClick={() => setActiveTab('readme')}
          className={`px-4 py-2 flex items-center whitespace-nowrap ${activeTab === 'readme' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <FileText className="w-4 h-4 mr-2" />
          Project Explorer
        </button>
        <button
          onClick={() => setActiveTab('related')}
          className={`px-4 py-2 flex items-center whitespace-nowrap ${activeTab === 'related' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <GitBranch className="w-4 h-4 mr-2" />
          Related Repositories
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-2 flex items-center whitespace-nowrap ${activeTab === 'architecture' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <Layers className="w-4 h-4 mr-2" />
          Architecture
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2 flex items-center whitespace-nowrap ${activeTab === 'insights' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
        >
          <Zap className="w-4 h-4 mr-2" />
          Insights
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="relative">
              <SearchBar 
                placeholder="Search for repositories (e.g., 'react', 'machine learning', 'web framework')..." 
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
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {searchResults.length > 0 && (
                  <div className="space-y-4 mt-6">
                    <h2 className="text-xl font-semibold">Search Results</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {searchResults.map(result => (
                        <div 
                          key={result.id} 
                          className="glass-card p-4 rounded-xl cursor-pointer hover:bg-gray-800/50 transition-colors"
                          onClick={() => setSelectedProject(result)}
                        >
                          <div className="flex items-center">
                            <img 
                              src={result.owner.avatar_url} 
                              alt={`${result.owner.login}'s avatar`}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <h3 className="text-lg font-medium text-blue-400">{result.full_name}</h3>
                          </div>
                          <p className="text-gray-300 mt-2">{result.description}</p>
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <GitBranch className="w-4 h-4 text-gray-500" />
                              <span>{result.forks_count.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span>{result.watchers_count.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <GitPullRequest className="w-4 h-4 text-gray-500" />
                              <span>{result.open_issues_count.toLocaleString()}</span>
                            </div>
                            {result.language && (
                              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                                {result.language}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {!searchResults.length && (
                  <div className="space-y-6 mt-6">
                    <h2 className="text-xl font-semibold">Trending Repositories</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {trendingRepos.map(repo => (
                        <div 
                          key={repo.id} 
                          className="glass-card p-4 rounded-xl cursor-pointer hover:bg-gray-800/50 transition-colors"
                          onClick={() => setSelectedProject(repo)}
                        >
                          <div className="flex items-center">
                            <img 
                              src={repo.owner.avatar_url} 
                              alt={`${repo.owner.login}'s avatar`}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <h3 className="text-lg font-medium text-blue-400">{repo.full_name}</h3>
                          </div>
                          <p className="text-gray-300 mt-2">{repo.description}</p>
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <GitBranch className="w-4 h-4 text-gray-500" />
                              <span>{repo.forks_count.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span>{repo.watchers_count.toLocaleString()}</span>
                            </div>
                            {repo.language && (
                              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                                {repo.language}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        
        {activeTab === 'semantic' && <SemanticCodeSearch projectPath={selectedProject?.full_name} />}
        
        {activeTab === 'readme' && (
          selectedProject ? (
            <ProjectReadme 
              owner={selectedProject.owner.login} 
              repo={selectedProject.name} 
              onBack={() => setSelectedProject(null)} 
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <FileText className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No project selected</h3>
              <p>Search for a project or select one from trending repositories</p>
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
                  description: "A related project with similar functionality",
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
              onSelectRepo={(repo) => {
                setSelectedProject(repo);
                setActiveTab('readme');
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <GitBranch className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No project selected</h3>
              <p>Select a project to view related repositories</p>
            </div>
          )
        )}
        
        {activeTab === 'architecture' && (
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <Layers className="w-5 h-5 text-indigo-400 mr-2" />
              <h2 className="text-xl font-semibold">Architecture Visualization</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Visualize the architecture and dependencies of the selected repository.
            </p>
            
            {selectedProject ? (
              <div className="border border-gray-700/30 rounded-lg p-6 bg-gray-900/50">
                <div className="flex justify-center items-center h-64">
                  <div className="text-center">
                    <Layers className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">Architecture visualization for {selectedProject.name}</p>
                    <p className="text-gray-500 text-sm">
                      In a real implementation, this would show an interactive dependency graph or architecture diagram.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a repository to visualize its architecture</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'insights' && (
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <Zap className="w-5 h-5 text-yellow-400 mr-2" />
              <h2 className="text-xl font-semibold">Repository Insights</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Analyze repository activity, contributors, and code quality metrics.
            </p>
            
            {selectedProject ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-700/30 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">Activity</h3>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <GitCommit className="w-5 h-5 text-blue-400" />
                      <span>Last updated {new Date(selectedProject.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-700/30 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">Contributors</h3>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Users className="w-5 h-5 text-green-400" />
                      <span>Active community with regular contributions</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-700/30 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">Code Quality</h3>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Code className="w-5 h-5 text-purple-400" />
                      <span>Well-maintained codebase with good test coverage</span>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-700/30 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Commit Activity</h3>
                  <div className="h-40 flex items-center justify-center">
                    <p className="text-gray-400">
                      In a real implementation, this would show a commit activity graph.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a repository to view insights</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoveryProject;
