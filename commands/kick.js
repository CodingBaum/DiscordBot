const Discord = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'this is a command to kick members!',
    execute(client, message) {
        const newEmbed = new Discord.MessageEmbed();
        newEmbed.setColor("#FF0000");
        if(!message.member.hasPermission('KICK_MEMBERS')) {
            newEmbed.setTitle("You don't have the permission to use this command!");
            return message.channel.send(newEmbed);
        } 
        if(!message.guild.me.hasPermission('KICK_MEMBERS')) {
            newEmbed.setTitle("I don't have the right permissions!");
            return message.channel.send(newEmbed);
        } 
        
        if(!message.mentions.users.first) {
            newEmbed.setTitle("Please mention a user!")
            return message.channel.send(newEmbed);
        } 

        if(message.guild.me.roles.highest.position < message.mentions.members.first().roles.highest.position) {
            newEmbed.setTitle("I don't have permission to kick this user!");
            return message.channel.send(newEmbed);
        }

        if(message.member.roles.highest.position <= message.mentions.members.first().roles.highest.position) {
            newEmbed.setTitle("You don't have permission to kick this user!");
            return message.channel.send(newEmbed);
        }

        message.guild.members.cache.get(message.mentions.users.first().id).kick().then((member) => {
            newEmbed
            .setColor('#36BADF')
            .setTitle(member.displayName + " has been kicked successfully!");
            return message.channel.send(newEmbed);
        });
    }
}