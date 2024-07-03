/* eslint-disable max-nested-callbacks */ // Disable the ESLint rule for maximum nested callbacks

// Import required modules
const Discord = require('discord.js');
const fs = require('fs');

// Export a function that initializes commands and their aliases
module.exports = client => {
    // Initialize collections to store commands, aliases, and helps
    client.commands = new Discord.Collection();
    client.aliases = new Discord.Collection();
    client.helps = new Discord.Collection();

    // Read the categories directory to load commands
    fs.readdir('./src/commands/', (err, categories) => {
        if (err) {
            console.error('Error reading commands directory:', err);
            return;
        }

        // Log the number of categories found
        console.log(`Found total ${categories.length} category(ies).`);

        // Iterate over each category
        categories.forEach(category => {
            // Load module configuration for the category
            const moduleConf = require(`../commands/${category}/module.json`);
            moduleConf.path = `./commands/${category}`; // Set path to the category
            moduleConf.cmds = []; // Initialize an array to hold command names

            // Add category configuration to the helps collection
            client.helps.set(category, moduleConf);

            // Read the files in the category directory
            fs.readdir(`./src/commands/${category}`, (error, files) => {
                if (error) {
                    console.error(`Error reading commands in category ${category}:`, error);
                    return;
                }

                // Log the number of command files found (excluding the module.json)
                console.log(`Found total ${files.length - 1} command(s) in the ${category} category.`);

                // Iterate over each file in the category
                files.forEach(file => {
                    // Skip non-JavaScript files
                    if (!file.endsWith('.js')) return;

                    // Require the command file and add it to the commands collection
                    const prop = require(`../commands/${category}/${file}`);
                    client.commands.set(prop.help.name, prop);

                    // Add aliases to the aliases collection
                    prop.conf.aliases.forEach(alias => {
                        client.aliases.set(alias, prop.help.name);
                    });

                    // Add command name to the category's command list
                    client.helps.get(category).cmds.push(prop.help.name);
                });
            });
        });
    });
};
