module.exports = (Discord, client, interaction) => {
    if (interaction.isCommand()) {
        if (interaction.commandName === 'ping') {
            interaction.reply('Pong!');
        }
    }
}