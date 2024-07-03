// Export the Event class to be used elsewhere in the application
module.exports = class Event {
    // Constructor method to initialize a new Event instance
    constructor(client, options = []) {
        // Store the client instance which represents the Discord bot
        this.client = client;

        // Assign options to properties with default values if not provided
        this.name = options.name; // The name of the event, e.g., 'messageCreate'
        this.raw = options.raw || false; // Boolean indicating whether to handle raw event data
        this.once = options.once || false; // Boolean indicating whether the event should be handled only once
    }

    // Placeholder method to be overridden by subclasses
    run() {
        // Throw an error if the run method is not implemented in a subclass
        throw new Error(`The Event "${this.name}" does not provide a run method. Please check it again.`);
    }
};
