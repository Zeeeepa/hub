import React, { useState, useEffect } from 'react';
import { 
  Github, 
  Settings, 
  Search, 
  Plus, 
  Trash2, 
  FolderSync, 
  Save,
  GitFork,
  Star,
  Eye,
  Activity,
  Clock,
  Code,
  GitBranch as Branch,
  GitCommit,
  Users,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Tag,
  FolderOpen
} from 'lucide-react';
import CategoryDialog from './components/CategoryDialog';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import GitHubSettings from './components/GitHubSettings';
import AddProjectDialog from './components/AddProjectDialog';
import { v4 as uuidv4 } from 'uuid';
import { getSaveLocation, setSaveLocation, getProjects, setProjects, getCategories, setCategories } from './utils/store';
import { searchRepositories, getTrendingRepositories, GitHubRepo } from './utils/github';

type Category = {
  id: string;
  name: string;
  color: string;
};

type Project = {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  logo?: string;
  stats: {
    stars: number;
    forks: number;
    watchers: number;
    issues: number;
  };
  lastActivity: string;
  contributors: number;
  branches: number;
  commits: number;
  categories: Category[];
  languages: { name: string; percentage: number }[];
};

function App() {
  const [activeTab, setActiveTab] = useState<'projects' | 'settings'>('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [saveLocation, setSaveLocationState] = useState(getSaveLocation());
  const [githubSearch, setGithubSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [projects, setProjectsState] = useState<Project[]>(getProjects() || []);
  const [githubResults, setGithubResults] = useState<GitHubRepo[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [globalCategories, setGlobalCategories] = useState<Category[]>(
    getCategories() || []
  );

  useEffect(() => {
    setProjects(projects);
  }, [projects]);

  useEffect(() => {
    setCategories(globalCategories);
  }, [globalCategories]);

  useEffect(() => {
    const searchGitHub = async () => {
      if (githubSearch.trim()) {
        setIsSearching(true);
        const results = await searchRepositories(githubSearch);
        setGithubResults(results);
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchGitHub, 500);
    return () => clearTimeout(debounce);
  }, [githubSearch]);

  const addProject = (project: Project) => {
    setProjectsState(prev => [...prev, project]);
  };

  const removeProject = (id: string) => {
    setProjectsState(prev => prev.filter(p => p.id !== id));
  };

  const addCategory = (category: Category) => {
    if (selectedProject) {
      const updatedProjects = projects.map(project => {
        if (project.id === selectedProject.id) {
          return {
            ...project,
            categories: [...(project.categories || []), category]
          };
        }
        return project;
      });
      setProjectsState(updatedProjects);
      setSelectedProject({
        ...selectedProject,
        categories: [...(selectedProject.categories || []), category]
      });
      
      if (!globalCategories.find(c => c.name === category.name)) {
        setGlobalCategories([...globalCategories, category]);
      }
    }
  };

  const removeCategory = (categoryId: string) => {
    if (selectedProject) {
      const updatedProjects = projects.map(project => {
        if (project.id === selectedProject.id) {
          return {
            ...project,
            categories: (project.categories || []).filter(c => c.id !== categoryId)
          };
        }
        return project;
      });
      setProjects(updatedProjects);
      setSelectedProject({
        ...selectedProject,
        categories: (selectedProject.categories || []).filter(c => c.id !== categoryId)
      });
    }
  };

  const handleSaveLocationChange = (path: string) => {
    setSaveLocation(path);
    setSaveLocationState(path);
  };

  const toggleCategoryFilter = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
                         project.description.toLowerCase().includes(projectSearch.toLowerCase());
    
    const matchesCategories = selectedCategories.length === 0 ||
                             selectedCategories.every(catId => 
                               project.categories?.some(c => c.id === catId)
                             );
    
    return matchesSearch && matchesCategories;
  });

  const ProjectCard = ({ project }: { project: Project }) => (
    <div className="project-card group" onClick={() => setSelectedProject(project)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {project.logo && (
            <img 
              src={project.logo} 
              alt={`${project.name} logo`} 
              className="w-8 h-8 rounded-lg object-cover"
            />
          )}
          <h3 className="text-lg font-semibold flex items-center space-x-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:to-purple-300 transition-all duration-300">
            <span>{project.name}</span>
            <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform duration-300" />
          </h3>
        </div>
        <div className="flex space-x-2">
          <button className="card-action-button">
            <Save className="w-5 h-5 text-indigo-400" />
          </button>
          <button className="card-action-button">
            <FolderSync className="w-5 h-5 text-purple-400" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              removeProject(project.id);
            }}
            className="card-action-button hover:bg-red-600/20"
          >
            <Trash2 className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </div>
      <p className="text-gray-400">{project.description}</p>
      <div className="flex items-center space-x-4 text-sm text-gray-400">
        <span className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400" />
          <span>{project.stats.stars}</span>
        </span>
        <span className="flex items-center space-x-1">
          <GitFork className="w-4 h-4 text-blue-400" />
          <span>{project.stats.forks}</span>
        </span>
        <span className="flex items-center space-x-1">
          <Eye className="w-4 h-4 text-green-400" />
          <span>{project.stats.watchers}</span>
        </span>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {project.categories?.map((category) => (
          <span
            key={category.id}
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${category.color}20`,
              color: category.color,
              border: `1px solid ${category.color}40`
            }}
          >
            {category.name}
          </span>
        ))}
      </div>
    </div>
  );

  const ProjectDetail = ({ project }: { project: Project }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setSelectedProject(null)}
          className="btn-secondary"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Projects</span>
        </button>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCategoryDialogOpen(true)}
            className="btn-secondary"
          >
            <Tag className="w-5 h-5" />
            <span>Categories</span>
          </button>
          <a 
            href={project.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View on GitHub</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="glass-card p-8 rounded-xl space-y-8">
        <div className="flex items-center space-x-4">
          {project.logo && (
            <img 
              src={project.logo} 
              alt={`${project.name} logo`} 
              className="w-16 h-16 rounded-xl object-cover"
            />
          )}
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {project.name}
            </h2>
            <p className="text-gray-400 mt-2">{project.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.categories?.map((category) => (
            <span
              key={category.id}
              className="px-3 py-1.5 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${category.color}20`,
                color: category.color,
                border: `1px solid ${category.color}40`
              }}
            >
              {category.name}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center space-x-2 text-purple-400">
              <Activity className="w-5 h-5" />
              <span className="font-medium">Activity</span>
            </div>
            <div className="text-2xl font-bold">{project.commits}</div>
            <div className="text-sm text-gray-400">Total Commits</div>
          </div>
          <div className="stat-card">
            <div className="flex items-center space-x-2 text-green-400">
              <Users className="w-5 h-5" />
              <span className="font-medium">Team</span>
            </div>
            <div className="text-2xl font-bold">{project.contributors}</div>
            <div className="text-sm text-gray-400">Contributors</div>
          </div>
          <div className="stat-card">
            <div className="flex items-center space-x-2 text-blue-400">
              <Branch className="w-5 h-5" />
              <span className="font-medium">Branches</span>
            </div>
            <div className="text-2xl font-bold">{project.branches}</div>
            <div className="text-sm text-gray-400">Active Branches</div>
          </div>
          <div className="stat-card">
            <div className="flex items-center space-x-2 text-orange-400">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Updated</span>
            </div>
            <div className="text-2xl font-bold">{new Date(project.lastActivity).toLocaleDateString()}</div>
            <div className="text-sm text-gray-400">Last Activity</div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Languages</h3>
          <div className="space-y-4">
            {project.languages.map(lang => (
              <div key={lang.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-gray-400">{lang.percentage}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-value"
                    style={{ width: `${lang.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-700/50">
          <div className="flex space-x-4">
            <button className="btn-primary">
              <Save className="w-5 h-5" />
              <span>Save Locally</span>
            </button>
            <button className="btn-secondary">
              <FolderSync className="w-5 h-5" />
              <span>Sync Changes</span>
            </button>
          </div>
          <button 
            onClick={() => removeProject(project.id)}
            className="btn-danger"
          >
            <Trash2 className="w-5 h-5" />
            <span>Remove Project</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <div className="fixed h-full w-16 glass-card border-r border-gray-700/30 flex flex-col items-center py-4 space-y-4">
        <button
          onClick={() => setActiveTab('projects')}
          className={`nav-button ${activeTab === 'projects' ? 'active' : ''}`}
        >
          <Github className="w-6 h-6" />
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`nav-button ${activeTab === 'settings' ? 'active' : ''}`}
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-16 p-8">
        {activeTab === 'projects' ? (
          <div className="space-y-6">
            {!selectedProject ? (
              <>
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    GitHub Projects
                  </h1>
                  <div className="flex space-x-4">
                    <SearchBar
                      placeholder="Search GitHub projects..."
                      value={githubSearch}
                      onChange={setGithubSearch}
                    />
                    <SearchBar
                      placeholder="Search local projects..."
                      value={projectSearch}
                      onChange={setProjectSearch}
                    />
                    <button 
                      className="btn-primary"
                      onClick={() => setIsAddProjectDialogOpen(true)}
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Project</span>
                    </button>
                  </div>
                </div>

                <CategoryFilter
                  categories={globalCategories}
                  selectedCategories={selectedCategories}
                  onSelectCategory={toggleCategoryFilter}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </>
            ) : (
              <ProjectDetail project={selectedProject} />
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Settings
            </h1>
            
            {/* GitHub Settings */}
            <GitHubSettings />
            
            {/* Save Location */}
            <div className="glass-card p-8 rounded-xl">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FolderOpen className="w-6 h-6 text-purple-400" />
                Project Save Location
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={saveLocation}
                    onChange={(e) => handleSaveLocationChange(e.target.value)}
                    placeholder="Enter save location path..."
                    className="search-input flex-1"
                  />
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      // Here you would typically open a folder picker
                      // For now, we'll just use the text input
                    }}
                  >
                    Browse
                  </button>
                </div>
                <p className="text-sm text-gray-400">
                  This is where your project files will be saved locally.
                </p>
              </div>
            </div>

            {/* Global Categories */}
            <div className="glass-card p-8 rounded-xl">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Tag className="w-6 h-6 text-purple-400" />
                Global Categories
              </h2>
              <div className="space-y-3">
                {globalCategories.map((category) => (
                  <div 
                    key={category.id}
                    className="flex items-center justify-between glass-card px-4 py-3 rounded-lg hover:bg-gray-800/40 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {projects.filter(p => 
                        p.categories?.some(c => c.id === category.id)
                      ).length} projects
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedProject && (
        <CategoryDialog
          isOpen={isCategoryDialogOpen}
          onClose={() => setIsCategoryDialogOpen(false)}
          onAddCategory={addCategory}
          onRemoveCategory={removeCategory}
          categories={selectedProject.categories || []}
          projectId={selectedProject.id}
        />
      )}

      <AddProjectDialog
        isOpen={isAddProjectDialogOpen}
        onClose={() => setIsAddProjectDialogOpen(false)}
        onAddProject={addProject}
      />
    </div>
  );
}

export default App;