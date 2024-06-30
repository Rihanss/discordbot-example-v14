const Command = require('../../structures/CommandClass');

const { PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class Purge extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('purge')
				.setDescription('[Holo|Moderation] Remove up to 100 messages in the channel')
				.setDMPermission(true)
				.addIntegerOption(option => option
					.setName('number')
					.setDescription('total messages you want to purge')
					.setRequired(false),
				)
				.addUserOption(option => option
					.setName('user')
					.setDescription('User you want to delete their messages')
					.setRequired(false),
				),
			usage: 'purge [@user | number] / [number]',
			category: 'Moderation',
			permissions: ['Manage Messages', 'User Manage Messages'],
			hidden: false,
		});
	}
	async run(client, interaction) {
		if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.ManageMessages)) {
			return interaction.reply({ embeds: [client.embeds.missingPermsEmbed('I need the \'manage messages\' permission to purge messages.', 'Make sure I have the correct permission to do this.')], ephemeral: true });
		}
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
			return interaction.reply({ embeds: [client.embeds.missingPermsEmbed('You need \'manage messages\' permission to purge messages.', 'Make sure you have the correct permission to do this.')], ephemeral: true });
		}
		const amount = interaction.options.getInteger('number');
		const targetUser = interaction.options.getUser('user');

		if (!amount || amount <= 0 || amount > 100) {
			return interaction.reply({ embeds: [client.embeds.errorEmbed('Invalid number of messages', 'Please provide a number between 1 and 100 for the messages to be deleted.')], ephemeral: true });
		}

		try {
			const messages = await interaction.channel.messages.fetch({ limit: amount + 1 });

			const filteredMessages = targetUser ? messages.filter(message => message.author.id === targetUser.id) : messages;

			await interaction.channel.bulkDelete(filteredMessages);

			setTimeout(() => {
				interaction.deleteReply();
			}, 3000);

			if (targetUser) {
				return interaction.reply({ embeds: [client.embeds.successEmbed('Command execution successful', `\`${targetUser.tag}\`'s \`${amount}/100\` messages, including the bot's message, have been deleted from the current channel!`)] });
			}
			else {
				return interaction.reply({ embeds: [client.embeds.successEmbed('Command execution successful', `\`${amount}/100\` messages, including the bot's message, have been deleted from the current channel!`)] });
			}
		}
		catch (error) {
			interaction.channel.get('1240287042123071559').send(`An error has happened in purge.js\n${error.message}`);
			return interaction.reply({ embeds: [client.embeds.errorEmbed('Deleting messages failed', `${error.message}`)] });
		}
	}

};