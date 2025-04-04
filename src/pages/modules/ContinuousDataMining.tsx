import React, { useState } from 'react';
import { MessageSquare, Search, Youtube, FileText, Github, Bookmark, Clock } from 'lucide-react';
import ChatInterface from '../../components/projectPlanner/ChatInterface';

const ContinuousDataMining: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'searches' | 'results'>('chat');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([ 
    { role: 'system', content: 'Welcome to Continuous Data Mining! I can help you search YouTube, the internet, arXiv, and GitHub repositories for relevant information. How would you like to start?' }
  ]);
  const [searches, setSearches] = useState<Array<{id: string, type: string, query: string, status: string, timestamp: Date}>>([]);
  const [results, setResults] = useState<Array<{id: string, searchId: string, title: string, source: string, content: string, saved: boolean}>>([]);

  // Function to handle sending messages to the AI
  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    setLoading(true);
    
    // Simulate AI response (in a real implementation, this would call an API)
    setTimeout(() => {
      // Example AI response
      const aiResponse = { role: 'system', content: 'I can help you search for information. Would you like to search YouTube, the internet, arXiv papers, or GitHub repositories?' };
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1500);
  };

  // Mock function to create a new search
  const createSearch = (type: string, query: string) => {
    const newSearch = {
      id: `search-${Date.now()}`,
      type,
      query,
      status: 'running',
      timestamp: new Date()
    };
    setSearches(prev => [newSearch, ...prev]);
    
    // Simulate search completion after a delay
    setTimeout(() => {
      setSearches(prev => 
        prev.map(s => s.id === newSearch.id ? {...s, status: 'completed'} : s)
      );
      
      // Add mock results
      const mockResults = [
        {
          id: `result-${Date.now()}-1`,
          searchId: newSearch.id,
          title: `${type} result 1 for "${query}"`,
          source: type === 'youtube' ? 'youtube.com' : 
                 type === 'arxiv' ? 'arxiv.org' : 
                 type === 'github' ? 'github.com' : 'google.com',
          content: `This is a sample result for the ${type} search "${query}". In a real implementation, this would contain actual content from the search.`,
          saved: false
        },
        {
          id: `result-${Date.now()}-2`,
          searchId: newSearch.id,
          title: `${type} result 2 for "${query}"`,
          source: type === 'youtube' ? 'youtube.com' : 
                 type === 'arxiv' ? 'arxiv.org' : 
                 type === 'github' ? 'github.com' : 'google.com',
          content: `Another sample result for the ${type} search "${query}". This would contain different content in a real implementation.`,
          saved: false
        }
      ];
      
      setResults(prev => [...mockResults, ...prev]);
    }, 3000);
  };

  // Function to toggle saved status of a result
  const toggleSaveResult = (resultId: string) => {
    setResults(prev => 
      prev.map(r => r.id === resultId ? {...r, saved: !r.saved} : r)
    );
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">Continuous Data Mining</h1>
      <p className="mb-4 text-gray-300">
        Search and monitor YouTube, internet, arXiv, and GitHub repositories for relevant information.
        Save and organize your findings for later use.
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
          onClick={() => setActiveTab('searches')}
          className={`px-4 py-2 flex items-center ${activeTab === 'searches' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Search className="w-4 h-4 mr-2" />
          Active Searches
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 flex items-center ${activeTab === 'results' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <FileText className="w-4 h-4 mr-2" />
          Results
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
        {activeTab === 'searches' && (
          <div className="p-4">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Active Searches</h2>
              <div className="flex gap-2">
                <button 
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center"
                  onClick={() => createSearch('web', 'AI research trends')}
                >
                  <Search className="w-4 h-4 mr-1" /> Web Search
                </button>
                <button 
                  className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 flex items-center"
                  onClick={() => createSearch('youtube', 'AI tutorials')}
                >
                  <Youtube className="w-4 h-4 mr-1" /> YouTube
                </button>
                <button 
                  className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex items-center"
                  onClick={() => createSearch('arxiv', 'machine learning')}
                >
                  <FileText className="w-4 h-4 mr-1" /> arXiv
                </button>
                <button 
                  className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 flex items-center"
                  onClick={() => createSearch('github', 'AI agents')}
                >
                  <Github className="w-4 h-4 mr-1" /> GitHub
                </button>
              </div>
            </div>
            
            {searches.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>You don't have any active searches. Start a new search using the buttons above or the chat interface.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {searches.map(search => (
                  <div key={search.id} className="bg-gray-800 rounded-md p-4 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {search.type === 'web' && <Search className="w-5 h-5 mr-2 text-blue-400" />}
                        {search.type === 'youtube' && <Youtube className="w-5 h-5 mr-2 text-red-400" />}
                        {search.type === 'arxiv' && <FileText className="w-5 h-5 mr-2 text-green-400" />}
                        {search.type === 'github' && <Github className="w-5 h-5 mr-2 text-purple-400" />}
                        <div>
                          <h3 className="font-semibold">{search.query}</h3>
                          <p className="text-xs text-gray-400">
                            {search.type.charAt(0).toUpperCase() + search.type.slice(1)} search • 
                            {search.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {search.status === 'running' ? (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs flex items-center">
                            <Clock className="w-3 h-3 mr-1 animate-spin" /> Running
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span> Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === 'results' && (
          <div className="p-4">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Search Results</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center">
                  <Bookmark className="w-4 h-4 mr-1" /> Saved Only
                </button>
              </div>
            </div>
            
            {results.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No search results yet. Start a search to see results here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map(result => (
                  <div key={result.id} className="bg-gray-800 rounded-md p-4 border border-gray-700">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{result.title}</h3>
                      <button 
                        className={`${result.saved ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-300`}
                        onClick={() => toggleSaveResult(result.id)}
                      >
                        <Bookmark className="w-5 h-5" fill={result.saved ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">Source: {result.source}</p>
                    <p className="text-sm text-gray-300">{result.content}</p>
                    <div className="flex justify-end mt-3">
                      <button className="text-xs text-blue-400 hover:text-blue-300">View Full</button>
                      <button className="text-xs text-green-400 hover:text-green-300 ml-3">Add to Knowledge Base</button>
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

export default ContinuousDataMining;