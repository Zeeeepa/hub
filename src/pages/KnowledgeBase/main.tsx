import React from 'react';

const KnowledgeBase: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Knowledge Base</h1>
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <p className="text-gray-300 mb-4">
          This is a placeholder for the Knowledge Base page. This page will contain tools and features for managing and accessing knowledge resources.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Documentation</h2>
            <p className="text-gray-400">Access and manage project documentation.</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Tutorials</h2>
            <p className="text-gray-400">View and create tutorials for common tasks.</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Resources</h2>
            <p className="text-gray-400">Access external resources and references.</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">FAQ</h2>
            <p className="text-gray-400">Find answers to frequently asked questions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;