import React, { useState } from 'react';
import { MessageSquare, Youtube, Globe, FileText, Github } from 'lucide-react';
import ChatInterface from './components/ChatInterface';

const ContinuousDataMining: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'youtube' | 'web' | 'arxiv' | 'github'>('chat');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([ 
    { role: 'system', content: 'Welcome to Continuous Data Mining! I can help you search YouTube, the web, arXiv, and GitHub for relevant content. How would you like to start?' }
  ]);

  // Function to handle sending messages to the AI
  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    setLoading(true);
    
    // Simulate AI response (in a real implementation, this would call an API)
    setTimeout(() => {
      // Example AI response
      const aiResponse = { role: 'system', content: 'I can help you search for information. Would you like to search YouTube, the web, arXiv, or GitHub?' };
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">Continuous Data Mining</h1>
      <p className="mb-4 text-gray-300">
        Search and analyze content from YouTube, the web, arXiv, and GitHub to stay updated with the latest information.
      </p>
      
      {/* Integration links */}
      <div className="mb-4 p-3 bg-gray-800 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Integrated Tools:</h2>
        <div className="flex flex-wrap gap-2">
          <a href="https://github.com/Zeeeepa/arxiver" target="_blank" rel="noopener noreferrer" 
             className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700">
            arxiver
          </a>
          <a href="https://github.com/Zeeeepa/wiseflow" target="_blank" rel="noopener noreferrer"
             className="px-3 py-1 bg-green-600 text-white rounded-full text-sm hover:bg-green-700">
            wiseflow
          </a>
          <a href="https://github.com/Zeeeepa/open_deep_research" target="_blank" rel="noopener noreferrer"
             className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-700">
            open_deep_research
          </a>
          <a href="https://github.com/Zeeeepa/gpt-researcher" target="_blank" rel="noopener noreferrer"
             className="px-3 py-1 bg-yellow-600 text-white rounded-full text-sm hover:bg-yellow-700">
            gpt-researcher
          </a>
          <a href="https://github.com/Zeeeepa/RD-Agent" target="_blank" rel="noopener noreferrer"
             className="px-3 py-1 bg-red-600 text-white rounded-full text-sm hover:bg-red-700">
            RD-Agent
          </a>
          <a href="https://github.com/Zeeeepa/mcp-aas" target="_blank" rel="noopener noreferrer"
             className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700">
            mcp-aas
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700/30 mb-4">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 flex items-center ${activeTab === 'chat' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Chat
        </button>
        <button
          onClick={() => setActiveTab('youtube')}
          className={`px-4 py-2 flex items-center ${activeTab === 'youtube' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Youtube className="w-4 h-4 mr-2" />
          YouTube
        </button>
        <button
          onClick={() => setActiveTab('web')}
          className={`px-4 py-2 flex items-center ${activeTab === 'web' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Globe className="w-4 h-4 mr-2" />
          Web
        </button>
        <button
          onClick={() => setActiveTab('arxiv')}
          className={`px-4 py-2 flex items-center ${activeTab === 'arxiv' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <FileText className="w-4 h-4 mr-2" />
          arXiv
        </button>
        <button
          onClick={() => setActiveTab('github')}
          className={`px-4 py-2 flex items-center ${activeTab === 'github' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Github className="w-4 h-4 mr-2" />
          GitHub
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'chat' && (
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            loading={loading} 
          />
        )}
        {activeTab === 'youtube' && (
          <div className="p-4 text-center text-gray-400">
            YouTube search interface will be implemented here.
          </div>
        )}
        {activeTab === 'web' && (
          <div className="p-4 text-center text-gray-400">
            Web search interface will be implemented here.
          </div>
        )}
        {activeTab === 'arxiv' && (
          <div className="p-4 text-center text-gray-400">
            arXiv search interface will be implemented here.
          </div>
        )}
        {activeTab === 'github' && (
          <div className="p-4 text-center text-gray-400">
            GitHub search interface will be implemented here.
          </div>
        )}
      </div>
    </div>
  );
};

export default ContinuousDataMining;