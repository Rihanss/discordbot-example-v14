// Import necessary classes from the discord.js library
const { Client, GatewayIntentBits } = require('discord.js');
// Import the Collection class from the @discordjs/collection package
const { Collection } = require('@discordjs/collection');

// Import custom handlers for commands and events
const CommandHandler = require('../handle/Command');
const EventHandler = require('../handle/Events');

// Define and export the Bot class, which extends the Client class from discord.js
module.exports = class Bot extends Client {
    // Constructor method for initializing the bot instance
    constructor(...opt) {
        // Call the parent Client constructor with options and intents
        super({
            opt, // Pass additional options
            partials: [
                'GUILD_MEMBERS', // To receive events related to guild members (such as joins or leaves)
                'MESSAGE', // To receive partial message data
                'CHANNEL', // To receive partial channel data
                'USER', // To receive partial user data
            ],
            intents: [
                GatewayIntentBits.Guilds, // Required for general guild (server) events
                GatewayIntentBits.GuildVoiceStates, // Required for voice state changes (e.g., user joins/leaves a voice channel)
                GatewayIntentBits.GuildMembers, // Required to receive member updates
                GatewayIntentBits.GuildMessages, // Required for receiving message events
                GatewayIntentBits.GuildMessageReactions, // Required for receiving reaction events on messages
                GatewayIntentBits.GuildEmojisAndStickers, // Required to receive events related to emojis and stickers
                GatewayIntentBits.GuildIntegrations, // Required for integration events (e.g., linked accounts)
            ],
        });

        // Load configuration and utility files
        this.config = require('../util/config.js');
        this.util = require('../util/util.js');
        this.embeds = require('../../src/assets/json/embeds');

        // Initialize Collections to store commands, events, and helps
        this.helps = new Collection();
        this.commands = new Collection();
        this.events = new Collection();

        // Instantiate and build the event and command handlers
        new EventHandler(this).build('../events/global');
        new CommandHandler(this).build('../commands');
    }

    // Method to log in to Discord using the bot token
    async login() {
        await super.login(process.env.TOKEN); // Use the token from environment variables
    }

    // Method to gracefully shut down the bot
    exit() {
        if (this.quitting) return; // Prevent multiple shutdown attempts
        this.quitting = true;
        this.destroy(); // Close the bot connection and clean up resources
    }

    // Method to fetch a command by its name
    fetchCommand(cmd) {
        return this.commands.get(cmd); // Retrieve the command from the commands collection
    }
};
