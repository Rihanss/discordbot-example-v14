const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = class Role extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('role')
				.setDescription('[Holo|Moderation] Add / Remove role from specified user')
				.setDMPermission(true)
				.addSubcommand(subcommand => subcommand
					.setName('add')
					.setDescription('[Holo|Moderation] Add role from specified user')
					.addUserOption(option => option
						.setName('user')
						.setDescription('User you want to add the role')
						.setRequired(true),
					)
					.addRoleOption(option => option
						.setName('role')
						.setDescription('The role you want to add to the user')
						.setRequired(true),
					)
					.addBooleanOption(option => option
						.setName('ephemeral')
						.setDescription('Make the response to be visible only to the user who issued the command'),
					),
				)
				.addSubcommand(subcommand => subcommand
					.setName('remove')
					.setDescription('[Holo|Moderation] Remove role from specified user')
					.addUserOption(option => option
						.setName('user')
						.setDescription('User you want to remove the role')
						.setRequired(true),
					)
					.addRoleOption(option => option
						.setName('role')
						.setDescription('The role you want to remove')
						.setRequired(true),
					)
					.addBooleanOption(option => option
						.setName('ephemeral')
						.setDescription('Make the response to be visible only to the user who issued the command'),
					),
				),
			usage: '/role add/remove user:@user role:@role',
			category: 'Moderation',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links', 'Manage Roles'],
			hidden: false,
		});
	}

	async run(client, interaction) {
		if (!this.run) throw new RangeError('Expected a run method');

		if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.ManageRoles)) {
			return interaction.reply({ embeds: [client.embeds.missingPermsEmbed('I need the \'Manage Roles\' permission to manage members roles.', 'Make sure I have the correct permission to do this.')], ephemeral: true });
		}
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
			return interaction.reply({ embeds: [client.embeds.missingPermsEmbed('You need \'Manage Roles\' permission to manage members roles.', 'Make sure you have the correct permission to do this.')], ephemeral: true });
		}

		const subcommand = interaction.options.getSubcommand();
		const user = interaction.options.getUser('user');
		const role = interaction.options.getRole('role');
		const ephemeral = interaction.options.getBoolean('ephemeral');

		await interaction.guild.members.fetch(user);
		const member = interaction.guild.members.cache.get(user.id);

		switch (subcommand) {
		case 'add': {
			if (!member.manageable) {
				return interaction.reply({ embeds: [client.embeds.errorEmbed('Failed to add role', `I cannot add ${role} role to **${user.username}** because it's higher or equal in position to my highest role.`)] });
			}

			if (member.roles.cache.has(role.id)) {
				return interaction.reply({ embeds: [client.embeds.errorEmbed('Failed to add role', `${user.username} already has the role ${role}`)] });
			}

			await member.roles.add(role);

			const embed = new EmbedBuilder()
				.setTitle('Role Added')
				.setColor('Green')
				.setDescription(`${role} has been added to **${user.username}**`)
				.setTimestamp();

			await interaction.reply({ embeds: [embed], ephemeral: ephemeral || false });
			break;
		}
		case 'remove': {
			if (!member.manageable) {
				return interaction.reply({ embeds: [client.embeds.errorEmbed('Failed to remove role', `I cannot remove ${role} role from **${user.username}** because it's higher or equal in position to my highest role.`)] });
			}

			if (!member.roles.cache.has(role.id)) {
				return interaction.reply({ embeds: [client.embeds.errorEmbed('Failed to remove role', `${user.username} doesn't have the role ${role}`)] });
			}

			await member.roles.remove(role);

			const embed = new EmbedBuilder()
				.setTitle('Role Removed')
				.setColor('Green')
				.setDescription(`${role} has been removed from **${user.username}**`)
				.setTimestamp();

			await interaction.reply({ embeds: [embed], ephemeral: ephemeral || false });
			break;
		}
		}
	}
};
