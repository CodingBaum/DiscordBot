const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'set-channel',
    description: 'set channel settings for certain features',
    execute(client, message, args) {
        const newEmbed = new Discord.MessageEmbed();
        newEmbed.setColor("#FF0000");

        if (!message.member.hasPermission('MANAGE_CHANNELS')) {
            newEmbed.setTitle("You don't have the permission to use this command!");
            return message.channel.send(newEmbed);
        }
        if (args[0] == "welcome") {
            args.shift();
            let welcome = {
                guild: message.guild.id,
                channelName: message.channel.name,
                channelID: message.channel.id,
                welcomeMessage: args.join(' ')
            }

            let data = fs.readFileSync(path.resolve(__dirname, '../data/guildMemberAddSettings.json'));
            let settings = JSON.parse(data);

            settings.welcome = settings.welcome.filter(function(value){
                return value.guild != welcome.guild;
            });

            settings.welcome.push(welcome);

            fs.writeFileSync(path.resolve(__dirname, '../data/guildMemberAddSettings.json'), JSON.stringify(settings));
        }
    }
}