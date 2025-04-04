import React, { useState } from 'react';
import { MessageSquare, Code, Search, GitBranch, FileCode } from 'lucide-react';
import ChatInterface from './components/ChatInterface';

const CodebaseManage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'analysis' | 'search' | 'explore' | 'visualize'>('chat');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([ 
    { role: 'system', content: 'Welcome to Codebase Management! I can help you analyze, search, and explore codebases. How would you like to start?' }
  ]);

  // Function to handle sending messages to the AI
  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    setLoading(true);
    
    // Simulate AI response (in a real implementation, this would call an API)
    setTimeout(() => {
      // Example AI response
      const aiResponse = { role: 'system', content: 'I can help you analyze and explore codebases. Would you like to analyze code structure, search for specific patterns, or explore a repository?' };
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">Codebase Management</h1>
      <p className="mb-4 text-gray-300">
        Analyze, search, and explore codebases with AI assistance. Understand code structure, find patterns, and visualize relationships.
      </p>
      
      {/* Integration links */}
      <div className="mb-4 p-3 bg-gray-800 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Integrated Tools:</h2>
        <div className="flex flex-wrap gap-2">
          <a href="https://github.com/Zeeeepa/codegen" target="_blank" rel="noopener noreferrer" 
             className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700">
            codegen
          </a>
          <a href="https://github.com/Zeeeepa/deep-research" target="_blank" rel="noopener noreferrer"
             className="px-3 py-1 bg-green-600 text-white rounded-full text-sm hover:bg-green-700">
            deep-research
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
          onClick={() => setActiveTab('analysis')}
          className={`px-4 py-2 flex items-center ${activeTab === 'analysis' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Code className="w-4 h-4 mr-2" />
          Code Analysis
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`px-4 py-2 flex items-center ${activeTab === 'search' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Search className="w-4 h-4 mr-2" />
          Code Search
        </button>
        <button
          onClick={() => setActiveTab('explore')}
          className={`px-4 py-2 flex items-center ${activeTab === 'explore' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <FileCode className="w-4 h-4 mr-2" />
          Repository Explorer
        </button>
        <button
          onClick={() => setActiveTab('visualize')}
          className={`px-4 py-2 flex items-center ${activeTab === 'visualize' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <GitBranch className="w-4 h-4 mr-2" />
          Dependency Visualizer
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
        {activeTab === 'analysis' && (
          <div className="p-4 text-center text-gray-400">
            Code analysis interface will be implemented here.
          </div>
        )}
        {activeTab === 'search' && (
          <div className="p-4 text-center text-gray-400">
            Code search interface will be implemented here.
          </div>
        )}
        {activeTab === 'explore' && (
          <div className="p-4 text-center text-gray-400">
            Repository explorer interface will be implemented here.
          </div>
        )}
        {activeTab === 'visualize' && (
          <div className="p-4 text-center text-gray-400">
            Dependency visualizer interface will be implemented here.
          </div>
        )}
      </div>
    </div>
  );
};

export default CodebaseManage;