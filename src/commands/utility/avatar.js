const Command = require('../../structures/CommandClass');
const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class Avatar extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('avatar')
				.setDescription('[Holo|Utility] Show your or others avatar')
				.setDMPermission(true)
				.addUserOption(option => option.setName('user')
					.setDescription('The user you want to view its avatar')
					.setRequired(false)),
			usage: 'avatar [@user]',
			category: 'Utility',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
			hidden: false,
		});
	}

	run(client, interaction) {
		const user = interaction.options.getUser('user') || interaction.user;
		const embed = new EmbedBuilder()
			.setTitle(`${user.tag} Avatar`)
			.setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
			.setColor('Random');

		interaction.reply({ embeds: [embed] });
	}
};
