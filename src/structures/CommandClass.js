// Export the Command class to be used elsewhere in the application
module.exports = class Command {
    // Constructor method to initialize a new Command instance
    constructor(client, meta = {}) {
        // Store the client instance which represents the Discord bot
        this.client = client;

        // Assign metadata to properties with default values if not provided
        this.data = meta.data; // Command-specific data, usually for Discord's API
        this.contextDescription = meta.contextDescription || null; // Optional description for context menus
        this.usage = meta.usage || this.name; // Usage description for how the command should be used
        this.category = meta.category || 'Info'; // Category under which the command is grouped
        this.permissions = meta.permissions || ['Use Application Commands', 'Send Messages', 'Embed Links']; // Permissions required to use the command
        this.hidden = meta.hidden || false; // Boolean to determine if the command should be hidden from help lists
    }

    // Placeholder method to be overridden by subclasses
    run() {
        // Throw an error if the run method is not implemented in a subclass
        throw new Error(`The Slash Command "${this.name}" does not provide a run method.`);
    }
};
