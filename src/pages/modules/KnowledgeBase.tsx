import React, { useState } from 'react';
import { MessageSquare, Database, FileText, Youtube, Code, Globe, Package } from 'lucide-react';
import ChatInterface from '../../components/projectPlanner/ChatInterface';

const KnowledgeBase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'library' | 'bundles'>('chat');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([ 
    { role: 'system', content: 'Welcome to the Knowledge Base! I can help you retrieve and manage content from websites, codebases, YouTube videos, documents, and more. How would you like to start?' }
  ]);
  const [library, setLibrary] = useState<Array<{id: string, type: string, title: string, content: string}>>([]);
  const [bundles, setBundles] = useState<Array<{id: string, name: string, items: string[]}>>([]); 

  // Function to handle sending messages to the AI
  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    setLoading(true);
    
    // Simulate AI response (in a real implementation, this would call an API)
    setTimeout(() => {
      // Example AI response
      const aiResponse = { role: 'system', content: 'I can help you retrieve content from various sources. Would you like to add a website, codebase, YouTube video, document, or text input to your knowledge library?' };
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1500);
  };

  // Mock function to add an item to the library
  const addToLibrary = (type: string, title: string, content: string) => {
    const newItem = {
      id: `item-${Date.now()}`,
      type,
      title,
      content
    };
    setLibrary(prev => [...prev, newItem]);
  };

  // Mock function to create a bundle
  const createBundle = (name: string, items: string[]) => {
    const newBundle = {
      id: `bundle-${Date.now()}`,
      name,
      items
    };
    setBundles(prev => [...prev, newBundle]);
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
          onClick={() => setActiveTab('library')}
          className={`px-4 py-2 flex items-center ${activeTab === 'library' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Database className="w-4 h-4 mr-2" />
          Content Library
        </button>
        <button
          onClick={() => setActiveTab('bundles')}
          className={`px-4 py-2 flex items-center ${activeTab === 'bundles' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Package className="w-4 h-4 mr-2" />
          Context Bundles
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
        {activeTab === 'library' && (
          <div className="p-4">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Content Library</h2>
              <div className="flex gap-2">
                <button 
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center"
                  onClick={() => addToLibrary('website', 'Example Website', 'Content from example.com')}
                >
                  <Globe className="w-4 h-4 mr-1" /> Add Website
                </button>
                <button 
                  className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex items-center"
                  onClick={() => addToLibrary('code', 'Example Repository', 'Code from example repository')}
                >
                  <Code className="w-4 h-4 mr-1" /> Add Codebase
                </button>
                <button 
                  className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 flex items-center"
                  onClick={() => addToLibrary('youtube', 'Example Video', 'Transcription from example video')}
                >
                  <Youtube className="w-4 h-4 mr-1" /> Add YouTube
                </button>
                <button 
                  className="px-3 py-1 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700 flex items-center"
                  onClick={() => addToLibrary('document', 'Example Document', 'Content from example document')}
                >
                  <FileText className="w-4 h-4 mr-1" /> Add Document
                </button>
              </div>
            </div>
            
            {library.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Your content library is empty. Add content using the buttons above or the chat interface.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {library.map(item => (
                  <div key={item.id} className="bg-gray-800 rounded-md p-4 border border-gray-700">
                    <div className="flex items-center mb-2">
                      {item.type === 'website' && <Globe className="w-5 h-5 mr-2 text-blue-400" />}
                      {item.type === 'code' && <Code className="w-5 h-5 mr-2 text-green-400" />}
                      {item.type === 'youtube' && <Youtube className="w-5 h-5 mr-2 text-red-400" />}
                      {item.type === 'document' && <FileText className="w-5 h-5 mr-2 text-yellow-400" />}
                      <h3 className="font-semibold">{item.title}</h3>
                    </div>
                    <p className="text-sm text-gray-300 truncate">{item.content}</p>
                    <div className="flex justify-end mt-3">
                      <button className="text-xs text-blue-400 hover:text-blue-300">View</button>
                      <button className="text-xs text-green-400 hover:text-green-300 ml-3">Add to Bundle</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === 'bundles' && (
          <div className="p-4">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Context Bundles</h2>
              <button 
                className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 flex items-center"
                onClick={() => createBundle('Example Bundle', [])}
              >
                <Package className="w-4 h-4 mr-1" /> Create Bundle
              </button>
            </div>
            
            {bundles.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>You haven't created any context bundles yet. Create a bundle to group related content items.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bundles.map(bundle => (
                  <div key={bundle.id} className="bg-gray-800 rounded-md p-4 border border-gray-700">
                    <h3 className="font-semibold mb-2">{bundle.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{bundle.items.length} items</p>
                    <div className="flex justify-end">
                      <button className="text-xs text-blue-400 hover:text-blue-300">View</button>
                      <button className="text-xs text-green-400 hover:text-green-300 ml-3">Use with Agent</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;