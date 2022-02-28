const Nuggies = require("nuggies");

module.exports = {
    name: 'dropdown',
    description: 'dropdown option for role selection',
    async execute(client, message, args, Discord) {
        const options = new Nuggies.dropdownroles()
        .addrole({
            label: '2AI',
            emoji: '🟩',
            role: '897400870264795177'
        }).addrole({
            label: '2BI',
            emoji: '🟨',
            role: '897400924639731723'
        }).addrole({
            label: '2CI',
            emoji: '🟦',
            role: '897400949197402122'
        });

        Nuggies.dropdownroles.create(client, {
            message: message,
            role: options,
            content: new Discord.MessageEmbed().setTitle('Wähle deine Klasse aus!').setDescription(`Wenn du keiner dieser Klassen angehörst, wende dich an die Moderatoren im \n${message.member.guild.channels.cache.find(channel => channel.name === "mod-support")} channel`).setColor("BLUE"),
            channelID: message.channel.id,
            type: "single"
        });
    }
}