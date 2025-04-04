import React, { useState } from 'react';
import { MessageSquare, Search, Star, GitPullRequest, GitMerge } from 'lucide-react';
import ChatInterface from './components/ChatInterface';

const GitHubDiscovery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'search' | 'trending' | 'recommendations' | 'similar'>('chat');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([ 
    { role: 'system', content: 'Welcome to GitHub Discovery! I can help you find interesting projects, search for specific repositories, and discover trending repositories. How would you like to start?' }
  ]);

  const handleSendMessage = async (message: string) => {
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    setLoading(true);
    
    setTimeout(() => {
      const aiResponse = { role: 'system', content: 'I can help you discover GitHub projects. Would you like to search for specific repositories, see trending projects, or get recommendations based on your interests?' };
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">GitHub Discovery</h1>
      <p className="mb-4 text-gray-300">
        Discover interesting GitHub projects, search for repositories, and find trending projects with AI assistance.
      </p>
      
      <div className="mb-4 p-3 bg-gray-800 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Integrated Tools:</h2>
        <div className="flex flex-wrap gap-2">
          <a href="https://github.com/Zeeeepa/mcp-aas" target="_blank" rel="noopener noreferrer" 
             className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700">
            mcp-aas
          </a>
        </div>
      </div>

      <div className="flex border-b border-gray-700/30 mb-4">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 flex items-center ${activeTab === 'chat' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Chat
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`px-4 py-2 flex items-center ${activeTab === 'search' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Search className="w-4 h-4 mr-2" />
          Repository Search
        </button>
        <button
          onClick={() => setActiveTab('trending')}
          className={`px-4 py-2 flex items-center ${activeTab === 'trending' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Star className="w-4 h-4 mr-2" />
          Trending Projects
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-4 py-2 flex items-center ${activeTab === 'recommendations' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <GitPullRequest className="w-4 h-4 mr-2" />
          Recommendations
        </button>
        <button
          onClick={() => setActiveTab('similar')}
          className={`px-4 py-2 flex items-center ${activeTab === 'similar' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <GitMerge className="w-4 h-4 mr-2" />
          Similar Projects
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === 'chat' && (
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            loading={loading} 
          />
        )}
        {activeTab === 'search' && (
          <div className="p-4 text-center text-gray-400">
            Repository search interface will be implemented here.
          </div>
        )}
        {activeTab === 'trending' && (
          <div className="p-4 text-center text-gray-400">
            Trending projects interface will be implemented here.
          </div>
        )}
        {activeTab === 'recommendations' && (
          <div className="p-4 text-center text-gray-400">
            Recommendations interface will be implemented here.
          </div>
        )}
        {activeTab === 'similar' && (
          <div className="p-4 text-center text-gray-400">
            Similar projects interface will be implemented here.
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubDiscovery;