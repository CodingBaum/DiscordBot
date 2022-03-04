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

        if (args.join(' ').length > 200) {
            newEmbed
            .setColor('#FF0000')
            .setURL(null)
            .setTitle('Please choose a shorter query');
            return message.channel.send(newEmbed);
        }

        if(message.mentions.users.first()) {
            const user = message.mentions.users.first();
            return message.channel.send(user.displayAvatarURL());
        }
        if(args.length == 0) {
            newEmbed.setTitle('Please enter an image name!');
            return message.channel.send(newEmbed);
        }

        const image_query = args.join(' ');

        const check = ["nsfw", "rule34", "r34", "porn", "nude"];

        var nsfw = false;
         
        check.forEach(x => {
            if (image_query.includes(x) && !message.channel.nsfw) {
                nsfw = true;
            }
        })

        if (nsfw) {
            newEmbed.setTitle("I cannot send nsfw content in this channel as it is not a NSFW channel!");
            return message.channel.send(newEmbed);
        }

        /* ------------- Query Validation ---------------
        const validation = "([A-Za-z0-9-.\)\(!_<>*+/,~#'@^°\"§$&/=? ]+)";
        if (!image_query.match(validation)) {
            newEmbed.setTitle("Invalid expression in search query!");
            return message.channel.send(newEmbed);
        }*/

        newEmbed.setTitle("Searching for Images...");
        const temp = await message.channel.send(newEmbed);

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
            temp.delete();
        } catch {
            newEmbed.setTitle("Slow down!");
            message.channel.send(newEmbed);
        }
        
    }
}