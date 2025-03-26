import React, { useState, useEffect } from 'react';
import { Search, Folder, FolderOpen, Code, FileText, Tag, Zap, Database, RefreshCw, GitBranch, GitCommit, GitPullRequest, Eye, Star, GitFork } from 'lucide-react';
import { 
  indexLocalProjects, 
  searchLocalProjects, 
  getLocalProjectDetails, 
  analyzeProjectWithMcp,
  LocalProject,
  ProjectAnalysis
} from '../utils/localProjects';

interface LocalProjectDiscoveryProps {
  onSelectProject: (project: LocalProject) => void;
}

export default function LocalProjectDiscovery({ onSelectProject }: LocalProjectDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<LocalProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const [selectedProject, setSelectedProject] = useState<LocalProject | null>(null);
  const [projectAnalysis, setProjectAnalysis] = useState<ProjectAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'recent' | 'analyzed'>('recent');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [popularKeywords, setPopularKeywords] = useState<{keyword: string, count: number}[]>([]);

  useEffect(() => {
    loadProjects();
    extractPopularKeywords();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const localProjects = await indexLocalProjects();
      setProjects(localProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const extractPopularKeywords = () => {
    // Extract keywords from projects and count occurrences
    const keywordCounts: Record<string, number> = {};
    
    projects.forEach(project => {
      project.keywords?.forEach(keyword => {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
      });
      
      // Also consider topics as keywords
      project.topics?.forEach(topic => {
        keywordCounts[topic] = (keywordCounts[topic] || 0) + 1;
      });
    });
    
    // Convert to array and sort by count
    const sortedKeywords = Object.entries(keywordCounts)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15); // Take top 15
    
    setPopularKeywords(sortedKeywords);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() && selectedKeywords.length === 0) return;
    
    setIsLoading(true);
    try {
      const results = await searchLocalProjects(searchQuery, selectedKeywords);
      setProjects(results);
    } catch (error) {
      console.error('Error searching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleProjectSelect = async (project: LocalProject) => {
    setSelectedProject(project);
    
    try {
      const details = await getLocalProjectDetails(project.path);
      setSelectedProject(prev => prev ? { ...prev, ...details } : null);
      
      // Analyze with MCP if not already analyzed
      if (!project.analyzed) {
        analyzeProject(project);
      } else if (project.analysis) {
        setProjectAnalysis(project.analysis);
      }
    } catch (error) {
      console.error('Error getting project details:', error);
    }
    
    onSelectProject(project);
  };

  const analyzeProject = async (project: LocalProject) => {
    try {
      setIsLoading(true);
      const analysis = await analyzeProjectWithMcp(project.path);
      setProjectAnalysis(analysis);
      
      // Update the project in the list
      setProjects(prev => 
        prev.map(p => 
          p.id === project.id 
            ? { ...p, analyzed: true, analysis } 
            : p
        )
      );
      
      // Update selected project
      setSelectedProject(prev => 
        prev && prev.id === project.id 
          ? { ...prev, analyzed: true, analysis } 
          : prev
      );
    } catch (error) {
      console.error('Error analyzing project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const reindexProjects = async () => {
    setIsIndexing(true);
    try {
      await loadProjects();
      extractPopularKeywords();
    } finally {
      setIsIndexing(false);
    }
  };

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap space-x-2 border-b border-gray-700/30">
        <button
          onClick={() => setActiveTab('recent')}
          className={`pb-2 px-4 transition-colors flex items-center space-x-2 ${
            activeTab === 'recent'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>Recent Projects</span>
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`pb-2 px-4 transition-colors flex items-center space-x-2 ${
            activeTab === 'search'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
        <button
          onClick={() => setActiveTab('analyzed')}
          className={`pb-2 px-4 transition-colors flex items-center space-x-2 ${
            activeTab === 'analyzed'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Analyzed</span>
        </button>
        <button
          onClick={reindexProjects}
          className="ml-auto pb-2 px-4 transition-colors flex items-center space-x-2 text-gray-400 hover:text-white"
          disabled={isIndexing}
        >
          <RefreshCw className={`w-4 h-4 ${isIndexing ? 'animate-spin' : ''}`} />
          <span>Reindex</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4">
        {activeTab === 'search' && (
          <>
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search local projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="search-input"
                />
              </div>
            </div>
            <button 
              onClick={handleSearch}
              className="btn-primary"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </>
        )}
      </div>

      {/* Keywords/Topics */}
      {activeTab === 'search' && popularKeywords.length > 0 && (
        <div className="w-full">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Popular Keywords:</h3>
          <div className="flex flex-wrap gap-2">
            {popularKeywords.map(({ keyword, count }) => (
              <button
                key={keyword}
                onClick={() => toggleKeyword(keyword)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedKeywords.includes(keyword)
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                    : 'bg-gray-700/30 text-gray-300 border border-gray-600/30 hover:bg-gray-700/50'
                }`}
              >
                {keyword} ({count})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects
            .filter(project => {
              if (activeTab === 'analyzed') {
                return project.analyzed;
              }
              return true;
            })
            .map((project) => (
              <div
                key={project.id}
                className="glass-card p-6 rounded-xl space-y-4 cursor-pointer hover:scale-[1.02] transition-all duration-300"
                onClick={() => handleProjectSelect(project)}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-800/50 rounded-lg">
                    <Folder className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                    <div className="text-xs text-gray-400">{project.path}</div>
                  </div>
                </div>

                <p className="text-gray-400 line-clamp-2">{project.description || 'No description available'}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  {project.stats && (
                    <>
                      <span className="flex items-center space-x-1">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span>{project.stats.files.toLocaleString()} files</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Code className="w-4 h-4 text-green-400" />
                        <span>{project.stats.loc.toLocaleString()} LOC</span>
                      </span>
                    </>
                  )}
                  {project.analyzed && (
                    <span className="flex items-center space-x-1 ml-auto">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span>Analyzed</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.language && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      {project.language}
                    </span>
                  )}
                  {project.keywords?.slice(0, 3).map(keyword => (
                    <span key={keyword} className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {keyword}
                    </span>
                  ))}
                </div>

                {project.lastModified && (
                  <div className="text-xs text-gray-500">
                    Updated: {new Date(project.lastModified).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Database className="w-16 h-16 mb-4 text-gray-600" />
          <p className="text-lg">No projects found</p>
          <p className="text-sm mt-2">Try adjusting your search or indexing your projects</p>
          <button 
            onClick={reindexProjects}
            className="btn-secondary mt-4"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Index Projects</span>
          </button>
        </div>
      )}
    </div>
  );
}