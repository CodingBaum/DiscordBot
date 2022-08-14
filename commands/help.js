const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'this is a helper command!',
    execute(client, message) {
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#5dd61f')
        .setTitle("Commandlist for the 'ThisIsNotABot' Bot")
        .setURL('https://discord.com/api/oauth2/authorize?client_id=821280752326279230&permissions=8&scope=bot%20applications.commands')
        .addFields(
            {name: '-ping', value: 'a command to check whether the bot is responding'},
            {name: '-clear [amount of messages]', value: 'a command to clear a specified amount of messages'},
            {name: '-roast [name]', value: "a command to roast people you don't like"},
            {name: '-image [image name]', value: 'a command to search images on google'},
            {name: '-google [query]', value: 'used to search up things on google'}
        )
        .setFooter('this bot was created by Affenkiller');
        message.channel.send(newEmbed);
    }
}