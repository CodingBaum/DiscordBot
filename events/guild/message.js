require('dotenv').config();

module.exports = (Discord, client, message) => {
    const prefix = process.env.PREFIX;

    if (message.author.bot) return;

    if (message.guild === null) return message.reply("Commands do not work in DMs");

    if(!message.content.startsWith(prefix)) return;

    //if(message.author.id == "406773359624323072" || message.author.id == "631417571425386496" | message.author.id == "761273334347989032") return message.channel.send("georg ist ein nuttensohn");

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd);
    const guild = message.guild;

    if(command) command.execute(client, message, args, Discord, guild);
}