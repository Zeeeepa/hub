# Codegen Deep Research

A code research tool that enables users to understand codebases through agentic AI analysis. The project combines a Modal-based FastAPI backend with a Next.js frontend to provide intelligent code exploration capabilities.

Users submit a GitHub repository and research query through the frontend. The Modal API processes the request using an AI agent equipped with specialized code analysis tools. The agent explores the codebase using various tools (search, symbol analysis, etc.) and results are returned to the frontend for display.

## Module Requirements

### Continuous Data Mining
- YouTube searcher
- Internet searcher
- Arxiv searcher
- GitHub Code/project Searcher
- Related repositories:
  - [arxiver](https://github.com/Zeeeepa/arxiver) - Arxiv/YouTube comprehension
  - [wiseflow](https://github.com/Zeeeepa/wiseflow) - Continuous data mining
  - [open_deep_research](https://github.com/Zeeeepa/open_deep_research) - Research
  - [gpt-researcher](https://github.com/Zeeeepa/gpt-researcher) - Research
  - [RD-Agent](https://github.com/Zeeeepa/RD-Agent) - Data mining
  - [mcp-aas](https://github.com/Zeeeepa/mcp-aas) - Could be adjusted for GitHub project/code search

### Codebase Management
- Code analysis capabilities
- GitHub repository chat interface
- Related repositories:
  - [codegen](https://github.com/Zeeeepa/codegen) - Used for code analysis
  - [deep-research](https://github.com/Zeeeepa/deep-research) - For chatting with GitHub repos UI page tab

### Knowledge Base
- Ability to retrieve and process content from:
  1. Whole websites
  2. Codebases (local/GitHub)
  3. YouTube videos with transcribed text and enhanced context
  4. Document files
  5. Text input (instructions, requirements, etc.)
  6. Code files (separate-exemplary cases)
  7. Other content types
- Goal: Create a library of contextual items that can be bundled together for better agent comprehension
- Related repositories:
  - [llmware](https://github.com/Zeeeepa/llmware)
  - [PAI-RAG](https://github.com/zeeeepa/PAI-RAG)

### GitHub Discovery
- Tools to discover GitHub projects using various tools and agentic capabilities
- Preference for using prominent GitHub projects
- Related repositories:
  - [mcp-aas](https://github.com/Zeeeepa/mcp-aas) - Could be adjusted for GitHub project/code search

### Project Development
- Chat interface with AI
- Visual aids (mermaid map, diagram map) with tabs for different aspects
- Project planning and management capabilities
- Related repositories:
  - [gitdiagram](https://github.com/Zeeeepa/gitdiagram)
  - [plangen](https://github.com/zeeeepa/plangen) - For planning
  - [Clean-Coder-AI](https://github.com/zeeeepa/Clean-Coder-AI) - For project management
  - [plandex](https://github.com/Zeeeepa/plandex) - Project planning

## How it Works

### Backend (Modal API)

The backend is built using [Modal](https://modal.com/) and [FastAPI](https://fastapi.tiangolo.com/), providing a serverless API endpoint for code research.

There is a main API endpoint that handles code research requests. It uses the `codegen` library for codebase analysis.

The agent investigates the codebase through various research tools:
- `ViewFileTool`: Read file contents
- `ListDirectoryTool`: Explore directory structures
- `SearchTool`: Text-based code search
- `SemanticSearchTool`: AI-powered semantic code search
- `RevealSymbolTool`: Analyze code symbols and relationships

```python
tools = [
    ViewFileTool(codebase),
    ListDirectoryTool(codebase),
    SearchTool(codebase),
    SemanticSearchTool(codebase),
    RevealSymbolTool(codebase)
]

# Initialize agent with research tools
agent = create_agent_with_tools(
    codebase=codebase,
    tools=tools,
    chat_history=[SystemMessage(content=RESEARCH_AGENT_PROMPT)],
    verbose=True
)
```

### Frontend (Next.js)

The frontend provides an interface for users to submit a GitHub repository and research query. The components come from the [shadcn/ui](https://ui.shadcn.com/) library. This triggers the Modal API to perform the code research and returns the results to the frontend.

## Getting Started

1. Set up environment variables in an `.env` file:
   ```
   OPENAI_API_KEY=your_key_here
   ```

2. Deploy or serve the Modal API:
   ```bash
   modal serve backend/api.py
   ```
   `modal serve` runs the API locally for development, creating a temporary endpoint that's active only while the command is running.
   ```bash
   modal deploy backend/api.py
   ```
   `modal deploy` creates a persistent Modal app and deploys the FastAPI app to it, generating a permanent API endpoint.
   
   After deployment, you'll need to update the API endpoint in the frontend configuration to point to your deployed Modal app URL.

3. Run the Next.js frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Development Workflow

This project uses a scratchpad approach for organizing thoughts and tracking progress. When working on tasks:

1. Use the `scratchpad.md` file to organize your thoughts and plan your approach
2. For each new task:
   - Review the current scratchpad content
   - Clear old unrelated tasks if necessary
   - Explain the new task and plan the steps needed
   - Use todo markers to track progress: `[X]` for completed tasks, `[ ]` for pending tasks
3. Update the progress in the scratchpad as you complete subtasks
4. Use the scratchpad for reflection and planning, especially after completing milestones

This approach helps maintain both the big picture and detailed progress tracking throughout development.

## Learn More

More information about the `codegen` library can be found [here](https://codegen.com/).

For details on the agent implementation, check out [Deep Code Research with AI](https://docs.codegen.com/tutorials/deep-code-research) from the Codegen docs. This tutorial provides an in-depth guide on how the research agent is created.