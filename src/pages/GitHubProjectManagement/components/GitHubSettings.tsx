import React, { useState, useEffect } from 'react';
import { 
  Settings, Key, User, Save, Trash2, RefreshCw, 
  Check, AlertCircle, Eye, EyeOff, Github
} from 'lucide-react';
import { 
  validateGitHubToken, 
  initializeOctokit, 
  getUserProfile, 
  GitHubUser 
} from '../utils/github';
import { 
  getGitHubToken, 
  saveGitHubToken, 
  removeGitHubToken,
  getGitHubSettings,
  saveGitHubSettings,
  resetGitHubSettings
} from '../utils/store';

export default function GitHubSettings() {
  const [token, setToken] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [userProfile, setUserProfile] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState(getGitHubSettings());
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const storedToken = getGitHubToken();
    if (storedToken) {
      setToken(storedToken);
      setIsTokenValid(true);
      initializeOctokit(storedToken);
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

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

  const handleValidateToken = async () => {
    if (!token.trim()) return;
    
    setIsValidating(true);
    try {
      const isValid = await validateGitHubToken(token);
      setIsTokenValid(isValid);
      
      if (isValid) {
        saveGitHubToken(token);
        initializeOctokit(token);
        fetchUserProfile();
      }
    } catch (error) {
      console.error('Error validating token:', error);
      setIsTokenValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveToken = () => {
    if (window.confirm('Are you sure you want to remove your GitHub token?')) {
      removeGitHubToken();
      setToken('');
      setIsTokenValid(false);
      setUserProfile(null);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    try {
      saveGitHubSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      resetGitHubSettings();
      setSettings(getGitHubSettings());
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center">
          <Settings className="w-7 h-7 mr-2 text-indigo-400" />
          GitHub Settings
        </h2>
      </div>

      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Key className="w-5 h-5 mr-2 text-yellow-400" />
          GitHub Authentication
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Personal Access Token
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full p-3 glass-card rounded-lg bg-gray-800/20"
              />
              <button
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Create a token with 'repo' scope at{' '}
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                GitHub Settings
              </a>
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleValidateToken}
              disabled={isValidating || !token.trim()}
              className="btn-primary"
            >
              {isValidating ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : isTokenValid ? (
                <Check className="w-5 h-5" />
              ) : (
                <Key className="w-5 h-5" />
              )}
              <span>{isTokenValid ? 'Token Valid' : 'Validate Token'}</span>
            </button>
            
            {isTokenValid && (
              <button
                onClick={handleRemoveToken}
                className="btn-danger"
              >
                <Trash2 className="w-5 h-5" />
                <span>Remove Token</span>
              </button>
            )}
          </div>
          
          {isTokenValid && (
            <div className="flex items-center text-sm text-green-400 mt-2">
              <Check className="w-4 h-4 mr-1" />
              <span>Token is valid and saved</span>
            </div>
          )}
        </div>
      </div>

      {userProfile && (
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-400" />
            GitHub Profile
          </h3>
          
          <div className="flex items-center space-x-4">
            <img
              src={userProfile.avatar_url}
              alt={`${userProfile.login}'s avatar`}
              className="w-16 h-16 rounded-lg"
            />
            <div>
              <h4 className="text-xl font-bold">{userProfile.name}</h4>
              <p className="text-gray-400">@{userProfile.login}</p>
              {userProfile.bio && (
                <p className="text-sm text-gray-300 mt-1">{userProfile.bio}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-6 mt-4">
            <div className="text-center">
              <div className="text-xl font-bold">{userProfile.public_repos}</div>
              <div className="text-xs text-gray-400">Repositories</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{userProfile.followers}</div>
              <div className="text-xs text-gray-400">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{userProfile.following}</div>
              <div className="text-xs text-gray-400">Following</div>
            </div>
          </div>
          
          <div className="mt-4">
            <a
              href={userProfile.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex"
            >
              <Github className="w-5 h-5" />
              <span>View GitHub Profile</span>
            </a>
          </div>
        </div>
      )}

      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-purple-400" />
          Display Settings
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Default Search Sort
              </label>
              <select
                value={settings.defaultSearchSort}
                onChange={(e) => handleSettingChange('defaultSearchSort', e.target.value)}
                className="w-full p-2 glass-card rounded-lg bg-gray-800/20"
              >
                <option value="stars">Stars</option>
                <option value="forks">Forks</option>
                <option value="updated">Updated</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Default Sort Order
              </label>
              <select
                value={settings.defaultSearchOrder}
                onChange={(e) => handleSettingChange('defaultSearchOrder', e.target.value)}
                className="w-full p-2 glass-card rounded-lg bg-gray-800/20"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Results Per Page
              </label>
              <select
                value={settings.resultsPerPage}
                onChange={(e) => handleSettingChange('resultsPerPage', parseInt(e.target.value))}
                className="w-full p-2 glass-card rounded-lg bg-gray-800/20"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showStarCount"
                checked={settings.showStarCount}
                onChange={(e) => handleSettingChange('showStarCount', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showStarCount" className="text-sm text-gray-300">
                Show Star Count
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showForkCount"
                checked={settings.showForkCount}
                onChange={(e) => handleSettingChange('showForkCount', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showForkCount" className="text-sm text-gray-300">
                Show Fork Count
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showLanguage"
                checked={settings.showLanguage}
                onChange={(e) => handleSettingChange('showLanguage', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showLanguage" className="text-sm text-gray-300">
                Show Language
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showDescription"
                checked={settings.showDescription}
                onChange={(e) => handleSettingChange('showDescription', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showDescription" className="text-sm text-gray-300">
                Show Description
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showLastUpdated"
                checked={settings.showLastUpdated}
                onChange={(e) => handleSettingChange('showLastUpdated', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showLastUpdated" className="text-sm text-gray-300">
                Show Last Updated
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <button
            onClick={handleResetSettings}
            className="btn-secondary"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Reset to Defaults</span>
          </button>
          
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="btn-primary"
          >
            {isSaving ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-5 h-5" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{saveSuccess ? 'Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}