# Codegen CI/CD Integration

This directory contains components for seamless CI/CD integration with Codegen. The integration enables:

1. Automated PR analysis against requirements
2. Slack notifications and interactions
3. Intelligent next steps suggestions

## Components

### GitHub Integration

The GitHub integration provides:

- GitHub Actions workflow for PR analysis
- Automatic comment posting on PRs
- Requirements extraction from PR descriptions and linked issues

### Slack Integration

The Slack integration provides:

- Slash commands for PR analysis
- Interactive messages with analysis results
- Notifications for CI/CD events

### Analysis Components

The analysis components provide:

- Code change analysis using Codegen API
- Requirements extraction and alignment checking
- Next steps generation based on analysis results

## Setup Instructions

### GitHub Actions Setup

1. Add the GitHub Actions workflow to your repository:
   - Copy `.github/workflows/codegen-ci-cd.yml` to your repository

2. Set up the required secrets in your GitHub repository:
   - `GITHUB_TOKEN`: Automatically provided by GitHub Actions
   - `SLACK_BOT_TOKEN`: Your Slack bot token
   - `CODEGEN_API_KEY`: Your Codegen API key

### Slack Bot Setup

1. Create a Slack app at https://api.slack.com/apps
   - Enable Socket Mode
   - Add bot token scopes: `chat:write`, `commands`, `app_mentions:read`
   - Create a slash command: `/analyze-pr`

2. Install the app to your workspace

3. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in the values
   - Set `SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET`, and `SLACK_APP_TOKEN`

4. Install dependencies and start the bot:
   ```bash
   cd src/ci-cd/slack-integration
   npm install
   npm start
   ```

## Usage

### GitHub Actions

The GitHub Actions workflow will automatically run on new PRs and PR updates. You can also trigger it manually by commenting `/analyze` on a PR.

### Slack Bot

Use the following commands in Slack:

- `/analyze-pr [GitHub PR URL]` - Analyze a GitHub PR
- Mention `@codegen` in a message to get help

## Development

### Adding New Features

To add new features to the CI/CD integration:

1. For GitHub Actions, modify the workflow file and action code
2. For Slack integration, add new commands or event handlers in `slackBot.js`
3. For analysis components, extend the existing modules or add new ones

### Testing

To test the integration locally:

1. Use ngrok to expose your local server to the internet
2. Update your Slack app's request URL to point to your ngrok URL
3. Create test PRs and use the Slack commands to analyze them