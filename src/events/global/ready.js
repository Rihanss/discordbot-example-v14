const Event = require('../../structures/EventClass');

const { ActivityType } = require('discord.js');

module.exports = class ReadyEvent extends Event {
	constructor(client) {
		super(client, {
			name: 'ready',
			once: true,
		});
	}

	async run(client) {

		client.user.setActivity('With new user!', { type: ActivityType.Playing });
		console.log('[INFO] Discord Bot is now online');

	}
};
