const Command = require('../../structures/CommandClass');

const { EmbedBuilder } = require('discord.js');
const { PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class Ban extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('ban')
				.setDescription('[Holo|Moderation] Ban a member from the server.')
				.setDMPermission(true)
				.addUserOption(option => option
					.setName('user')
					.setDescription('The user you want to ban avatar')
					.setRequired(true),
				)
				.addStringOption(option => option
					.setName('reason')
					.setDescription('The reason you want to ban')
					.setRequired(false),
				)
				.addBooleanOption(option => option
					.setName('hidden')
					.setDescription('Silent Ban?')
					.setRequired(false),
				),
			usage: 'ban <@user | id> [reason]',
			category: 'Moderation',
			permissions: ['Ban Members', 'User Ban Members'],
			hidden: false,
		});
	}
	async run(client, interaction) {
		if (!interaction.guild) return;

		if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.BanMembers)) {
			return interaction.reply({ embeds: [client.embeds.missingPermsEmbed('I need the \'Ban Members\' permission to ban members.', 'Make sure I have the correct permission to do this.')], ephemeral: true });
		}
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
			return interaction.reply({ embeds: [client.embeds.missingPermsEmbed('You need \'Ban Members\' permission to ban members.', 'Make sure you have the correct permission to do this.')], ephemeral: true });
		}
		const user = interaction.options.getUser('user');
		if (user.id === interaction.user.id) return interaction.reply({ embeds: [client.embeds.wrongUsageEmbed('You cannot ban yourself.', 'Please mention user you want to ban')], ephemeral: true });
		if (user.id === client.user.id) return interaction.reply({ embeds: [client.embeds.wrongUsageEmbed('what why?', 'Please mention another user other than me...')], ephemeral: true });
		const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id);

		if (!member.bannable) {
			return interaction.reply({ embeds: [client.embeds.missingPermsEmbed('I cannot ban that user, do I have the right permissions or their role is higher than mine?', 'Make sure I have the correct permissions to do this.')], ephemeral: true });
		}

		let reason = interaction.options.getString('reason');
		if (!reason) reason = 'No reason specified';

		let silentMode = interaction.options.getBoolean('hidden');
		if (!silentMode) silentMode = false;

		const serverEmbed = new EmbedBuilder()
			.setTitle('Server ban')
			.setColor('Red')
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
			.setDescription(`
                **Offender »** ${member.user.tag} (${member.user.id})
                **Reason »** ${reason}

                **Server »** ${interaction.guild.name}
                **Moderator »** ${interaction.user.username}
            `);

		user.send({ embeds: [serverEmbed], ephemeral: false })
			.then(() => {
				member.ban({ days: 7, reason: reason })
					.then(() => {
						const embed = new EmbedBuilder()
							.setTitle('Server ban')
							.setColor('Red')
							.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
							.setDescription(`
                                **Offender »** ${member.user.tag} (${member.user.id})
                                **Reason »** ${reason}
                                **Moderator »** ${interaction.user.tag}
                            `);
						interaction.reply({ embeds: [embed], ephemeral: silentMode });
					})
					.catch((error) => {
						console.error(`Failed to ban member: ${error}`);
						interaction.reply({ embeds: [client.embeds.missingPermsEmbed('I cannot ban that user, do I have the right permissions or their role is higher than mine?', 'Make sure I have the correct permissions to do this.')], ephemeral: true });
					});
			})
			.catch((error) => {
				console.error(`Failed to send DM to user: ${error}`);
				interaction.reply({ embeds: [client.embeds.errorEmbed('Failed to send DM to user.', 'The user has DM disabled')], ephemeral: true });
			});
	}
};