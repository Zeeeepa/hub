import React, { useState, useEffect } from 'react';
import { 
  Bookmark, Star, GitFork, Eye, Tag, Clock, Search, 
  Trash2, Edit, Plus, X, Save, SortAsc, SortDesc, Filter
} from 'lucide-react';
import { 
  getSavedRepositories, 
  SavedRepo, 
  removeSavedRepository, 
  updateSavedRepository,
  updateLastViewed
} from '../utils/store';
import { GitHubRepo } from '../utils/github';

interface SavedRepositoriesProps {
  onSelectRepo?: (repo: GitHubRepo) => void;
}

export default function SavedRepositories({ onSelectRepo }: SavedRepositoriesProps) {
  const [savedRepos, setSavedRepos] = useState<SavedRepo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'stars' | 'savedAt' | 'lastViewed'>('savedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editingRepo, setEditingRepo] = useState<SavedRepo | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    loadSavedRepos();
  }, []);

  useEffect(() => {
    // Extract all unique tags
    const tags = new Set<string>();
    savedRepos.forEach(repo => {
      repo.tags.forEach(tag => tags.add(tag));
    });
    setAllTags(Array.from(tags).sort());
  }, [savedRepos]);

  const loadSavedRepos = () => {
    const repos = getSavedRepositories();
    setSavedRepos(repos);
  };

  const handleRemoveRepo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this repository from your saved list?')) {
      removeSavedRepository(id);
      loadSavedRepos();
    }
  };

  const handleEditRepo = (repo: SavedRepo, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRepo(repo);
    setEditNotes(repo.notes);
    setEditTags([...repo.tags]);
  };

  const handleSaveEdit = () => {
    if (!editingRepo) return;
    
    updateSavedRepository(editingRepo.id, {
      notes: editNotes,
      tags: editTags
    });
    
    setEditingRepo(null);
    loadSavedRepos();
  };

  const handleAddTag = () => {
    if (!newTag.trim() || editTags.includes(newTag.trim())) return;
    setEditTags([...editTags, newTag.trim()]);
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setEditTags(editTags.filter(t => t !== tag));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      handleAddTag();
    }
  };

  const handleSelectRepo = (repo: SavedRepo) => {
    if (!onSelectRepo) return;
    
    // Update last viewed timestamp
    updateLastViewed(repo.id);
    
    // Convert SavedRepo to GitHubRepo format
    const githubRepo: GitHubRepo = {
      id: repo.repoId,
      name: repo.name,
      full_name: repo.fullName,
      description: repo.description,
      html_url: repo.url,
      stargazers_count: repo.stars,
      forks_count: repo.forks,
      watchers_count: 0, // Not stored in SavedRepo
      language: repo.language,
      owner: repo.owner,
      created_at: '', // Not stored in SavedRepo
      updated_at: '', // Not stored in SavedRepo
      open_issues_count: 0, // Not stored in SavedRepo
      topics: repo.tags
    };
    
    onSelectRepo(githubRepo);
  };

  const toggleTagFilter = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const filteredAndSortedRepos = savedRepos
    .filter(repo => {
      // Apply search filter
      const matchesSearch = 
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.notes.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Apply tag filter
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => repo.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'stars':
          comparison = a.stars - b.stars;
          break;
        case 'savedAt':
          comparison = new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime();
          break;
        case 'lastViewed':
          // Handle null lastViewed values
          if (!a.lastViewed && !b.lastViewed) comparison = 0;
          else if (!a.lastViewed) comparison = 1;
          else if (!b.lastViewed) comparison = -1;
          else comparison = new Date(a.lastViewed).getTime() - new Date(b.lastViewed).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center">
          <Bookmark className="w-7 h-7 mr-2 text-indigo-400" />
          Saved Repositories
        </h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search saved repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input pl-10"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-sm"
          >
            <option value="savedAt">Date Saved</option>
            <option value="lastViewed">Last Viewed</option>
            <option value="name">Name</option>
            <option value="stars">Stars</option>
          </select>
          <button
            onClick={toggleSortOrder}
            className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="w-5 h-5 text-gray-400" />
            ) : (
              <SortDesc className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-400">
            <Filter className="w-4 h-4 mr-1" />
            <span>Filter by tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTagFilter(tag)}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50'
                    : 'bg-gray-700/30 text-gray-300 border border-gray-600/30 hover:bg-gray-700/50'
                }`}
              >
                {tag}
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700/30 text-gray-300 hover:bg-gray-700/50 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      {filteredAndSortedRepos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedRepos.map((repo) => (
            <div
              key={repo.id}
              className="glass-card p-6 rounded-xl space-y-4 cursor-pointer hover:scale-[1.02] transition-all duration-300"
              onClick={() => handleSelectRepo(repo)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={repo.owner.avatar_url}
                    alt={`${repo.name} owner avatar`}
                    className="w-8 h-8 rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{repo.name}</h3>
                    <div className="text-xs text-gray-400">by {repo.owner.login}</div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => handleEditRepo(repo, e)}
                    className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <Edit className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={(e) => handleRemoveRepo(repo.id, e)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              <p className="text-gray-400 line-clamp-2">{repo.description}</p>

              {repo.notes && (
                <div className="bg-gray-800/30 p-2 rounded-lg border border-gray-700/30">
                  <p className="text-sm text-gray-300 line-clamp-3">{repo.notes}</p>
                </div>
              )}

              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{repo.stars.toLocaleString()}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <GitFork className="w-4 h-4 text-blue-400" />
                  <span>{repo.forks.toLocaleString()}</span>
                </span>
                {repo.language && (
                  <span className="flex items-center space-x-1">
                    <span className="w-3 h-3 rounded-full bg-purple-400" />
                    <span>{repo.language}</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {repo.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Bookmark className="w-3.5 h-3.5 mr-1" />
                  <span>Saved: {formatDate(repo.savedAt)}</span>
                </div>
                {repo.lastViewed && (
                  <div className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    <span>Viewed: {formatDate(repo.lastViewed)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Bookmark className="w-16 h-16 text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No saved repositories</h3>
          <p className="text-center mb-6">
            {searchQuery || selectedTags.length > 0
              ? "No repositories match your search criteria"
              : "Save repositories to access them quickly later"}
          </p>
        </div>
      )}

      {/* Edit Repository Modal */}
      {editingRepo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="glass-card p-6 rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{editingRepo.name}</h3>
              <button
                onClick={() => setEditingRepo(null)}
                className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Notes
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-3 glass-card rounded-lg bg-gray-800/20 resize-none h-32"
                  placeholder="Add your notes about this repository..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editTags.map(tag => (
                    <div
                      key={tag}
                      className="flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 p-0.5 rounded-full hover:bg-blue-500/30"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag..."
                    className="flex-1 p-2 glass-card rounded-l-lg bg-gray-800/20"
                  />
                  <button
                    onClick={handleAddTag}
                    className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white p-2 rounded-r-lg"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setEditingRepo(null)}
                className="btn-secondary mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="btn-primary"
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}