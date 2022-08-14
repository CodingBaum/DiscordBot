const Discord = require('discord.js');
const { API, Regions, Locales, Queue } = require('node-valorant-api');
require('dotenv').config();
const valorant = new API(Regions.EU, process.env.VALORANT_API_KEY, Regions.EUROPE);

module.exports = {
    name: 'valinfo',
    description: 'a command to get valorant specific data using the riot games api',
    async execute(client, message) {
        await valorant.ContentV1.getContent(Locales["en-US"]).then(async(content) => {
            await message.channel.send(content.characters.map(char => char.name));
        });
    }
}