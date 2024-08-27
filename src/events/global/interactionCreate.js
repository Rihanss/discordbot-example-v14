// Import the base Event class
const Event = require('../../structures/EventClass');

// Import the InteractionType enumeration from discord.js
const { InteractionType } = require('discord.js');

// Define and export the InteractionCreate class that extends the Event base class
module.exports = class InteractionCreate extends Event {
    // Constructor to initialize the event with its name and category
	constructor(client) {
		super(client, {
			name: 'interactionCreate', // Event name
			category: 'interaction', // Event category
		});
	}

    // Method to handle the interaction event
	async run(interaction) {
		const client = this.client;

        // Check if the interaction is an application command (e.g., slash command)
		if (interaction.type === InteractionType.ApplicationCommand) {
            // Retrieve the command from the client commands collection
			const command = client.commands.get(interaction.commandName);

            // Ignore interactions from bots
			if (interaction.user.bot) return;

            // Ensure the interaction is from a guild (server); if not, send an error message
			if (!interaction.inGuild() && interaction.type === InteractionType.ApplicationCommand) {
				return interaction.reply({ content: 'You must be in a server to use commands.' });
			}

            // If the command is not found, send an error message and remove the command from the collection
			if (!command) {
				await interaction.reply({ content: 'This command is unavailable. *Check back later.*', ephemeral: true });
				client.commands.delete(interaction.commandName);
				return;
			}

			try {
                // Execute the command
				await command.run(client, interaction);
			}
			catch (e) {
                // Log the error and send an error message if the command fails
				console.log(e);
				await interaction.followUp({ content: `An error has occurred.\n\n**\`${e.message}\`**` });
			}
		}
	}
};
