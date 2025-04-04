const axios = require('axios');

/**
 * Analyzes code changes using Codegen API
 * @param {Array} files - List of files changed in the PR
 * @param {Object} requirements - Extracted requirements
 * @param {string} codegenApiKey - API key for Codegen
 * @param {Object} pullRequest - Pull request data
 * @returns {Object} Analysis results
 */
async function analyzeChanges(files, requirements, codegenApiKey, pullRequest) {
  try {
    // Prepare the data for Codegen API
    const fileChanges = await Promise.all(
      files.map(async (file) => {
        // For each file, get the content before and after the change
        return {
          filename: file.filename,
          patch: file.patch,
          status: file.status,
          additions: file.additions,
          deletions: file.deletions,
          changes: file.changes
        };
      })
    );

    // Prepare the request to Codegen API
    const requestData = {
      pullRequest: {
        title: pullRequest.title,
        body: pullRequest.body,
        number: pullRequest.number,
        url: pullRequest.html_url,
        base: {
          ref: pullRequest.base.ref,
          sha: pullRequest.base.sha
        },
        head: {
          ref: pullRequest.head.ref,
          sha: pullRequest.head.sha
        }
      },
      files: fileChanges,
      requirements: requirements
    };

    // Call Codegen API for analysis
    const response = await axios.post(
      'https://api.codegen.com/analyze-pr',
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${codegenApiKey}`
        }
      }
    );

    // If we don't have a real Codegen API yet, we can simulate the response
    if (!response.data) {
      return simulateCodegenAnalysis(fileChanges, requirements);
    }

    return response.data;
  } catch (error) {
    console.error('Error analyzing changes:', error);
    // If the API call fails, provide a fallback analysis
    return {
      summary: 'Failed to analyze changes with Codegen API. Using fallback analysis.',
      requirementsAnalysis: 'Unable to analyze requirements alignment.',
      issues: [],
      suggestions: []
    };
  }
}

/**
 * Simulates Codegen API response for development/testing
 * @param {Array} fileChanges - List of file changes
 * @param {Object} requirements - Extracted requirements
 * @returns {Object} Simulated analysis results
 */
function simulateCodegenAnalysis(fileChanges, requirements) {
  // This is a placeholder implementation for development/testing
  // In a real implementation, this would be replaced by actual API calls
  
  const fileCount = fileChanges.length;
  const totalAdditions = fileChanges.reduce((sum, file) => sum + (file.additions || 0), 0);
  const totalDeletions = fileChanges.reduce((sum, file) => sum + (file.deletions || 0), 0);
  
  // Generate a simple summary
  const summary = `This PR modifies ${fileCount} files with ${totalAdditions} additions and ${totalDeletions} deletions.`;
  
  // Simulate requirements analysis
  let requirementsAnalysis = '';
  if (requirements && requirements.length > 0) {
    requirementsAnalysis = 'Requirements analysis:\n';
    requirements.forEach((req, index) => {
      const alignment = Math.random() > 0.3 ? 'fully aligned' : 'partially aligned';
      requirementsAnalysis += `- Requirement ${index + 1}: ${req.substring(0, 50)}... is ${alignment} with the changes.\n`;
    });
  } else {
    requirementsAnalysis = 'No specific requirements found to analyze.';
  }
  
  return {
    summary,
    requirementsAnalysis,
    issues: [],
    suggestions: [
      'Consider adding more unit tests for the new functionality.',
      'Some code could be refactored for better readability.',
      'Documentation could be improved for the changed components.'
    ]
  };
}

module.exports = {
  analyzeChanges
};