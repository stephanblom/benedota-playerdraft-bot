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

    if (message.member.roles.find("name", "Admin")
        || message.member.roles.find("name", "Staff")
    ) {
        embed.addField(
            '!registerPlayer <username (mention)> <mmr> <position> <preferred captain>',
            'Registers/Updates the user to the bot'
        );
        embed.addField(
            '!joinPlayer <username (mention)>',
            'Joins the user to the next tournament'
        );
        embed.addField(
            '!leavePlayer <username (mention)>',
            'Removes the entry of the user for the next tournament'
        );
        embed.addField(
            '!createtournament (or !createteams)',
             `This starts the process of creating the teams.`
        );
        embed.addField(
            '!showteams <live (optional)>',
            `This shows the teams created during !createtournament. `
             + `When used with 'live' parameter, this will show the teams in the Kayzr channel.`
        );
        embed.addField(
            '!endtournament <live (optional> <showWinningTeam (optional> <winningTeamNumber (required when using showWinningTeam)>',
            `This ends the current tournament, resets the "Joined Kayzr" roles and unjoins everyone from the playerlist. `
            + `This also unsets Kayzr Alpha Winner roles. `
            + `**live** Sends the message to the #kayzr channel. `
            + `**showWinningTeam #** Gives the winners role to the winning team. `
        );
        embed.addField(
            '!showwinningteam <teamnumber> <live (optional)> <updateRoles (optional)',
            `This shows the winning team, and updates the winners role accordingly if *updateroles* is given. `
        );
    }
    
    message.author.send({embed});


    return;

}
