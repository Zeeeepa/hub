/**
 * Extracts requirements from PR description or linked issues
 * @param {string} prBody - PR description
 * @param {Object} octokit - GitHub API client
 * @param {Object} repo - Repository information
 * @returns {Array} Extracted requirements
 */
async function extractRequirements(prBody, octokit, repo) {
  const requirements = [];
  
  // Extract requirements from PR description
  if (prBody) {
    // Look for requirements section in PR description
    const requirementsSection = extractRequirementsSection(prBody);
    if (requirementsSection) {
      const extractedReqs = parseRequirementsList(requirementsSection);
      requirements.push(...extractedReqs);
    }
    
    // Look for linked issues in PR description
    const linkedIssues = extractLinkedIssues(prBody);
    if (linkedIssues.length > 0) {
      const issueRequirements = await getRequirementsFromIssues(linkedIssues, octokit, repo);
      requirements.push(...issueRequirements);
    }
  }
  
  return requirements;
}

/**
 * Extracts requirements section from PR description
 * @param {string} prBody - PR description
 * @returns {string|null} Requirements section or null if not found
 */
function extractRequirementsSection(prBody) {
  // Look for common section headers for requirements
  const sectionHeaders = [
    '## Requirements',
    '### Requirements',
    '## Acceptance Criteria',
    '### Acceptance Criteria',
    '## User Stories',
    '### User Stories',
    '## Specifications',
    '### Specifications'
  ];
  
  for (const header of sectionHeaders) {
    const headerIndex = prBody.indexOf(header);
    if (headerIndex !== -1) {
      // Find the end of the section (next header or end of text)
      let endIndex = prBody.length;
      const nextHeaderMatch = prBody.slice(headerIndex + header.length).match(/^#{2,3}\s+[A-Za-z]/m);
      if (nextHeaderMatch) {
        endIndex = headerIndex + header.length + nextHeaderMatch.index;
      }
      
      return prBody.slice(headerIndex + header.length, endIndex).trim();
    }
  }
  
  return null;
}

/**
 * Parses a requirements list from text
 * @param {string} text - Text containing requirements
 * @returns {Array} List of requirements
 */
function parseRequirementsList(text) {
  const requirements = [];
  
  // Look for bullet points or numbered lists
  const listItemRegex = /[-*+]|\d+\.\s+(.+)$/gm;
  let match;
  
  while ((match = listItemRegex.exec(text)) !== null) {
    const requirement = match[1] || match[0].replace(/^[-*+]\s+/, '');
    requirements.push(requirement.trim());
  }
  
  // If no list items found, split by newlines
  if (requirements.length === 0) {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    requirements.push(...lines);
  }
  
  return requirements;
}

/**
 * Extracts linked issue numbers from PR description
 * @param {string} prBody - PR description
 * @returns {Array} List of issue numbers
 */
function extractLinkedIssues(prBody) {
  const issues = [];
  
  // Look for common issue linking patterns
  const patterns = [
    /(?:closes|fixes|resolves)\s+#(\d+)/gi,
    /(?:close|fix|resolve)\s+#(\d+)/gi,
    /(?:related to|implements|addresses)\s+#(\d+)/gi,
    /#(\d+)/g
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(prBody)) !== null) {
      issues.push(parseInt(match[1], 10));
    }
  }
  
  return [...new Set(issues)]; // Remove duplicates
}

/**
 * Gets requirements from linked issues
 * @param {Array} issueNumbers - List of issue numbers
 * @param {Object} octokit - GitHub API client
 * @param {Object} repo - Repository information
 * @returns {Array} Requirements from issues
 */
async function getRequirementsFromIssues(issueNumbers, octokit, repo) {
  const requirements = [];
  
  for (const issueNumber of issueNumbers) {
    try {
      const { data: issue } = await octokit.rest.issues.get({
        owner: repo.owner,
        repo: repo.repo,
        issue_number: issueNumber
      });
      
      if (issue.body) {
        // Extract requirements from issue body
        const requirementsSection = extractRequirementsSection(issue.body);
        if (requirementsSection) {
          const issueReqs = parseRequirementsList(requirementsSection);
          requirements.push(...issueReqs);
        } else {
          // If no specific requirements section, use the issue title and body
          requirements.push(`Issue #${issueNumber}: ${issue.title}`);
          if (issue.body.length < 500) {
            requirements.push(issue.body.trim());
          }
        }
      } else {
        // If no body, just use the issue title
        requirements.push(`Issue #${issueNumber}: ${issue.title}`);
      }
    } catch (error) {
      console.error(`Error fetching issue #${issueNumber}:`, error);
    }
  }
  
  return requirements;
}

module.exports = {
  extractRequirements
};