const Discord = require('discord.js');

exports.sendHelp = function (message, args) {
    var helpCommands = {
        '!register (or !update) <mmr> <preferred captain (Yes/No)> <position (1,2,3,4,5,Any)> <position (optional)> ...'
            : `Registers you to the bot, or updates your data, for example:
                \`!register 2700 Nee 5 4\`,
                \`!register 6543 Yes 1 2\`,
                \`!register 9001 Ja Any\``,
        '!playerlist': `Shows the people that have \`!join\` ed the next tournament`,
        '!join': `Enters you in the next tournament`,
        '!leave': `Remove your entry for the next tournament`,
        '!status': `Shows the info you are currently registered with.`,
        '!kayzrname (name/clear)': `If your Kayzr profile name is different than the username on Discord, use this to set your Kayzr name. This way, we can add you to the Kayzr team`
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