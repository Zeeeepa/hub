require('dotenv').config();
const { initializeSlackBot } = require('./slackBot');

// Get configuration from environment variables
const config = {
  slackBotToken: process.env.SLACK_BOT_TOKEN,
  slackSigningSecret: process.env.SLACK_SIGNING_SECRET,
  slackAppToken: process.env.SLACK_APP_TOKEN,
  githubToken: process.env.GITHUB_TOKEN,
  codegenApiKey: process.env.CODEGEN_API_KEY,
  port: process.env.PORT || 3000
};

// Check for required environment variables
const requiredEnvVars = [
  'SLACK_BOT_TOKEN',
  'SLACK_SIGNING_SECRET',
  'GITHUB_TOKEN',
  'CODEGEN_API_KEY'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please set these variables in your .env file or environment');
  process.exit(1);
}

// Initialize and start the Slack bot
(async () => {
  try {
    // Initialize the bot
    const app = initializeSlackBot(config);
    
    // Start the app
    await app.start();
    console.log('⚡️ Codegen CI/CD Slack bot is running!');
    
    // Handle graceful shutdown
    const shutdown = async () => {
      console.log('Shutting down Codegen CI/CD Slack bot...');
      await app.stop();
      process.exit(0);
    };
    
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Error starting Codegen CI/CD Slack bot:', error);
    process.exit(1);
  }
})();