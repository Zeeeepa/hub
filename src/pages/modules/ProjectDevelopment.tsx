import React, { useState } from 'react';
import { MessageSquare, GitBranch, Code, Layers, FileText } from 'lucide-react';

// Import components from the project planner
import ProjectStructure from '../../components/projectPlanner/ProjectStructure';
import FunctionDocumentation from '../../components/projectPlanner/FunctionDocumentation';
import ActionFlows from '../../components/projectPlanner/ActionFlows';
import HighLevelOverview from '../../components/projectPlanner/HighLevelOverview';
import ChatInterface from '../../components/projectPlanner/ChatInterface';

const ProjectDevelopment: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'structure' | 'functions' | 'flows' | 'overview'>('chat');
  const [projectData, setProjectData] = useState<any>({
    structure: {},
    functions: [],
    flows: [],
    overview: {}
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([ 
    { role: 'system', content: 'Welcome to Project Development! I can help you design your project structure, define functions, visualize action flows, and provide high-level overviews. How would you like to start?' }
  ]);

  // Function to handle sending messages to the AI
  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    setLoading(true);
    
    // Simulate AI response (in a real implementation, this would call an API)
    setTimeout(() => {
      // Example AI response
      const aiResponse = { role: 'system', content: 'I\'ve analyzed your request. I can help you plan your project using tools like gitdiagram, plangen, Clean-Coder-AI, and plandex. Would you like me to create a project structure based on your description, or would you prefer to start with defining the core functionalities?' };
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1500);
  };

  // Function to update project data from AI suggestions
  const updateProjectData = (section: string, data: any) => {
    setProjectData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">Project Development</h1>
      <p className="mb-4 text-gray-300">
        Plan and design your projects with AI assistance. Visualize project structure, document functions, 
        map action flows, and create high-level overviews.
      </p>
      
      {/* Integration links */}
      <div className="mb-4 p-3 bg-gray-800 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Integrated Tools:</h2>
        <div className="flex flex-wrap gap-2">
          <a href="https://github.com/Zeeeepa/gitdiagram" target="_blank" rel="noopener noreferrer" 
             className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700">
            gitdiagram
          </a>
          <a href="https://github.com/zeeeepa/plangen" target="_blank" rel="noopener noreferrer"
             className="px-3 py-1 bg-green-600 text-white rounded-full text-sm hover:bg-green-700">
            plangen
          </a>
          <a href="https://github.com/zeeeepa/Clean-Coder-AI" target="_blank" rel="noopener noreferrer"
             className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-700">
            Clean-Coder-AI
          </a>
          <a href="https://github.com/Zeeeepa/plandex" target="_blank" rel="noopener noreferrer"
             className="px-3 py-1 bg-yellow-600 text-white rounded-full text-sm hover:bg-yellow-700">
            plandex
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
          onClick={() => setActiveTab('structure')}
          className={`px-4 py-2 flex items-center ${activeTab === 'structure' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Layers className="w-4 h-4 mr-2" />
          Project Structure
        </button>
        <button
          onClick={() => setActiveTab('functions')}
          className={`px-4 py-2 flex items-center ${activeTab === 'functions' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <Code className="w-4 h-4 mr-2" />
          Functions
        </button>
        <button
          onClick={() => setActiveTab('flows')}
          className={`px-4 py-2 flex items-center ${activeTab === 'flows' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <GitBranch className="w-4 h-4 mr-2" />
          Action Flows
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 flex items-center ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
        >
          <FileText className="w-4 h-4 mr-2" />
          Overview
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
        {activeTab === 'structure' && <ProjectStructure data={projectData.structure} updateData={(data) => updateProjectData('structure', data)} />}
        {activeTab === 'functions' && <FunctionDocumentation data={projectData.functions} updateData={(data) => updateProjectData('functions', data)} />}
        {activeTab === 'flows' && <ActionFlows data={projectData.flows} updateData={(data) => updateProjectData('flows', data)} />}
        {activeTab === 'overview' && <HighLevelOverview data={projectData.overview} updateData={(data) => updateProjectData('overview', data)} />}
      </div>
    </div>
  );
};

export default ProjectDevelopment;