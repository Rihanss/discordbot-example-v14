const { Client, GatewayIntentBits } = require('discord.js');
const { Collection } = require('@discordjs/collection');

const CommandHandler = require('../handle/Command');
const EventHandler = require('../handle/Events');

module.exports = class Bot extends Client {
	constructor(...opt) {
		super({
			opt,
			partials: [
				'GUILD_MEMBERS',
				'MESSAGE',
				'CHANNEL',
				'USER',
			],
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildMessageReactions,
				GatewayIntentBits.GuildEmojisAndStickers,
				GatewayIntentBits.GuildIntegrations,
			],
		});
		this.config = require('../util/config.js');
		this.util = require('../util/util.js');
		this.embeds = require('../../src/assets/json/embeds');

		this.helps = new Collection();
		this.commands = new Collection();
		this.events = new Collection();

		new EventHandler(this).build('../events/global');
		new CommandHandler(this).build('../commands');
	}

	async login() {
		await super.login(process.env.TOKEN);
	}

	exit() {
		if (this.quitting) return;
		this.quitting = true;
		this.destroy();
	}

	fetchCommand(cmd) {
		return this.commands.get(cmd);
	}
};
