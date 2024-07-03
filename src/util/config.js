// Load environment variables from a .env file into process.env
require('dotenv').config();

// Export an object containing client configuration
module.exports = {
	clientConfig: {
		token: process.env.TOKEN,    // Read the bot token from environment variables
		clientId: process.env.CLIENTID, // Read the client ID from environment variables
	}
};
