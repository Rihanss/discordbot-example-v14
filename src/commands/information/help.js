/* eslint-disable no-mixed-spaces-and-tabs */
const Command = require('../../structures/CommandClass');

const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class Help extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('help')
				.setDescription('[Holo:Information] Returns command information.')
				.setDMPermission(true)
				.addStringOption(option => option
					.setName('command')
					.setDescription('The command you want to get help.')
					.setRequired(false)),
			usage: 'help <command>',
			category: 'Information',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
			hidden: false,
		});
	}

	async run(client, interaction) {
		const commandName = interaction.options.getString('command');

		if (commandName) {
		  const command = client.commands.get(commandName);
		  if (command) {
				const embed = new EmbedBuilder()
			  .setTitle(`${command.name} Command`)
			  .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
			  .setColor('Random')
			  .setDescription(`
			  > ${command.contextDescription ? command.contextDescription : command.description}

			  **Usage:** ${command.contextDescription ? 'Right-Click > Apps > ' : '/'}${command.usage}
			  **Category:** ${command.category}
			  **Permissions Needed:** ${command.permissions[0] ? `${command.permissions.join(', ')}` : 'None'}
			  `);
				await interaction.reply({ embeds: [embed] });
		  }
			else {
				await interaction.reply('Command not found.');
		  }
		}
		else {
		  const embed = new EmbedBuilder()
				.setTitle(`${client.user.username} Commands`)
				.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
				.setColor('Random')
				.setDescription('To get specific command from categories, run `/help <command>`\n**`<>` required** and **`[]` optional**');
		  client.helps.forEach((commandsArray, category) => {
				const hidden = commandsArray.some(command => command.hidden);
				if (!hidden) {
					let commandsString = '';
					commandsArray.forEach(command => {
			  commandsString += `\`${command.name}\` `;
					});

					embed.addFields({ name: category, value: commandsString, inline: false });
				}
		  });
		  await interaction.reply({ embeds: [embed] });
		}
	  }
};
