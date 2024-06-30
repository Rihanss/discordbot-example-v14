const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');
require('dotenv').config();

const deploy = async () => {
	const commandData = [];

	// Define counters for updated and unchanged commands
	let updatedCommands = 0;
	let unchangedCommands = 0;

	fs.readdirSync('./src/commands/').forEach(category => {
		const commands = fs.readdirSync(`./src/commands/${category}/`).filter(cmd => cmd.endsWith('.js'));

		for (const command of commands) {
			const Command = require(`./src/commands/${category}/${command}`);
			const cmd = new Command();
			const cmdData = cmd.data.toJSON();
			commandData.push(cmdData);

			// Check if the command already exists in the commandData array
			const existingCommand = commandData.find(c => c.name === cmdData.name);
			if (existingCommand) {
				// Compare the existing command's JSON representation with the new command's JSON representation
				if (JSON.stringify(existingCommand) !== JSON.stringify(cmdData)) {
					// Command has been updated
					updatedCommands++;
				}
				else {
					// Command is unchanged
					unchangedCommands++;
				}
			}
		}
	});

	const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

	try {
		const clientId = process.env.CLIENTID;

		console.log(`[${new Date().toString().split(' ', 5).join(' ')}] Started refreshing Slash Commands and Context Menus...`);

		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commandData },
		).then(() => {
			console.log(`[${new Date().toString().split(' ', 5).join(' ')}] Slash Commands and Context Menus have now been deployed globally.`);
			console.log(`[${new Date().toString().split(' ', 5).join(' ')}] Updated Commands: ${updatedCommands}`);
			console.log(`[${new Date().toString().split(' ', 5).join(' ')}] Unchanged Commands: ${unchangedCommands}`);
		});
	}
	catch (e) {
		console.error(e);
	}
};

deploy();

require('./index');
