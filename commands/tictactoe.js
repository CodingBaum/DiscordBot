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

            if (info.pending.filter(value => {
                return value.challenger == message.mentions.users.first().id || value.challenged == message.mentions.users.first().id;
            }).length != 0) {
                newEmbed.setTitle("Unable to challange this user!")
                .setDescription("This user already has a pending game!");
                return message.channel.send(newEmbed);
            } else if (info.pending.filter(value => {
                return value.challenger == message.author.id || value.challenged == message.author.id;
            }).length != 0) {
                newEmbed.setTitle("Unable to challange this user!")
                .setDescription("Please finish/cancel your current game in order to start a new one");
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
                idOfLastActionUser: message.author.id,
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

                message.channel.send(printGame(game));

            } else if (args[0] == "reject") { // -------------------------------------------------- Challange Reject -----------------
                newEmbed.setTitle("TICTACTOE Challenge")
                .addFields({name: "-----------", value: `Challenge from <@${info.pending.filter(function(value) {
                    return value.challenged == message.author.id && value.channel == message.channel.id && !value.accepted;
                })[0].challanger}> has been rejected!`});

                message.channel.send(newEmbed);

                info.pending = info.pending.filter(function(value) {
                    return value.challenged != message.author.id || !value.accepted || value.channel != message.channel.id;
                });

                fs.writeFileSync(path.resolve(__dirname, '../data/tictactoeGames.json'), JSON.stringify(info));
            }
        } else if(args[0] == "status") {
            const current = info.pending.filter(function(value) {
                return value.challenger == message.author.id || value.challenged == message.author.id;
            })[0];

            if (current === undefined) {
                newEmbed.setTitle("You currently don't have any pending games!")
                .setDescription("Please note that challenges will expire if no action is being made within 24 hours");
                return message.channel.send(newEmbed);
            }

            message.channel.send(printGame(current));
        } else if(args[0] == "cancel") {

        } else {
            var current = info.pending.filter(function(value) {
                return value.challenger == message.author.id || value.challenged == message.author.id;
            });

            if (current.length == 0) {
                newEmbed.setTitle("You currently don't have any pending games!")
                .setDescription("Please note that challenges will expire if no action is being made within 24 hours");
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

            if (result == "error") return;

            info.pending = info.pending.filter(function(value) {
                return !(value.challenger == message.author.id || value.challenged == message.author.id);
            });

            if (!isNaN(result)) {
                const game = {
                    player1: current.challenger,
                    player2: current.challenged,
                    winner: result
                }

                info.finished.push(game);
            } else {
                result.idOfLastActionUser = message.author.id;
                result.timeOfLastAction = Date.now();
                info.pending.push(result);
            }

            fs.writeFileSync(path.resolve(__dirname, '../data/tictactoeGames.json'), JSON.stringify(info));
        }
    }
}

function play(client, message, args, userId, current) {
    const newEmbed = new Discord.MessageEmbed();
    newEmbed.setColor("#FF0000");

    if (args[0].split("")[0] > 3 || args[0].split("")[0] < 1 || args[0].split("")[1] > 3 || args[0].split("")[1] < 1 || args[0].length != 2) {
        newEmbed.setTitle("Pleaser enter valid row and column numbers(1-3)");
        message.reply(newEmbed);
        return "error";
    }


    if (current.game[(args[0].split("")[0]-1) + (args[0].split("")[1]-1)*3] != "-") {
        newEmbed.setTitle("This field is occupied pls choose another one");
        message.reply(newEmbed);
        return "error";
    }

    const character = userId == current.challenged ? "X" : "O";

    current.game[(args[0].split("")[0]-1) + (args[0].split("")[1]-1)*3] = character;
    var over = "null";

    for (var i = 0; i<3; i+=3) {
        if (current.game[i] == "X" && current.game[i+1] == "X" && current.game[i+2] == "X") over = current.challenged;
        if (current.game[i] == "O" && current.game[i+1] == "O" && current.game[i+2] == "O") over = current.challenger;
        if (current.game[i] == "X" && current.game[i+3] == "X" && current.game[i+6] == "X") over = current.challenged;
        if (current.game[i] == "O" && current.game[i+3] == "O" && current.game[i+6] == "O") over = current.challenger;
    }

    if (current.game[0] == "X" && current.game[4] == "X" && current.game[8] == "X") over = current.challenged;
    if (current.game[0] == "O" && current.game[4] == "O" && current.game[8] == "O") over = current.challenger;
    if (current.game[2] == "X" && current.game[4] == "X" && current.game[6] == "X") over = current.challenged;
    if (current.game[2] == "O" && current.game[4] == "O" && current.game[6] == "O") over = current.challenger;

    if (!isNaN(over)) {
        message.channel.send(printGame(current, over));
        return over;
    } else {
        message.channel.send(printGame(current));
        return current;
    }
}

function printGame(current, winner) {
    const graphics = current.game.map(x => {
        switch (x) {
            case "-":
                return ":black_medium_square:"
            case "X":
                return ":x:"
            case "O":
                return ":o:"
        }
    });
    const gameEmbed = new Discord.MessageEmbed();
    gameEmbed.setTitle("TICTACTOE")
    .setColor("#E6C319")
    .addFields({name: "Current game: ", value: `${graphics[0]} | ${graphics[1]} | ${graphics[2]}\n---------------\n${graphics[3]} | ${graphics[4]} | ${graphics[5]}\n---------------\n${graphics[6]} | ${graphics[7]} | ${graphics[8]}`});
    if (!isNaN(winner)) {
        gameEmbed.setDescription(`Winner: <@${winner}>        Loser: <@${winner == current.challenger ? current.challenged : current.challenger}>`)
        .setTitle("TICTACTOE | Game Over")
        .setColor("#FC500F");
    } else {
        gameEmbed.setDescription(`Player 1: <@${current.challenged}>        Player 2: <@${current.challenger}>`);
    }
    
    

    return gameEmbed;
}