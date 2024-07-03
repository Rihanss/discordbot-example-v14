// This file is used command template incase if you want to make more commands.

const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class Example extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('')
				.setDescription('')
				.setDMPermission(true),
			usage: '',
			category: '',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
			hidden: false,
		});
	}

	async run(client, interaction) {
		
	}
};
