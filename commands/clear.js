const Discord = require("discord.js");

module.exports = {
    name: 'clear',
    description: 'a command to clear messages!',
    async execute(client, message, args) {
        const newEmbed = new Discord.MessageEmbed();
        newEmbed.setColor("#FF0000");
        if(!message.member.hasPermission("MANAGE_MESSAGES")) {
            newEmbed.setTitle("You don't have permission to use this command!");
            return message.channel.send(newEmbed);
        }
        if(!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            newEmbed.setTitle("I don't have permission to delete messages here!");
            return message.channel.send(newEmbed);
        }
        if(args.length == 0) {
            newEmbed.setTitle('Enter the amount of messages you want to clear!');
            return message.channel.send(newEmbed);
        } else if(args.length > 1) {
            newEmbed.setTitle('Too many arguments!');
            return message.channel.send(newEmbed);
        } else if(args[0] > 100 || args[0] < 1) {
            newEmbed.setTitle('Please choose a value between 1 and 100!');
            return message.channel.send(newEmbed);
        } else if(isNaN(args[0])) {
            newEmbed.setTitle('Please enter a number!');
            return message.channel.send(newEmbed);
        } else {
            args[0] = Math.floor(args[0]);
            try {
                await message.delete();
                await message.channel.bulkDelete(args[0]);
            } catch (error) {
                newEmbed.setTitle("I can't delete messages here!");
                return message.channel.send(newEmbed);
            }
            newEmbed.setTitle(`${args[0]} message(s) deleted!`);
            const messageSent = await message.channel.send(newEmbed);
            await setTimeout(function() {messageSent.delete();},2000);
        }
    }
}