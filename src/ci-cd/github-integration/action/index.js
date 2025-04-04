const core = require('@actions/core');
const github = require('@actions/github');
const { WebClient } = require('@slack/web-api');
const { analyzeChanges } = require('../../analysis/codeAnalyzer');
const { generateNextSteps } = require('../../analysis/nextStepsGenerator');
const { extractRequirements } = require('../../analysis/requirementsExtractor');

async function run() {
  try {
    // Get inputs
    const githubToken = core.getInput('github-token', { required: true });
    const slackToken = core.getInput('slack-token', { required: true });
    const codegenApiKey = core.getInput('codegen-api-key', { required: true });
    
    // Initialize clients
    const octokit = github.getOctokit(githubToken);
    const slack = new WebClient(slackToken);
    
    const context = github.context;
    const repo = context.repo;
    
    // Get PR details
    let prNumber;
    if (context.eventName === 'pull_request') {
      prNumber = context.payload.pull_request.number;
    } else if (context.eventName === 'issue_comment' && context.payload.issue.pull_request) {
      prNumber = context.payload.issue.number;
    } else {
      throw new Error('Event is not related to a pull request');
    }
    
    // Get PR data
    const { data: pullRequest } = await octokit.rest.pulls.get({
      owner: repo.owner,
      repo: repo.repo,
      pull_number: prNumber,
    });
    
    // Get PR files
    const { data: files } = await octokit.rest.pulls.listFiles({
      owner: repo.owner,
      repo: repo.repo,
      pull_number: prNumber,
    });
    
    // Extract requirements from PR description or linked issues
    const requirements = await extractRequirements(pullRequest.body, octokit, repo);
    
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
    
    // Post to Slack
    const slackResult = await slack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID || 'general',
      text: `*PR Analysis for #${prNumber}*: ${pullRequest.title}`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `PR Analysis for #${prNumber}: ${pullRequest.title}`,
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
    
    // Save results for the next step
    const result = {
      summary: analysisResult.summary,
      requirementsAnalysis: analysisResult.requirementsAnalysis,
      suggestedNextSteps: nextSteps.join('\n'),
      slackThreadUrl: `https://slack.com/archives/${slackResult.channel}/p${slackResult.ts.replace('.', '')}`,
    };
    
    const fs = require('fs');
    fs.writeFileSync('analysis-result.json', JSON.stringify(result, null, 2));
    
    core.setOutput('analysis-result', JSON.stringify(result));
    
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();