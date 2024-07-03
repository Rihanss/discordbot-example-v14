// Import the BaseEvent class to ensure that events extend it
const BaseEvent = require('../structures/EventClass');
// Import path module to handle file and directory paths
const path = require('path');
// Import fs.promises for file system operations (e.g., reading directories)
const fs = require('fs').promises;

// Define and export the EventClass
module.exports = class EventClass {
    // Constructor method to initialize a new EventClass instance
    constructor(client) {
        // Store the client instance which represents the Discord bot
        this.client = client;
    }

    // Asynchronous method to build events from files in the specified directory
    async build(dir) {
        // Create the full path to the directory containing event files
        const filePath = path.join(__dirname, dir);
        // Read the contents of the directory
        const files = await fs.readdir(filePath);

        // Iterate over each file in the directory
        for (const file of files) {
            // Get the full path to the file
            const fullPath = path.join(filePath, file);
            // Get file statistics (e.g., whether it's a directory)
            const stat = await fs.lstat(fullPath);

            // If the file is a directory, recursively build events from it
            if (stat.isDirectory()) {
                await this.build(path.join(dir, file)); // Added await to ensure directories are processed correctly
            }
            // If the file is a JavaScript file, process it as an event
            if (file.endsWith('.js')) {
                // Dynamically import the event file
                const Event = require(fullPath);

                // Check if the imported class extends the BaseEvent class
                if (Event.prototype instanceof BaseEvent) {
                    // Create a new instance of the event class
                    const event = new Event(this.client);

                    // Add the event to the client's events collection
                    this.client.events.set(event.name, event);

                    // Register the event with the client
                    // If event.once is true, use client.once (for one-time events)
                    // Otherwise, use client.on (for recurring events)
                    // Bind the event's run method to the event instance
                    event.once ? 
                        this.client.once(event.name, event.run.bind(event)) :
                        this.client.on(event.name, event.run.bind(event));
                }
            }
        }

        // Log the number of events that have been loaded
        console.log(`[INFO] Bot Events : ${files.length} Events Loaded!`);
    }
};
