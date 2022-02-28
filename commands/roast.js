module.exports = {
    name: 'roast',
    description: 'this command is used to roast somebody!',
    execute(client, message, args) {

        var arg = "";

        for(var i = 0; i<args.length; i++) {
            arg += args[i] + " ";
        }

        arg = arg.substring(0, arg.length -1);

        var a = [];
        a.push('you are dumb!',"I see you still didn't find your brain!",
         "I would roast you, but mom says I'm not allowed to burn trash!",
         "you're as useless as 'ueue' in 'queue'.",
         "is your ass jealous of the amount of shit that just came out of your mouth?",
         "I love what you've done to your hair. How did you get it to come out of the nostrils like that?",
         "yo mama is so old I told her to act like her own age and she died!",
         "you are so fat you fall off both sides of the bed!",
         "I would slap you but shit splatters.",
         "light travels faster than sound, which is why you seemed bright until you spoke.");

        var rand = Math.floor(Math.random() * a.length);
        var roast = a[rand];

        var argsSize = 0;

        for(var i = 0; i<args.length; i++) {
            argsSize += args[i].length;
        }

        if(argsSize > 1800 ||args.length > 900) return message.channel.send('Invalid Name => too long!');

        if (message.mentions.everyone) return message.reply('you may not roast everyone');

        if (args.length != 0) {
            if (message.mentions.users.first()) if (message.mentions.users.first().id == message.guild.me.id) return message.channel.send("<@"+message.author.id + '>, ' + roast);
            return message.channel.send(arg + ', ' + roast);
        } else {
            message.channel.send(roast);
        }
    }
}