const Discord = require('discord.js');

exports.sendHelp = function (message, args) {
    var helpCommands = {
        '!register (or !update) <mmr> <position (1,2,3,4,5,Any)> <preferred captain (Yes/No)>': `Registers you to the bot, or updates your data, for example:
                \`!register 2700 5 Nee\`,
                \`!register 6543 1 Yes\`,
                \`!register 9001 Any Ja\``,
        '!playerlist': `Shows the people that have \`!join\` ed the next tournament`,
        '!join': `Enters you in the next tournament`,
        '!leave': `Remove your entry for the next tournament`,
        '!status': `Shows the info you are currently registered with.`
    }

    var embed = new Discord.RichEmbed()
        .setColor('#a52b16')
        .attachFile(`./images/dota2.png`)
        .setThumbnail(`attachment://dota2.png`)
        .setTimestamp()
        .setTitle(`Available commands`)
        .setDescription(`These are the currently available commands to use`)
        .setFooter(`BeNeDota Kayzr Player Draft Help`);

    for (var key in helpCommands) {
        embed.addField(key, helpCommands[key]);
    }
    message.channel.send({embed});

    if ((message.member.roles.find("name", "Admin")
        || message.author.id === '157938886784319489')
        && args[0] == 'admin'
    ) {
        var embed = new Discord.RichEmbed()
            .setColor('#a52b16')
            .attachFile(`./images/dota2.png`)
            .setThumbnail(`attachment://dota2.png`)
            .setTimestamp()
            .setTitle(`Extra commands for the Admins`)
            .setDescription(`These are the currently available commands to use`)
            .setFooter(`BeNeDota Kayzr Player Draft Help`);

        embed.addField(
            '!registerPlayer <username (mention)> <mmr> <position> <preferred captain>',
            'Registers/Updates the user to the bot'
        );
        embed.addField(
            '!joinPlayer <username (mention)> <mmr> <position> <preferred captain>',
            'Joins the user to the next tournament'
        );
        embed.addField(
            '!leavePlayer <username (mention)> <mmr> <position> <preferred captain>',
            'Removes the entry of the user for the next tournament'
        );
        embed.addField(
            '!exportplayers (or: !exportjoinedplayers) <\'csv\' (optional)>',
            `- This shows the joined players if started without 'csv' in csv format in chat. `
             + `This starts the process of creating the teams if 'csv' parameter has been given. Caution with this!`
        );
        embed.addField(
            '!showteams <live (optional)>',
            `This shows the teams created during \`!exportplayers csv\` in this chat. `
             + `When used with 'live' parameter, this will show the teams in the Kayzr channel.`
        )
        message.channel.send({embed});
    }

    return;

}