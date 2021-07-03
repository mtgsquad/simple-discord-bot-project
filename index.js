const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, activity } = require('./config.json');

const client = new Discord.Client();

// Collections
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// Run the command loader
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.once('ready', () => {
	require('./events/ready')(client, activity);
});

client.on("message", async message => {
   require('./events/message')(message, client);
});

client.login(token);
