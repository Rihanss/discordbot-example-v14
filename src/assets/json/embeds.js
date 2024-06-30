const { EmbedBuilder } = require('discord.js');

module.exports = {
	missingPermsEmbed(reason, usage) {
		return new EmbedBuilder()
			.setColor('Red')
			.setTitle('Missing Permission')
			.addFields({ name: '❓ Reason', value: reason || 'None specified' })
			.addFields({ name: '🗒 Usage', value: usage || 'None specified' });
	},

	wrongUsageEmbed(reason, usage) {
		return new EmbedBuilder()
			.setColor('Red')
			.setTitle('Invalid Usage')
			.addFields({ name: '❓ Reason', value: reason || 'None specified' })
			.addFields({ name: '🗒 Usage', value: usage || 'None specified' });
	},

	actionEmbed(title, description, image) {
		return new EmbedBuilder()
			.setColor('Random')
			.setTitle(title)
			.setDescription(description)
			.setImage(image);
	},

	errorEmbed(title, description) {
		return new EmbedBuilder()
			.setColor('Red')
			.setTitle(title)
			.setDescription(description);
	},

	successEmbed(title, description) {
		return new EmbedBuilder()
			.setColor('Green')
			.setTitle(title)
			.setDescription(description);
	},

	reminderEmbed(title, description) {
		return new EmbedBuilder()
			.setColor('Green')
			.setTitle(title)
			.setDescription(description);
	},
};
