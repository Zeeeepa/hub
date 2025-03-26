import React, { useState } from 'react';
import { Key, Check, AlertCircle } from 'lucide-react';
import { getGitHubToken, setGitHubToken } from '../utils/store';
import { validateGitHubToken, initializeOctokit } from '../utils/github';

export default function GitHubSettings() {
  const [token, setToken] = useState(getGitHubToken());
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'success' | 'error' | null>(null);
  const [showToken, setShowToken] = useState(false);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
    setValidationStatus(null);
  };

  const handleSaveToken = async () => {
    setIsValidating(true);
    setValidationStatus(null);

    const isValid = await validateGitHubToken(token);
    
    if (isValid) {
      setGitHubToken(token);
      initializeOctokit();
      setValidationStatus('success');
    } else {
      setValidationStatus('error');
    }
    
    setIsValidating(false);
  };

  return (
    <div className="glass-card p-8 rounded-xl">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Key className="w-6 h-6 text-purple-400" />
        GitHub API Settings
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Personal Access Token
          </label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              value={token}
              onChange={handleTokenChange}
              placeholder="ghp_..."
              className="search-input pr-24"
            />
            <button
              onClick={() => setShowToken(!showToken)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-white px-2 py-1 rounded"
            >
              {showToken ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Create a token with 'repo' scope at{' '}
            <a
              href="https://github.com/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300"
            >
              GitHub Settings
            </a>
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {validationStatus === 'success' && (
              <span className="flex items-center gap-1 text-green-400">
                <Check className="w-4 h-4" />
                Token validated successfully
              </span>
            )}
            {validationStatus === 'error' && (
              <span className="flex items-center gap-1 text-red-400">
                <AlertCircle className="w-4 h-4" />
                Invalid token
              </span>
            )}
          </div>
          
          <button
            onClick={handleSaveToken}
            disabled={isValidating || !token}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isValidating ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <Key className="w-5 h-5" />
                Save Token
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}