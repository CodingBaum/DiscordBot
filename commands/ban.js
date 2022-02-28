const Discord = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'this is a command to ban members!',
    execute(client, message) {
        const newEmbed = new Discord.MessageEmbed();
        newEmbed.setColor("#FF0000");
        if(!message.member.hasPermission('BAN_MEMBERS')) {
            newEmbed.setTitle("You don't have the permission to use this command!");
            return message.channel.send(newEmbed);
        }
        if(!message.guild.me.hasPermission('BAN_MEMBERS')) {
            newEmbed.setTitle("I don't have the right permissions!");
            return message.channel.send(newEmbed);
        }
        
        if(!message.mentions.users.first) {
            newEmbed.setTitle("Please mention a user!");
            return message.channel.send(newEmbed);
        }

        if(message.guild.me.roles.highest.position < message.mentions.members.first().roles.highest.position) {
            newEmbed.setTitle("I'm not able to ban this user!");
            return message.channel.send(newEmbed);
        }

        if(message.member.roles.highest.position <= message.mentions.members.first().roles.highest.position) {
            newEmbed.setTitle("You don't have permission to ban this user!");
            return message.channel.send(newEmbed);
        }

        message.guild.members.cache.get(message.mentions.users.first().id).ban().then((member) => {
            newEmbed
            .setColor('#36BADF')
            .setTitle(member.displayName + "has been banned successfully!");
            return message.channel.send(newEmbed);
        });
    }
}