const Command = require('../../structures/CommandClass');

const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { get } = require('node-superfetch');
const { stripIndents } = require('common-tags');

module.exports = class EightBall extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('8ball')
				.setDescription('[Holo|Fun] Tell to the mighty 8 Ball about your fortune.')
				.setDMPermission(true)
				.addStringOption(option => option
					.setName('question')
					.setDescription('The question you want to ask')
					.setRequired(true)),
			usage: '8ball <question>',
			category: 'Fun',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
			hidden: false,
		});
	}

	async run(client, interaction) {
		const args = interaction.options.getString('question');

		const { body } = await get(`https://eightballapi.com/api?question=${args}&lucky=false`);

		const embed = new EmbedBuilder()
			.setTitle('**8 Ball 🎱**')
			.setColor('Random')
			.setDescription(stripIndents`**Question »** ${args}\n**Answer »** ${body.reading}`);

		return interaction.reply({ embeds: [embed] });
	}
};
