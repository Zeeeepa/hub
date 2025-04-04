import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Star, GitFork, Eye, Code, Tag, Bookmark, BookmarkCheck, ExternalLink, Trash2, Edit, X } from 'lucide-react';
import { getSavedRepositories, saveRepository, removeSavedRepository, updateSavedRepository, SavedRepo } from '../utils/store';
import AddProjectDialog from './AddProjectDialog';
import { GitHubRepo } from '../utils/github';

export default function GitHubProjects() {
  const [projects, setProjects] = useState<SavedRepo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<SavedRepo | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const savedProjects = getSavedRepositories();
    setProjects(savedProjects);
    
    // Extract all unique tags
    const tags = new Set<string>();
    savedProjects.forEach(project => {
      project.tags.forEach(tag => tags.add(tag));
    });
    setAllTags(Array.from(tags).sort());
  };

  const handleAddProject = (repo: GitHubRepo, notes: string, tags: string[]) => {
    saveRepository(repo, notes, tags);
    loadProjects();
    setIsAddDialogOpen(false);
  };

  const handleUpdateProject = (id: string, notes: string, tags: string[]) => {
    updateSavedRepository(id, { notes, tags });
    loadProjects();
    setEditingProject(null);
  };

  const handleRemoveProject = (id: string) => {
    if (window.confirm('Are you sure you want to remove this project?')) {
      removeSavedRepository(id);
      loadProjects();
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchQuery === '' || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.notes.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => project.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Project Management
        </h2>
        <button 
          onClick={() => setIsAddDialogOpen(true)}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            className="btn-secondary"
          >
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700/30 hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center">
                <Tag className="w-3 h-3 mr-1" />
                <span>{tag}</span>
              </div>
            </button>
          ))}
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-colors"
            >
              <div className="flex items-center">
                <X className="w-3 h-3 mr-1" />
                <span>Clear</span>
              </div>
            </button>
          )}
        </div>
      )}

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card p-6 rounded-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={project.owner.avatar_url}
                    alt={`${project.name} owner avatar`}
                    className="w-8 h-8 rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                    <div className="text-xs text-gray-400">by {project.owner.login}</div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
                    title="Edit Project"
                  >
                    <Edit className="w-5 h-5 text-gray-400" />
                  </button>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </a>
                  <button
                    onClick={() => handleRemoveProject(project.id)}
                    className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
                    title="Remove Project"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>

              <p className="text-gray-400 line-clamp-2">{project.description}</p>

              {project.notes && (
                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/30">
                  <p className="text-sm text-gray-300">{project.notes}</p>
                </div>
              )}

              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{project.stars.toLocaleString()}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <GitFork className="w-4 h-4 text-blue-400" />
                  <span>{project.forks.toLocaleString()}</span>
                </span>
                {project.language && (
                  <span className="flex items-center space-x-1">
                    <span className="w-3 h-3 rounded-full bg-purple-400" />
                    <span>{project.language}</span>
                  </span>
                )}
              </div>

              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Bookmark className="w-16 h-16 text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No projects found</h3>
          <p className="text-center">
            {projects.length === 0 
              ? "You haven't added any projects yet. Click 'Add Project' to get started." 
              : "No projects match your search criteria. Try adjusting your filters."}
          </p>
        </div>
      )}

      {isAddDialogOpen && (
        <AddProjectDialog
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={handleAddProject}
        />
      )}

      {editingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Edit Project</h3>
              <button 
                onClick={() => setEditingProject(null)}
                className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Project Notes
                </label>
                <textarea
                  value={editingProject.notes}
                  onChange={(e) => setEditingProject({...editingProject, notes: e.target.value})}
                  className="w-full bg-gray-800/50 border border-gray-700/30 rounded-lg p-3 text-white"
                  rows={4}
                  placeholder="Add notes about this project..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={editingProject.tags.join(', ')}
                  onChange={(e) => {
                    const tagsInput = e.target.value;
                    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
                    setEditingProject({...editingProject, tags});
                  }}
                  className="w-full bg-gray-800/50 border border-gray-700/30 rounded-lg p-3 text-white"
                  placeholder="e.g. frontend, react, important"
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingProject(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateProject(editingProject.id, editingProject.notes, editingProject.tags)}
                  className="btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}