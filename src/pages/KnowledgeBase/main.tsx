import React, { useState } from 'react';
import { MessageSquare, Globe, Code, FileText, Youtube, Database } from 'lucide-react';
import ChatInterface from './components/ChatInterface';

const KnowledgeBase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'websites' | 'codebases' | 'videos' | 'documents' | 'library'>('chat');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([ 
    { role: 'system', content: 'Welcome to Knowledge Base! I can help you retrieve and organize content from websites, codebases, YouTube videos, documents, and more. How would you like to start?' }
  ]);

  // Function to handle sending messages to the AI
  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    setLoading(true);
    
    // Simulate AI response (in a real implementation, this would call an API)
    setTimeout(() => {
      // Example AI response
      const aiResponse = { role: 'system', content: 'I can help you retrieve content from various sources. Would you like to add a website, codebase, YouTube video, or document to your knowledge base?' };
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">Knowledge Base</h1>
      <p className="mb-4 text-gray-300">
        Create a library of contextual items from websites, codebases, YouTube videos, documents, and more.
        Bundle them together to use as context for AI interactions.
      </p>
      
      {/* Integration links */}
      <div className="mb-4 p-3 bg-gray-800 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Integrated Tools:</h2>
        <div className="flex flex-wrap gap-2">
          <a href="https://github.com/Zeeeepa/llmware" target="_blank" rel="noopener noreferrer" 
             className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700">
            llmware
          </a>
          <a href="https://github.com/zeeeepa/PAI-RAG" target="_blank" rel="noopener noreferrer"
             className="px-3 py-1 bg-green-600 text-white rounded-full text-sm hover:bg-green-700">
            PAI-RAG
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
          onClick={() => setActiveTab('websites')}
          className={`px-4 py-2 flex items-center ${activeTab === 'websites' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Globe className="w-4 h-4 mr-2" />
          Websites
        </button>
        <button
          onClick={() => setActiveTab('codebases')}
          className={`px-4 py-2 flex items-center ${activeTab === 'codebases' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Code className="w-4 h-4 mr-2" />
          Codebases
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-4 py-2 flex items-center ${activeTab === 'videos' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Youtube className="w-4 h-4 mr-2" />
          YouTube Videos
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 flex items-center ${activeTab === 'documents' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <FileText className="w-4 h-4 mr-2" />
          Documents
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`px-4 py-2 flex items-center ${activeTab === 'library' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Database className="w-4 h-4 mr-2" />
          Context Library
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
        {activeTab === 'websites' && (
          <div className="p-4 text-center text-gray-400">
            Website content retrieval interface will be implemented here.
          </div>
        )}
        {activeTab === 'codebases' && (
          <div className="p-4 text-center text-gray-400">
            Codebase exploration interface will be implemented here.
          </div>
        )}
        {activeTab === 'videos' && (
          <div className="p-4 text-center text-gray-400">
            YouTube video transcription interface will be implemented here.
          </div>
        )}
        {activeTab === 'documents' && (
          <div className="p-4 text-center text-gray-400">
            Document upload and processing interface will be implemented here.
          </div>
        )}
        {activeTab === 'library' && (
          <div className="p-4 text-center text-gray-400">
            Context library management interface will be implemented here.
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;