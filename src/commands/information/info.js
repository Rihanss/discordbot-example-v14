const Command = require('../../structures/CommandClass');
const information = require('../../assets/json/information');
const kitsu = require('node-kitsu');

const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');

module.exports = class Info extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('info')
				.setDescription('[Holo|Information] See the information')
				.addSubcommand(subcommand => subcommand
					.setName('server')
					.setDescription('See information about current server'))
				.addSubcommand(subcommand => subcommand
					.setName('user')
					.setDescription('[Holo|Information] See information about specific user')
					.addUserOption(option => option
						.setName('user')
						.setDescription('The user you want to check the information')))
				.addSubcommand(subcommand => subcommand
					.setName('role')
					.setDescription('[Holo|Information] See information about a role')
					.addRoleOption(option => option
						.setName('role')
						.setDescription('The role you want to check')))
				.addSubcommand(subcommand => subcommand
					.setName('emotelist')
					.setDescription('[Holo|Information] Show list of the server emote.'),
				)
				.addSubcommand(subcommand => subcommand
					.setName('anime')
					.setDescription('[Holo | Information] See information about anime')
					.addStringOption(option => option
						.setName('anime')
						.setDescription('The anime information you want to check.'))),
			usage: 'info',
			category: 'Information',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
			hidden: false,
		});
	}
	async run(client, interaction) {

		const subcommand = interaction.options.getSubcommand();

		const user = interaction.options.getUser('user') || interaction.user;
		const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id);
		const role = interaction.options.getRole('role');
		const find = interaction.options.getString('anime');

		const guildFeatures = interaction.guild.features.map(feature => information.features[feature]).join(', ');
		const verificationLevels = information.verify[interaction.guild.verificationLevel];
		const afkTimeout = information.afkTimeout[interaction.guild.afkTimeout];
		const owner = await interaction.client.users.fetch(interaction.guild.ownerId);

		switch (subcommand) {
		case 'user': {
			const embed = new EmbedBuilder()
				.setColor('Random')
				.setThumbnail(user.displayAvatarURL({ dynamic: true, size: 2048 }))
				.setTitle(`${user.username}'s information`)
				.addFields({
					name: '__Basic Account Information__',
					value: `
                • **ID »** ${user.id}
                • **Bot »** ${information.bot[user.bot]}
                • **Account Creation »** <t:${Math.floor(member.user.createdAt.getTime() / 1000)}:f>
                • **Account Age »** ${Math.floor((Date.now() - member.user.createdAt) / (1000 * 60 * 60 * 24))} Days
                `,
				})
				.addFields({
					name: '__Member Information__',
					value: `
                • **Nickname »** ${member.nickname ? `${member.nickname}` : 'No Nickname Set'}
                • **Joined At »** <t:${Math.floor(member.joinedAt.getTime() / 1000)}:f>
                `,
				});

			interaction.reply({ embeds: [embed] });
			break;
		}
		case 'server': {
			const embed = new EmbedBuilder()
				.setTitle(`${interaction.guild.name} Information`)
				.setColor('Random')
				.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
				.addFields({
					name: '__Basic Information__',
					value: `
            • **ID »** ${interaction.guild.id}
            • **Created »** <t:${Math.floor(interaction.guild.createdAt.getTime() / 1000)}:f>
            • **Owner »** ${owner.username || 'Unknown'} [${interaction.guild.ownerId || 'Unknown'}]
            • **Verification »** ${verificationLevels}
            • **Total Role »** ${interaction.guild.roles.cache.size}
            `,
				})
				.addFields({
					name: '__Members Information__',
					value: `
            • **Users »** ${interaction.guild.memberCount - interaction.guild.members.cache.filter(x => x.user.bot).size}
            • **Bots »** ${interaction.guild.members.cache.filter(n => n.user.bot).size}
            `,
				})
				.addFields({
					name: '__Channels Information__',
					value: `
            • **Total Channels »** ${interaction.guild.channels.cache.size}
            • **AFK Channel »** ${interaction.guild.afkChannel || 'None'}
            • **AFK Timeout »** ${afkTimeout}
            `,
				})
				.addFields({
					name: 'Guild Features',
					value: `
            ${guildFeatures}
            `,
				});

			interaction.reply({ embeds: [embed] });
			break;
		}
		case 'role': {
			const embed = new EmbedBuilder()
				.setTitle(`Information about role: ${role.name}`)
				.setColor('Random')
				.addFields({
					name: '__Role Information__',
					value: `
                • **Role ID »** ${role.id}
                • **Role Created »** <t:${role.createdTimestamp}:f>
                • **Position »** ${role.rawPosition}
                • **Color »** #${role.color.toString(16)}
                • **Hoisted? »** ${role.hoist}
            `,
				})
				.addFields({
					name: `Permissions: [${role.permissions.toArray().length}]`,
					value: `
                ${role.permissions.toArray().map((permission) => `${permission}`).join(', ')}
            `,
				});

			interaction.reply({ embeds: [embed] });
			break;
		}
		case 'emotelist': {
			const emojis = interaction.guild.emojis.cache.map(x => `${x}`).join('') || 'No Emojis is available in this server';

			const embed = new EmbedBuilder()
				.setTitle(`Emote list for ${interaction.guild.name}`)
				.setColor('Random')
				.setDescription(`${emojis}`);

			interaction.reply({ embeds: [embed] });
			break;
		}
		case 'anime': {
			const embed = new EmbedBuilder()
				.setColor('Green');

			const result = await kitsu.searchAnime(find.replace(/ ,/g, ' '), 0);
			if (!result.length) interaction.reply('No result found!');

			embed.setTitle('Multiple Anime found!');
			embed.setDescription(`${result.map((x, i) => `**${i + 1}.** ${x.attributes.canonicalTitle}`).join('\n')}\n\n**Please enter the number of the Anime you want to view**\n**Or react with** 🚫 **to cancel the command**`);
			try {
				const limitedResults = result.slice(0, 10);

				const optionsArray = limitedResults.map((x, i) => {
					return {
						label: x.attributes.canonicalTitle,
						description: x.attributes.synopsis ? x.attributes.synopsis.substring(0, 100) : 'No description available',
						value: `${i}`,
					};
				});

				const selectMenu = new StringSelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder('Please select anime you want to find.')
					.setMinValues(1)
					.setMaxValues(1)
					.addOptions(optionsArray);

				const bStop = new ButtonBuilder()
					.setCustomId('stop')
					.setEmoji('🚫')
					.setStyle(ButtonStyle.Primary);

				const rowSelectMenu = new ActionRowBuilder().addComponents(selectMenu);
				const rowButton = new ActionRowBuilder().addComponents(bStop);

				await interaction.reply({ embeds: [embed], components: [rowSelectMenu, rowButton] });

				const filter = i => (i.customId === 'stop' || i.customId === 'select') && i.user.id === interaction.user.id;
				const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

				collector.on('collect', async i => {
					if (i.customId === 'stop') {
						await i.update({ content: 'Command cancelled!', components: [], embeds: [] });
						collector.stop();
					}
					else if (i.customId === 'select') {
						const selectedIndex = parseInt(i.values[0]);
						const atts = result[selectedIndex];
						const animeEmbed = new EmbedBuilder();

						animeEmbed.setTitle(atts.attributes.canonicalTitle);
						animeEmbed.setDescription(atts.attributes.synopsis);
						animeEmbed.setImage(atts.attributes.posterImage.original);

						if (atts.attributes.posterImage.medium) animeEmbed.setThumbnail(atts.attributes.posterImage.medium);
						if (atts.attributes.titles.en) animeEmbed.addFields({ name: '**__English title__**', value: atts.attributes.titles.en, inline: false });
						if (atts.attributes.titles.ja_jp) animeEmbed.addFields({ name: '**__Japanese Title__**', value: atts.attributes.titles.ja_jp, inline: false });
						if (atts.attributes.abbreviatedTitles && atts.attributes.abbreviatedTitles.length > 0) animeEmbed.addFields({ name: '**__Synonyms__**', value: `${atts.attributes.abbreviatedTitles}`, inline: false });
						if (atts.attributes.episodeCount && atts.attributes.episodeLength) animeEmbed.addFields({ name: '**__Episodes__**', value: atts.attributes.episodeCount + ' @ ' + atts.attributes.episodeLength + ' minutes', inline: false });
						else if (atts.attributes.episodeCount) animeEmbed.addFields({ name: 'Episodes', value: atts.attributes.episodeCount, inline: false });

						animeEmbed.addFields({ name: '**__Status__**', value: atts.attributes.status, inline: false });
						animeEmbed.addFields({ name: '**__Age Restrictions__**', value: atts.attributes.ageRating + ' ' + atts.attributes.ageRatingGuide, inline: false });
						animeEmbed.addFields({ name: '**__Popularity Rank__**', value: '#' + atts.attributes.popularityRank, inline: false });
						if (atts.attributes.averageRating) {
							animeEmbed.addFields({ name: '**__Rating Rank__**', value: '#' + atts.attributes.ratingRank, inline: false });
							animeEmbed.addFields({ name: '**__Rating__**', value: atts.attributes.averageRating, inline: false });
						}
						if (atts.attributes.startDate && atts.attributes.endDate) animeEmbed.setFooter({ text: atts.attributes.startDate + ' to ' + atts.attributes.endDate });
						else if (atts.attributes.startDate && !atts.attributes.endDate) animeEmbed.setFooter({ text: atts.attributes.startDate });
						animeEmbed.setColor('Blue');

						await i.update({ embeds: [animeEmbed], components: [] });
						collector.stop();
					}
				});

				collector.on('end', collected => {
					if (collected.size === 0) {
						interaction.editReply({ content: 'No response, command timed out.', components: [], embeds: [] });
					}
				});
			}
			catch (e) {
				console.log(e);
			}
		}
		}

	}
};
