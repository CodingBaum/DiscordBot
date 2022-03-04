const { inlineCode } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'tictactoe',
    description: 'a command to challenge a friend to tictactoe!',
    execute(client, message, args) {
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#FF0000');

        let data = fs.readFileSync(path.resolve(__dirname, '../data/tictactoeGames.json'));
        let info = JSON.parse(data);

        if (args.length == 0) {
            newEmbed.setTitle("Please enter an argument!");
            return message.channel.send(newEmbed);
        } else if (message.mentions.users.first()) { // -------------------------------------------------- Challange initiate -----------------
            if (message.mentions.users.first() == message.author.id) {
                newEmbed.setTitle("You may not challenge yourself");
                return message.channel.send(newEmbed);
            }
            newEmbed
            .setColor("#0000FF")
            .setTitle(`TICTACTOE`)
            .setDescription(`${message.mentions.users.first()} you've been challenged to a game of TICTACTOE by ${message.author}!`)
            .addFields({name: "Do you accept?", value: "-tictactoe [accept|reject]"});
            message.channel.send(newEmbed);

            const current = {
                challenger: message.author.id,
                challenged: message.mentions.users.first().id,
                accepted: false,
                timeOfLastAction: Date.now(),
                idOfLastActionUser: message.mentions.users.first().id,
                channel: message.channel.id,
                game: ["-", "-", "-", "-", "-", "-", "-", "-", "-"]
            };

            info.pending.push(current);

            fs.writeFileSync(path.resolve(__dirname, '../data/tictactoeGames.json'), JSON.stringify(info));

        } else if (args[0] == "accept" || args[0] == "reject") { // -------------------------------------------------- Accept / Reject
            const yes = info.pending.filter(function(value) {
                return value.challenged == message.author.id && value.channel == message.channel.id && !value.accepted;
            }).length;

            if (yes == 0) {
                newEmbed.setTitle("There are no pending challenges for you!");
                return message.channel.send(newEmbed);
            }

            if (args[0] == "accept") { // -------------------------------------------------- challenge Accept -----------------
                newEmbed.setTitle("TICTACTOE Challenge")
                .setColor("#00FF00")
                .addFields({name: "-----------", value: `Challenge from <@${info.pending.filter(function(value) {
                    return value.challenged == message.author.id && value.channel == message.channel.id;
                })[0].challenger}> has been accepted!`});

                message.channel.send(newEmbed);

                const game = info.pending.filter(function(value) {
                    return value.challenged == message.author.id && value.channel == message.channel.id && !value.accepted;
                })[0];

                game.accepted = true;
                game.timeOfLastAction = Date.now();

                info.pending = info.pending.filter(function(value) {
                    return !(value.challenged == message.author.id && value.channel == message.channel.id);
                });

                info.pending.push(game);

                fs.writeFileSync(path.resolve(__dirname, '../data/tictactoeGames.json'), JSON.stringify(info));

            } else if (args[0] == "reject") { // -------------------------------------------------- Challange Reject -----------------
                newEmbed.setTitle("TICTACTOE Challenge")
                .addFields({name: "-----------", value: `Challenge from <@${info.pending.filter(function(value) {
                    return value.challenged == message.author.id && value.channel == message.channel.id;
                })[0].challanger}> has been rejected!`});

                message.channel.send(newEmbed);

                info.pending = info.pending.filter(function(value) {
                    return value.challenged != message.author.id || !value.accepted || value.channel != message.channel.id;
                });

                fs.writeFileSync(path.resolve(__dirname, '../data/tictactoeGames.json'), JSON.stringify(info));
            }
        } else {
            var current = info.pending.filter(function(value) {
                return value.challenger == message.author.id || value.challenged == message.author.id;
            });

            if (current.length == 0) {
                newEmbed.setTitle("You currently don't have any pending games!");
                return message.channel.send(newEmbed);
            }

            current = current[0];

            const userId = current.challenged == current.idOfLastActionUser ? current.challenger : current.challenged;

            if (current.idOfLastActionUser == message.author.id) {
                newEmbed.setTitle("It's not your turn!")
                .setDescription(`Waiting for <@${userId}>`);
                return message.channel.send(newEmbed);
            }

            const result = play(client, message, args, userId, current);
        }
    }
}

function play(client, message, args, userId, current) {
    const newEmbed = new Discord.MessageEmbed();
    newEmbed.setColor("#FF0000");

    if (args[0].split("")[0] > 3 || args[0].split("")[0] < 1 || args[0].split("")[1] > 3 || args[0].split("")[1] < 1 || args[0].length != 2) {
        newEmbed.setTitle("Pleaser enter valid row and column numbers(1-3)");
        return message.reply(newEmbed);
    }

    if (current.game[(args[0].split("")[0]-1) + (args[0].split("")[1]-1)*3] != "-") {
        newEmbed.setTitle("This field is occupied pls choose another one");
        return message.reply(newEmbed);
    }
}