const fs = require('fs');

module.exports = (client, Discord) => {

    const ready = require(`../events/client/ready.js`);
    client.once("ready", ready.bind(null, Discord, client));

    const guildMemberAdd = require(`../events/guild/guildMemberAdd.js`);
    client.on("guildMemberAdd", guildMemberAdd.bind(null, Discord, client));

    const message = require(`../events/guild/message.js`);
    client.on("message", message.bind(null, Discord, client));

    const interaction = require(`../events/guild/interaction.js`);
    client.on("interactionCreate", interaction.bind(null, Discord, client));

    /*client.on("messageReactionAdd", (message, member) => {
        require("../events/guild/messageReactionAdd.js").bind(null, Discord, client, message, member);
    });*/

    /*for(const file of event_files) {
        const event = require(`../events/${dirs}/${file}`);
        const event_name = file.split('.')[0];
        client.on(event_name, event.bind(null, Discord, client));
    }*/
}