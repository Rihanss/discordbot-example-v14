/* eslint-disable max-nested-callbacks */
const Discord = require('discord.js');
const fs = require('fs');

module.exports = client => {
	// = Loading the commands = //
	client.commands = new Discord.Collection();
	client.aliases = new Discord.Collection();
	client.helps = new Discord.Collection();

	// function loadCmds () {
	fs.readdir('./src/commands/', (err, categories) => {
		if (err) console.log(err);
		console.log(`Found total ${categories.length} category.`);
		categories.forEach(category => {
			const moduleConf = require(`../commands/${category}/module.json`);
			moduleConf.path = `./commands/${category}`;
			moduleConf.cmds = [];
			client.helps.set(category, moduleConf);
			if (!moduleConf) return;

			fs.readdir(`./src/commands/${category}`, (error, files) => {
				console.log(`Found total ${files.length - 1} commands from the ${category} category.`);
				if (error) console.log(error);
				files.forEach(file => {
					//  delete require.cache[require.resolve(`../commands/${category}/${file}`)];
					if (!file.endsWith('.js')) return;
					const prop = require(`../commands/${category}/${file}`);
					client.commands.set(prop.help.name, prop);
					prop.conf.aliases.forEach(alias => {
						client.aliases.set(alias, prop.help.name);
					});
					client.helps.get(category).cmds.push(prop.help.name);
				});
			});
		});
	});
};
// }
