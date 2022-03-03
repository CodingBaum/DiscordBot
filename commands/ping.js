const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'this is a ping command!',
    execute(client, message) {
        
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#40E0D0')
        .setTitle('Ping')
        .addFields(
            {name: 'Successful!', value: client.ws.ping + 'ms'}
        );

        message.channel.send(newEmbed);
    }
}