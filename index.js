// Import the custom Client class from the 'src/structures/Client.js' file.
const Client = require('./src/structures/Client.js');

// Create a new instance of the Client class.
const client = new Client();

// Log in the client using the login method, which presumably uses credentials from environment variables.
client.login();
