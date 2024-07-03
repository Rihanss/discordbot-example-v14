// Import the base Event class
const Event = require('../../structures/EventClass');

// Import the ActivityType enumeration from discord.js
const { ActivityType } = require('discord.js');

// Define and export the ReadyEvent class that extends the Event base class
module.exports = class ReadyEvent extends Event {
    // Constructor to initialize the event with its name and the once flag
	constructor(client) {
		super(client, {
			name: 'ready', // Event name
			once: true,    // Indicates that this event should only be handled once
		});
	}

    // Method to handle the 'ready' event
	async run(client) {
        // Set the bot's activity status
		client.user.setActivity('With new user!', { type: ActivityType.Playing });

        // Log a message indicating that the bot is online
		console.log('[INFO] Discord Bot is now online');
	}
};
