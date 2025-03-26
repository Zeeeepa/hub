import React, { useState } from 'react';
import { useTrendingRepositories } from '../hooks/useGitHub';
import { Star, GitFork, Eye, Code, ExternalLink } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';

// Language options
const LANGUAGES = [
  'All',
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'Go',
  'Rust',
  'C++',
  'PHP',
  'Ruby'
];

// Time period options
const TIME_PERIODS = [
  { label: 'Today', value: 'daily' },
  { label: 'This Week', value: 'weekly' },
  { label: 'This Month', value: 'monthly' }
] as const;

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="glass-card p-6 rounded-xl space-y-4 text-center">
    <h3 className="text-xl font-semibold text-red-400">Something went wrong</h3>
    <p className="text-gray-400">{error.message}</p>
    <button 
      onClick={resetErrorBoundary}
      className="btn-primary"
    >
      Try again
    </button>
  </div>
);

// Loading skeleton component
const RepositorySkeleton = () => (
  <div className="glass-card p-6 rounded-xl space-y-4 animate-pulse">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
      <div className="space-y-2">
        <div className="h-5 w-32 bg-gray-700 rounded"></div>
        <div className="h-3 w-20 bg-gray-700 rounded"></div>
      </div>
    </div>
    <div className="h-4 w-full bg-gray-700 rounded"></div>
    <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
    <div className="flex items-center space-x-4">
      <div className="h-4 w-16 bg-gray-700 rounded"></div>
      <div className="h-4 w-16 bg-gray-700 rounded"></div>
      <div className="h-4 w-16 bg-gray-700 rounded"></div>
    </div>
  </div>
);

// Repository card component
interface RepositoryCardProps {
  repo: {
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    watchers_count: number;
    language: string | null;
    owner: {
      login: string;
      avatar_url: string;
    };
    topics?: string[];
  };
  onClick: () => void;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repo, onClick }) => (
  <div
    className="glass-card p-6 rounded-xl space-y-4 cursor-pointer hover:scale-[1.02] transition-all duration-300"
    onClick={onClick}
  >
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

    <p className="text-gray-400 line-clamp-2">{repo.description}</p>

    <div className="flex items-center space-x-4 text-sm text-gray-400">
      <span className="flex items-center space-x-1">
        <Star className="w-4 h-4 text-yellow-400" />
        <span>{repo.stargazers_count.toLocaleString()}</span>
      </span>
      <span className="flex items-center space-x-1">
        <GitFork className="w-4 h-4 text-blue-400" />
        <span>{repo.forks_count.toLocaleString()}</span>
      </span>
      <span className="flex items-center space-x-1">
        <Eye className="w-4 h-4 text-green-400" />
        <span>{repo.watchers_count.toLocaleString()}</span>
      </span>
    </div>

    <div className="flex flex-wrap gap-2">
      {repo.language && (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
          {repo.language}
        </span>
      )}
      {repo.topics?.slice(0, 3).map(topic => (
        <span key={topic} className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
          {topic}
        </span>
      ))}
    </div>
  </div>
);

// Main component
const TrendingRepositories: React.FC<{ onSelectRepo: (repo: any) => void }> = ({ onSelectRepo }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  // Use the custom hook to fetch trending repositories
  const { 
    data: repositories, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useTrendingRepositories(
    selectedLanguage === 'All' ? '' : selectedLanguage,
    timePeriod
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="search-input bg-transparent"
          aria-label="Select language"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang} className="bg-gray-800">
              {lang}
            </option>
          ))}
        </select>

        <select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value as typeof timePeriod)}
          className="search-input bg-transparent"
          aria-label="Select time period"
        >
          {TIME_PERIODS.map((period) => (
            <option key={period.value} value={period.value} className="bg-gray-800">
              {period.label}
            </option>
          ))}
        </select>
      </div>

      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={refetch}
      >
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <RepositorySkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <div className="glass-card p-6 rounded-xl space-y-4 text-center">
            <h3 className="text-xl font-semibold text-red-400">Error loading repositories</h3>
            <p className="text-gray-400">{(error as Error).message}</p>
            <button 
              onClick={() => refetch()}
              className="btn-primary"
            >
              Try again
            </button>
          </div>
        ) : repositories?.length === 0 ? (
          <div className="glass-card p-6 rounded-xl space-y-4 text-center">
            <h3 className="text-xl font-semibold text-gray-300">No repositories found</h3>
            <p className="text-gray-400">Try changing your filters or check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repositories?.map((repo) => (
              <RepositoryCard 
                key={repo.id} 
                repo={repo} 
                onClick={() => onSelectRepo(repo)} 
              />
            ))}
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default TrendingRepositories;