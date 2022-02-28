const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client({Intents: [Discord.Intents.FLAGS.GUILDS]});

client.commands = new Discord.Collection();
client.events = new Discord.Collection();


['command_handler', 'event_handler'].forEach(handler => {
    require(`./handler/${handler}`)(client, Discord);
});

client.login(process.env.DISCORD_TOKEN);