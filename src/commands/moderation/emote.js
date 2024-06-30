const Command = require('../../structures/CommandClass');

const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder, DiscordAPIError } = require('discord.js');

module.exports = class AddEmote extends Command {
    constructor(client) {
        super(client, {
            data: new SlashCommandBuilder()
                .setName('emote')
                .setDescription('[Holo | Moderation] Add emote to your server using this command!')
                .setDMPermission(true)
                .addAttachmentOption(option => option
                    .setName('emote')
                    .setDescription('Image you want to turn into server emote.')
                    .setRequired(true),
                )
                .addStringOption(option => option
                    .setName('name')
                    .setDescription('The name of the emote')
                    .setRequired(true),
                ),
            usage: 'emote <image> <name>',
            category: 'Moderation',
            permissions: ['Use Application Commands', 'Send Messages', 'Embed Links', 'Manage Expression'],
            hidden: false,
        });
    }

    async run(client, interaction) {
        await interaction.deferReply();

        // Check bot permissions
        if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.ManageGuildExpressions)) {
            return interaction.editReply({
                embeds: [client.embeds.missingPermsEmbed('I need the \'Manage Expressions\' permission to add emotes.', 'Make sure I have the correct permission to do this.')],
                ephemeral: true,
            });
        }

        // Check user permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuildExpressions)) {
            return interaction.editReply({
                embeds: [client.embeds.missingPermsEmbed('You need \'Manage Expressions\' permission to add emotes.', 'Make sure you have the correct permission to do this.')],
                ephemeral: true,
            });
        }

        // Get the options from the interaction
        const upload = interaction.options.getAttachment('emote');
        const name = interaction.options.getString('name');

        try {
            // Add the emoji to the guild
            const emoji = await interaction.guild.emojis.create({
                attachment: upload.attachment,
                name: name,
            });

            const embed = new EmbedBuilder()
                .setTitle('Emote Added')
                .setDescription(`Successfully added emote ${emoji} with the name \`${name}\`.`)
                .setColor('Green');

            return interaction.editReply({ embeds: [embed] });
        }
        catch (error) {
            if (error instanceof DiscordAPIError) {
                let errorMessage;

                if (error.code === 50045) {
                    errorMessage = 'The uploaded image exceeds the maximum allowed size of 32 MB. Please upload an image smaller than 32 MB.';
                }
                else {
                    errorMessage = `An unexpected error occurred. Please try again later.\n${error}`;
                }

                // Create an error embed with a user-friendly message
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription(errorMessage)
                    .setColor('Red');

                // Send the error message
                return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            }
            else {
                // Handle other errors
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('An unexpected error occurred. Please try again later.')
                    .setColor('Red');

                    return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};
