/* eslint-disable no-unused-vars */

// Command Template
// This template is designed to help you create new commands for your Discord bot.
// To use this template:
// 1. Copy this file and rename it to match your command's purpose (e.g., `PingCommand.js`).
// 2. Update the following sections as necessary:

// - **Command Name**: Set the command's name using the `.setName()` method.
// - **Command Description**: Provide a brief description of what the command does with `.setDescription()`.
// - **DM Permission**: Use `.setDMPermission(true)` if the command can be used in DMs.
// - **Usage Information**: Specify how to use the command in the `usage` property (e.g., `ping`).
// - **Command Category**: Indicate the category this command belongs to (e.g., `Utility`, `Moderation`).
// - **Permissions Required**: Define which permissions are needed to use this command in the `permissions` array.
// - **Hidden Status**: Set `hidden` to true if you want to hide the command from help listings.

// Finally, implement the command logic inside the `run` method.
// This method will be executed when the command is invoked by a user.

const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class Example extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('') // Set the command name here
				.setDescription('') // Set the command description here
				.setDMPermission(true), // Allow the command in DMs
			usage: '', // Usage format for the command
			category: '', // Category of the command
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'], // Required permissions
			hidden: false, // Whether to hide the command from help listings
		});
	}

	async run(client, interaction) {
		// Implement your command logic here.
		// For example, send a response message using: await interaction.reply('Hello!');
	}
};

// Event Template
// This template is designed to help you create new event handlers for your Discord bot.
// To use this template:
// 1. Copy this file and rename it to match the event you want to handle (e.g., `GuildMemberAdd.js`).
// 2. Update the following sections as necessary:

// - **Event Name**: Set the name of the event in the constructor (e.g., 'guildMemberAdd').
// - **Event Category**: Specify the category of the event for better organization (e.g., 'guild', 'interaction').

// Finally, implement the event handling logic inside the `run` method.
// This method will be executed when the specified event occurs.

const Event = require('../../structures/EventClass');

module.exports = class Example extends Event {
    constructor(client) {
        super(client, {
            name: '', // Set the event name here
            category: '', // Specify the category of the event
        });
    }

	async run() {
		// Implement your event handling logic here.
		// For example: console.log('An example event has occurred!');
	}
};

