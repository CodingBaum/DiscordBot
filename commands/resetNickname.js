module.exports = {
    name: 'resetNickname',
    description: 'rename the bot!',
    async execute(client, message, guild) {
        await message.guild.me.setNickname('a');
    }
}