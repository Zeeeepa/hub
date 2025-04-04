import React, { useState } from 'react';
import { MessageSquare, Code, FileCode, GitBranch, Search } from 'lucide-react';
import ChatInterface from '../../components/projectPlanner/ChatInterface';

const CodebaseManage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'explorer' | 'analysis'>('chat');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([ 
    { role: 'system', content: 'Welcome to Codebase Management! I can help you analyze and explore codebases. How would you like to start?' }
  ]);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Array<{id: string, file: string, line: number, content: string}>>([]);

  // Mock repositories
  const repositories = [
    { id: 'repo1', name: 'codegen', description: 'Code analysis tool' },
    { id: 'repo2', name: 'deep-research', description: 'GitHub repo chat interface' },
  ];

  // Mock file structure
  const fileStructure = [
    { id: 'dir1', name: 'src', type: 'directory', children: [
      { id: 'dir2', name: 'components', type: 'directory', children: [
        { id: 'file1', name: 'CodeViewer.tsx', type: 'file' },
        { id: 'file2', name: 'SearchBar.tsx', type: 'file' },
      ]},
      { id: 'file3', name: 'App.tsx', type: 'file' },
      { id: 'file4', name: 'index.tsx', type: 'file' },
    ]},
    { id: 'dir3', name: 'public', type: 'directory', children: [
      { id: 'file5', name: 'index.html', type: 'file' },
    ]},
    { id: 'file6', name: 'package.json', type: 'file' },
    { id: 'file7', name: 'README.md', type: 'file' },
  ];

  // Function to handle sending messages to the AI
  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    setLoading(true);
    
    // Simulate AI response (in a real implementation, this would call an API)
    setTimeout(() => {
      // Example AI response
      const aiResponse = { role: 'system', content: 'I can help you analyze your codebase. Would you like to explore the file structure, search for specific code patterns, or get an overview of the architecture?' };
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1500);
  };

  // Mock function to handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Mock search results
    const mockResults = [
      { id: 'result1', file: 'src/components/CodeViewer.tsx', line: 42, content: `function highlightCode(code: string, language: string) { // Contains "${query}"` },
      { id: 'result2', file: 'src/App.tsx', line: 15, content: `// This is where we handle the ${query} functionality` },
      { id: 'result3', file: 'src/utils/helpers.ts', line: 78, content: `export const process${query} = (data) => {` },
    ];
    
    setSearchResults(mockResults);
  };

  // Render file tree recursively
  const renderFileTree = (items: any[], level = 0) => {
    return (
      <div className="pl-4">
        {items.map(item => (
          <div key={item.id}>
            <div className="flex items-center py-1 hover:bg-gray-700/30 px-2 rounded cursor-pointer">
              {item.type === 'directory' ? (
                <GitBranch className="w-4 h-4 mr-2 text-blue-400" />
              ) : (
                <FileCode className="w-4 h-4 mr-2 text-green-400" />
              )}
              <span>{item.name}</span>
            </div>
            {item.children && renderFileTree(item.children, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">Codebase Management</h1>
      <p className="mb-4 text-gray-300">
        Analyze, explore, and chat with your codebases. Search for code patterns, understand architecture,
        and get AI-powered insights.
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
          onClick={() => setActiveTab('explorer')}
          className={`px-4 py-2 flex items-center ${activeTab === 'explorer' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Code className="w-4 h-4 mr-2" />
          Explorer
        </button>
        <button
          onClick={() => setActiveTab('analysis')}
          className={`px-4 py-2 flex items-center ${activeTab === 'analysis' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Search className="w-4 h-4 mr-2" />
          Code Search
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
        {activeTab === 'explorer' && (
          <div className="p-4">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Code Explorer</h2>
              <select 
                className="bg-gray-700 text-white px-3 py-1 rounded-md"
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
              >
                <option value="">Select Repository</option>
                {repositories.map(repo => (
                  <option key={repo.id} value={repo.id}>{repo.name}</option>
                ))}
              </select>
            </div>
            
            {!selectedRepo ? (
              <div className="text-center py-8 text-gray-400">
                <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a repository to explore its file structure.</p>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-md p-4 border border-gray-700">
                <h3 className="font-semibold mb-3">File Structure</h3>
                {renderFileTree(fileStructure)}
              </div>
            )}
          </div>
        )}
        {activeTab === 'analysis' && (
          <div className="p-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Code Search</h2>
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for code patterns, functions, classes..."
                  className="flex-1 bg-gray-700 text-white p-2 rounded-l-md focus:outline-none"
                />
                <button 
                  className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none"
                  onClick={() => handleSearch(searchQuery)}
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Enter a search query to find code patterns across your repositories.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.map(result => (
                  <div key={result.id} className="bg-gray-800 rounded-md p-4 border border-gray-700">
                    <div className="flex items-center mb-2">
                      <FileCode className="w-5 h-5 mr-2 text-green-400" />
                      <h3 className="font-semibold">{result.file}</h3>
                      <span className="ml-2 text-xs text-gray-400">Line {result.line}</span>
                    </div>
                    <pre className="bg-gray-900 p-2 rounded text-sm overflow-x-auto">
                      <code>{result.content}</code>
                    </pre>
                    <div className="flex justify-end mt-3">
                      <button className="text-xs text-blue-400 hover:text-blue-300">View File</button>
                      <button className="text-xs text-green-400 hover:text-green-300 ml-3">Analyze</button>
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

export default CodebaseManage;