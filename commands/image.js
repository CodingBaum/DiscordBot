const Discord = require('discord.js');
const Scraper = require('images-scraper');

const google = new Scraper({
    puppeteer: {
        headless: true
    }
})

module.exports = {
    name: 'image',
    description: 'a command to search images on google!',
    async execute(client, message, args) {
        const newEmbed = new Discord.MessageEmbed();
        newEmbed.setColor('#FF0000');
        if(message.mentions.users.first()) {
            const user = message.mentions.users.first();
            return message.channel.send(user.displayAvatarURL());
        }
        if(args.length == 0) {
            newEmbed.setTitle('Please enter an image name!');
            return message.channel.send(newEmbed);
        }

        const image_query = args.join(' ');

        /* ------------- Query Validation ---------------
        const validation = "([A-Za-z0-9-.\)\(!_<>*+/,~#'@^°\"§$&/=? ]+)";
        if (!image_query.match(validation)) {
            newEmbed.setTitle("Invalid expression in search query!");
            return message.channel.send(newEmbed);
        }*/

        const image_results = await google.scrape(image_query, 1);
        if (image_results.length == 0) {
            newEmbed.setTitle("No images found!");
            return message.channel.send(newEmbed);
        }
        try {
            newEmbed.setImage(image_results[0].url)
            .setColor('999900')
            .setTitle(image_query)
            .setURL(image_results[0].url);
            message.channel.send(newEmbed);
        } catch {
            newEmbed.setTitle("Slow down!");
            message.channel.send(newEmbed);
        }
        
    }
}