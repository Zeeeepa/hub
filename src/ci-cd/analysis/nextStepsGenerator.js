const axios = require('axios');

/**
 * Generates next steps based on analysis results and requirements
 * @param {Object} analysisResult - Results from code analysis
 * @param {Array} requirements - Extracted requirements
 * @param {string} codegenApiKey - API key for Codegen
 * @returns {Array} List of suggested next steps
 */
async function generateNextSteps(analysisResult, requirements, codegenApiKey) {
  try {
    // Prepare the request to Codegen API
    const requestData = {
      analysisResult,
      requirements
    };

    // Call Codegen API for next steps
    const response = await axios.post(
      'https://api.codegen.com/generate-next-steps',
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${codegenApiKey}`
        }
      }
    );

    // If we don't have a real Codegen API yet, we can simulate the response
    if (!response.data || !response.data.nextSteps) {
      return simulateNextSteps(analysisResult, requirements);
    }

    return response.data.nextSteps;
  } catch (error) {
    console.error('Error generating next steps:', error);
    // If the API call fails, provide fallback next steps
    return [
      'Review the code changes for potential issues',
      'Consider adding more test coverage',
      'Update documentation to reflect the changes'
    ];
  }
}

/**
 * Simulates Codegen API response for next steps
 * @param {Object} analysisResult - Results from code analysis
 * @param {Array} requirements - Extracted requirements
 * @returns {Array} Simulated next steps
 */
function simulateNextSteps(analysisResult, requirements) {
  // This is a placeholder implementation for development/testing
  // In a real implementation, this would be replaced by actual API calls
  
  const nextSteps = [];
  
  // Add suggestions from analysis result
  if (analysisResult.suggestions && analysisResult.suggestions.length > 0) {
    nextSteps.push(...analysisResult.suggestions);
  }
  
  // Add generic next steps
  nextSteps.push('Review the code changes for potential issues');
  nextSteps.push('Consider adding more test coverage');
  
  // Add requirements-based next steps
  if (requirements && requirements.length > 0) {
    // Check if there are any requirements that might not be fully addressed
    const partiallyAddressedReq = analysisResult.requirementsAnalysis && 
      analysisResult.requirementsAnalysis.includes('partially aligned');
    
    if (partiallyAddressedReq) {
      nextSteps.push('Address the partially implemented requirements');
    }
    
    // Suggest documentation updates
    nextSteps.push('Update documentation to reflect the implemented requirements');
  }
  
  // Add performance and security considerations
  nextSteps.push('Evaluate performance implications of the changes');
  nextSteps.push('Check for potential security issues in the implementation');
  
  return nextSteps;
}

module.exports = {
  generateNextSteps
};