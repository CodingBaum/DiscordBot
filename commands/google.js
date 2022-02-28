const Discord = require('discord.js');
const serp = require('serp');

var options = {
    host : "google.com",
    qs : {
      q : "test",
      filter : 0,
      pws : 0
    },
    num : 5
};

module.exports = {
    name: 'google',
    description: 'this is a google command!',
    async execute(client, message, args) {
        const embed = new Discord.MessageEmbed()
        .setURL(`https://www.google.com/search?q=${args.join('+')}`);
        if(args.length == 0) {
            embed.setColor('#36BADF').setTitle('https://www.google.com');
            message.channel.send(embed);
        } else if (args.join(' ').length > 200) {
            embed
            .setColor('#FF0000')
            .setURL(null)
            .setTitle('Please choose a shorter query');
            message.channel.send(embed);
        } else {
            options.qs.q = args;
            embed.setColor('#36BADF')
            .setTitle("Results of > " + args.join(" ") + " <");
            const links = await serp.search(options);
            if (links.length == 0) {
                embed
                .setColor('#FF0000')
                .setTitle('No results found for this query');
            }
            let c=1;
            for (let link of links) {
                embed.addField(`Ergebnis ${c++}`, ""+link.url);
            }
            message.channel.send(embed);
        }
        //const test = require('./image')(client, message, args);
    }
}