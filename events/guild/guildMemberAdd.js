require('dotenv').config();
const fs = require('fs');
const path = require('path');

module.exports = (Discord, client, member) => {
    const welcomeEmbed = new Discord.MessageEmbed();
    welcomeEmbed
    .setTitle(`WELCOME! `)
    .setDescription("---")
    .setColor("#14d948");

    let data = fs.readFileSync(path.resolve(__dirname, '../../guildMemberAddSettings.json'));
    let settings = JSON.parse(data);

    settings.welcome.forEach(element => {
        if (element.guild == member.guild.id) {
            welcomeEmbed.setThumbnail(member.user.displayAvatarURL());
            if (element.welcomeMessage == "") {
                welcomeEmbed.addFields({name: "Welcome to this Server!", value: `<@${member.user.id}>`});
            } else {
                welcomeEmbed.addFields({name: element.welcomeMessage, value: `<@${member.user.id}>`});
            }
            return member.guild.channels.cache.find(channel => channel.id === element.channelID).send(welcomeEmbed);
        }
    });
}
