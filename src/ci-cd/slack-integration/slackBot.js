const { App } = require('@slack/bolt');
const { analyzeChanges } = require('../analysis/codeAnalyzer');
const { generateNextSteps } = require('../analysis/nextStepsGenerator');
const { extractRequirements } = require('../analysis/requirementsExtractor');
const { Octokit } = require('@octokit/rest');

/**
 * Initialize and configure the Slack bot
 * @param {Object} config - Configuration object
 * @returns {Object} Configured Slack bot
 */
function initializeSlackBot(config) {
  const {
    slackBotToken,
    slackSigningSecret,
    slackAppToken,
    githubToken,
    codegenApiKey,
    port = 3000
  } = config;

  // Initialize the Slack app
  const app = new App({
    token: slackBotToken,
    signingSecret: slackSigningSecret,
    socketMode: Boolean(slackAppToken),
    appToken: slackAppToken,
    port
  });

  // Initialize GitHub client
  const octokit = new Octokit({
    auth: githubToken
  });

  // Listen for the slash command to analyze a PR
  app.command('/analyze-pr', async ({ command, ack, respond }) => {
    // Acknowledge the command request
    await ack();

    const prUrl = command.text.trim();
    if (!prUrl || !prUrl.includes('github.com') || !prUrl.includes('/pull/')) {
      await respond({
        text: 'Please provide a valid GitHub PR URL. Example: /analyze-pr https://github.com/owner/repo/pull/123'
      });
      return;
    }

    // Extract PR details from URL
    const prDetails = extractPrDetailsFromUrl(prUrl);
    if (!prDetails) {
      await respond({
        text: 'Could not parse the PR URL. Please make sure it follows the format: https://github.com/owner/repo/pull/123'
      });
      return;
    }

    await respond({
      text: `Analyzing PR #${prDetails.prNumber} in ${prDetails.owner}/${prDetails.repo}...`
    });

    try {
      // Get PR data
      const { data: pullRequest } = await octokit.pulls.get({
        owner: prDetails.owner,
        repo: prDetails.repo,
        pull_number: prDetails.prNumber
      });

      // Get PR files
      const { data: files } = await octokit.pulls.listFiles({
        owner: prDetails.owner,
        repo: prDetails.repo,
        pull_number: prDetails.prNumber
      });

      // Extract requirements from PR description or linked issues
      const requirements = await extractRequirements(
        pullRequest.body,
        octokit,
        { owner: prDetails.owner, repo: prDetails.repo }
      );

      // Analyze code changes
      const analysisResult = await analyzeChanges(
        files,
        requirements,
        codegenApiKey,
        pullRequest
      );

      // Generate next steps
      const nextSteps = await generateNextSteps(
        analysisResult,
        requirements,
        codegenApiKey
      );

      // Post analysis results to Slack
      await respond({
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `PR Analysis for #${prDetails.prNumber}: ${pullRequest.title}`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*PR:* <${pullRequest.html_url}|${pullRequest.title}>`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Analysis Summary:*\n${analysisResult.summary}`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Alignment with Requirements:*\n${analysisResult.requirementsAnalysis}`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Suggested Next Steps:*\n${nextSteps.join('\n')}`,
            },
          },
        ],
      });
    } catch (error) {
      console.error('Error analyzing PR:', error);
      await respond({
        text: `Error analyzing PR: ${error.message}`
      });
    }
  });

  // Listen for messages mentioning "codegen" to provide help
  app.message(/codegen/i, async ({ message, say }) => {
    if (message.subtype === 'bot_message') return;

    await say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Hi <@${message.user}>! I'm the Codegen CI/CD bot. Here's how I can help you:`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Commands:*\n• `/analyze-pr [GitHub PR URL]` - Analyze a GitHub PR\n• `@codegen help` - Show this help message',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'I can analyze PRs, check alignment with requirements, and suggest next steps for development.',
          },
        },
      ],
    });
  });

  return app;
}

/**
 * Extract PR details from a GitHub PR URL
 * @param {string} url - GitHub PR URL
 * @returns {Object|null} PR details or null if invalid
 */
function extractPrDetailsFromUrl(url) {
  try {
    const regex = /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/;
    const match = url.match(regex);
    if (!match) return null;

    return {
      owner: match[1],
      repo: match[2],
      prNumber: parseInt(match[3], 10)
    };
  } catch (error) {
    console.error('Error parsing PR URL:', error);
    return null;
  }
}

module.exports = {
  initializeSlackBot
};