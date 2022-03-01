const { inlineCode } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'tictactoe',
    description: 'a command to challange a friend to tictactoe!',
    execute(client, message, args) {
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#FF0000');

        let data = fs.readFileSync(path.resolve(__dirname, '../data/tictactoeGames.json'));
        let info = JSON.parse(data);

        if (args.length == 0) {
            newEmbed.setTitle("Please enter an argument!");
            return message.channel.send(newEmbed);
        } else if (message.mentions.users.first()) { // -------------------------------------------------- Challange initiate -----------------
            newEmbed
            .setColor("#0000FF")
            .setTitle(`TICTACTOE`)
            .setDescription(`${message.mentions.users.first()} you've been challanged to a game of TICTACTOE by ${message.author}!`)
            .addFields({name: "Do you accept?", value: "-tictactoe [accept|reject]"});
            message.channel.send(newEmbed);

            const current = {
                challanger: message.author.id,
                challanged: message.mentions.users.first().id,
                accepted: false,
                timeOfLastAction: null,
                channel: message.channel.id,
                game: ["-", "-", "-", "-", "-", "-", "-", "-", "-"]
            };

            info.pending.push(current);

            fs.writeFileSync(path.resolve(__dirname, '../data/tictactoeGames.json'), JSON.stringify(info));

        } else if (args[0] == "accept" || args[0] == "reject") { // -------------------------------------------------- Accept / Reject
            const yes = info.pending.filter(function(value) {
                return value.challanged == message.author.id && value.channel == message.channel.id;
            }).length;

            if (yes == 0) {
                newEmbed.setTitle("There are no pending challanges for you!");
                message.channel.send(newEmbed);
            }

            if (args[0] == "accept") { // -------------------------------------------------- Challange Accept -----------------
                newEmbed.setTitle("TICTACTOE Challange")
                .setColor("#00FF00")
                .addFields({name: "-----------", value: `Challange from <@${info.pending.filter(function(value) {
                    return value.challanged == message.author.id && value.channel == message.channel.id;
                })[0].challanger}> has been accepted!`});

                message.channel.send(newEmbed);

                const game = info.pending.filter(function(value) {
                    return value.challanged == message.author.id && value.channel == message.channel.id;
                })[0];

                game.accepted = true;
                game.timeOfLastAction = Date.now();

                info.pending = info.pending.filter(function(value) {
                    return !(value.challanged == message.author.id && value.channel == message.channel.id);
                });

                info.pending.push(game);

                fs.writeFileSync(path.resolve(__dirname, '../data/tictactoeGames.json'), JSON.stringify(info));

            } else if (args[0] == "reject") { // -------------------------------------------------- Challange Reject -----------------
                newEmbed.setTitle("TICTACTOE Challange")
                .addFields({name: "-----------", value: `Challange from <@${info.pending.filter(function(value) {
                    return value.challanged == message.author.id && value.channel == message.channel.id;
                })[0].challanger}> has been rejected!`});

                message.channel.send(newEmbed);

                info.pending = info.pending.filter(function(value) {
                    return value.challanged != message.author.id || value.accepted || value.channel != message.channel.id;
                });

                fs.writeFileSync(path.resolve(__dirname, '../data/tictactoeGames.json'), JSON.stringify(info));
            }
        }
    }
}