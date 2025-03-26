import React, { useState, useEffect } from 'react';
import { File, Folder, ChevronRight, ChevronDown, ArrowLeft, ExternalLink, Code, FileText, Layers, GitBranch } from 'lucide-react';
import { getReadme, getRepoContents, getRepoDetails, GitHubRepo } from '../utils/github';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SymbolTreeView from './SymbolTreeView';
import RelatedRepos from './RelatedRepos';

interface ProjectReadmeProps {
  owner: string;
  repo: string;
  onBack: () => void;
}

interface FileTreeItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  children?: FileTreeItem[];
  expanded?: boolean;
}

const ProjectReadme: React.FC<ProjectReadmeProps> = ({ owner, repo, onBack }) => {
  const [readme, setReadme] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fileTree, setFileTree] = useState<FileTreeItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<{ path: string; content: string; name: string } | null>(null);
  const [activeView, setActiveView] = useState<'readme' | 'file'>('readme');
  const [showSymbolTree, setShowSymbolTree] = useState(false);
  const [relatedRepos, setRelatedRepos] = useState<GitHubRepo[]>([]);
  const [dependentRepos, setDependentRepos] = useState<GitHubRepo[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  useEffect(() => {
    const fetchReadme = async () => {
      setIsLoading(true);
      try {
        const readmeContent = await getReadme(owner, repo);
        setReadme(readmeContent);
        
        // Fetch root directory contents
        const rootContents = await getRepoContents(owner, repo, '');
        setFileTree(rootContents.map(item => ({
          name: item.name,
          path: item.path,
          type: item.type,
          expanded: false,
          children: item.type === 'dir' ? [] : undefined
        })));
      } catch (error) {
        console.error('Error fetching readme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRepoDetails = async () => {
      setIsLoadingDetails(true);
      try {
        const details = await getRepoDetails(owner, repo);
        if (details.relatedRepos) {
          setRelatedRepos(details.relatedRepos);
        }
        if (details.dependents) {
          setDependentRepos(details.dependents);
        }
      } catch (error) {
        console.error('Error fetching repo details:', error);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchReadme();
    fetchRepoDetails();
  }, [owner, repo]);

  const toggleDirectory = async (item: FileTreeItem, index: number, parentPath: string[] = []) => {
    if (item.type !== 'dir') return;

    const newFileTree = [...fileTree];
    let currentLevel = newFileTree;
    let currentItem = item;

    // Navigate to the correct level in the tree
    for (const pathPart of parentPath) {
      const foundIndex = currentLevel.findIndex(i => i.name === pathPart);
      if (foundIndex !== -1 && currentLevel[foundIndex].children) {
        currentLevel = currentLevel[foundIndex].children!;
      }
    }

    const itemIndex = parentPath.length === 0 ? index : currentLevel.findIndex(i => i.name === item.name);
    
    // Toggle expanded state
    currentLevel[itemIndex].expanded = !currentLevel[itemIndex].expanded;
    
    // If expanding and no children loaded yet, fetch them
    if (currentLevel[itemIndex].expanded && (!currentLevel[itemIndex].children || currentLevel[itemIndex].children.length === 0)) {
      try {
        const contents = await getRepoContents(owner, repo, currentLevel[itemIndex].path);
        currentLevel[itemIndex].children = contents.map(content => ({
          name: content.name,
          path: content.path,
          type: content.type,
          expanded: false,
          children: content.type === 'dir' ? [] : undefined
        }));
      } catch (error) {
        console.error('Error fetching directory contents:', error);
      }
    }
    
    setFileTree(newFileTree);
  };

  const handleFileClick = async (item: FileTreeItem) => {
    if (item.type === 'file') {
      try {
        const fileContent = await getRepoContents(owner, repo, item.path, true);
        setSelectedFile({
          path: item.path,
          content: fileContent,
          name: item.name
        });
        setActiveView('file');
      } catch (error) {
        console.error('Error fetching file content:', error);
      }
    }
  };

  const renderFileTree = (items: FileTreeItem[], parentPath: string[] = []) => {
    return (
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={item.path} className="select-none">
            <div 
              className={`flex items-center py-1.5 px-2 rounded-md hover:bg-gray-700/50 cursor-pointer transition-colors duration-150 ${
                selectedFile?.path === item.path ? 'bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-400' : ''
              }`}
              onClick={() => item.type === 'dir' 
                ? toggleDirectory(item, index, parentPath) 
                : handleFileClick(item)
              }
            >
              {item.type === 'dir' && (
                item.expanded 
                  ? <ChevronDown className="w-4 h-4 mr-1 text-indigo-400 transition-transform duration-200" /> 
                  : <ChevronRight className="w-4 h-4 mr-1 text-gray-400 transition-transform duration-200" />
              )}
              {item.type === 'dir' 
                ? <Folder className={`w-4 h-4 mr-2 ${item.expanded ? 'text-indigo-400' : 'text-blue-400'}`} /> 
                : <File className="w-4 h-4 mr-2 text-gray-400" />
              }
              <span className="text-sm truncate">{item.name}</span>
            </div>
            {item.type === 'dir' && item.expanded && item.children && (
              <div className="ml-4 pl-2 border-l border-gray-700/50 mt-1">
                {renderFileTree(item.children, [...parentPath, item.name])}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop() || '';
  };

  const getLanguageFromExtension = (ext: string): string => {
    const languageMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'jsx',
      ts: 'typescript',
      tsx: 'tsx',
      py: 'python',
      rb: 'ruby',
      java: 'java',
      go: 'go',
      rs: 'rust',
      cpp: 'cpp',
      c: 'c',
      cs: 'csharp',
      php: 'php',
      html: 'html',
      css: 'css',
      scss: 'scss',
      json: 'json',
      md: 'markdown',
      yml: 'yaml',
      yaml: 'yaml',
      sh: 'bash',
      bash: 'bash',
      txt: 'text'
    };
    
    return languageMap[ext.toLowerCase()] || 'text';
  };

  const handleSelectRepo = (selectedRepo: GitHubRepo) => {
    window.open(selectedRepo.html_url, '_blank');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onBack}
          className="btn-secondary"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Project</span>
        </button>
        <div className="flex items-center space-x-3">
          <a 
            href={`https://github.com/${owner}/${repo}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View on GitHub</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6 h-[calc(100vh-12rem)]">
        {/* File Tree */}
        <div className="glass-card rounded-xl p-4 overflow-hidden flex flex-col col-span-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold flex items-center">
              <Code className="w-5 h-5 mr-2 text-indigo-400" />
              Repository Files
            </h3>
            <div className="flex space-x-2">
              <button 
                className={`p-1.5 rounded-md hover:bg-gray-700/50 transition-colors ${
                  showSymbolTree ? 'bg-indigo-600/20 text-indigo-300' : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setShowSymbolTree(!showSymbolTree)}
                title="Toggle Symbol Tree"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button 
                className="p-1.5 rounded-md hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
                title="Expand All"
              >
                <GitBranch className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {showSymbolTree && selectedFile ? (
            <div className="overflow-y-auto flex-grow border border-gray-700/30 rounded-lg bg-gray-800/20 p-2">
              <SymbolTreeView 
                owner={owner} 
                repo={repo} 
                path={selectedFile.path} 
              />
            </div>
          ) : (
            <div className="overflow-y-auto flex-grow border border-gray-700/30 rounded-lg bg-gray-800/20 p-2">
              {fileTree.length > 0 ? (
                renderFileTree(fileTree)
              ) : (
                <div className="text-gray-400 text-sm flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500 mr-2"></div>
                  Loading file structure...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="glass-card rounded-xl p-4 col-span-3 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveView('readme')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'readme' 
                    ? 'bg-indigo-600/20 text-indigo-300' 
                    : 'hover:bg-gray-700/50 text-gray-400'
                }`}
              >
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  README
                </div>
              </button>
              {selectedFile && (
                <button
                  onClick={() => setActiveView('file')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeView === 'file' 
                      ? 'bg-indigo-600/20 text-indigo-300' 
                      : 'hover:bg-gray-700/50 text-gray-400'
                  }`}
                >
                  <div className="flex items-center">
                    <File className="w-4 h-4 mr-2" />
                    {selectedFile.name}
                  </div>
                </button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto flex-grow">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : activeView === 'readme' ? (
              readme ? (
                <div className="markdown-body prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: readme }} />
                </div>
              ) : (
                <div className="text-gray-400 flex items-center justify-center h-full">
                  No README found for this repository
                </div>
              )
            ) : selectedFile ? (
              <div className="text-sm">
                <SyntaxHighlighter
                  language={getLanguageFromExtension(getFileExtension(selectedFile.name))}
                  style={atomDark}
                  customStyle={{ background: 'transparent', padding: '1rem' }}
                  showLineNumbers
                >
                  {selectedFile.content}
                </SyntaxHighlighter>
              </div>
            ) : (
              <div className="text-gray-400 flex items-center justify-center h-full">
                Select a file from the file tree to view its contents
              </div>
            )}
          </div>
        </div>

        {/* Related Repositories */}
        <div className="col-span-1 space-y-6 overflow-y-auto">
          {isLoadingDetails ? (
            <div className="glass-card p-4 rounded-xl flex items-center justify-center h-24">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500 mr-2"></div>
              <span className="text-sm text-gray-400">Loading related data...</span>
            </div>
          ) : (
            <>
              <RelatedRepos 
                repos={relatedRepos}
                title="Similar Repositories"
                emptyMessage="No similar repositories found"
                onSelectRepo={handleSelectRepo}
              />
              
              <RelatedRepos 
                repos={dependentRepos}
                title="Dependent Projects"
                emptyMessage="No dependent projects found"
                onSelectRepo={handleSelectRepo}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectReadme;