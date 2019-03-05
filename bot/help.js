const Discord = require('discord.js');

exports.sendHelp = function (message, args) {
    message.author.send(
        'Hi, here are the commands for the Kayzr Player Bot, for BeNeDota: \n'
        + '\n'
        + '**!register (or !update)** <mmr> <preferred captain (Yes/No)> <position (1,2,3,4,5,Any)> *<position (optional, multiple allowed)>* \n'
        + 'This command registers you to the bot, or updates your data, for example: \n'
        + '`!register 2700 Nee 5 4` \n'
        + '**!playerlist:** \n'
        + 'This command shows the people that have `!join`ed the next tournament. \n'
        + '**!join** \n'
        + 'This will enter you in the next tournament. \n'
        + '**!leave** \n'
        + 'Remove your entry for the next tournament. \n'
        + '**!status** \n'
        + 'Shows the info you are currently registered with. \n'
        + '**!kayzrname** <your name> \n'
        + 'If your Kayzr profile name is different than the username on Discord, use this to set your Kayzr name. This way, we can add you to your Kayzr team. \n'
    ); 
        
    if (message.member.roles.find("name", "Admin")
        || message.member.roles.find("name", "Staff")
    ) {
        message.author.send(
            '***Admin commands*** \n'
            + '**!registerPlayer** <username (mention)> <mmr> <preferred captain (Yes/No)> <position (1,2,3,4,5,Any)> *<position (optional, multiple allowed)> \n'
            + 'Registers/Updates the user to the bot. \n'
            + '**!joinPlayer** <username (mention)> \n'
            + 'Joins the user to the next tournament. \n'
            + '**!leavePlayer** <username (mention)> \n'
            + 'Removes the entry of the mentioned user for the next tournament. \n'
            + '**!createtournament** (or !createteams) \n'
            + 'This starts the process of creating the teams. \n'
            + '**!showteams** *<live (optional)>* \n'
            + 'This shows the teams created during !createtournament. \n'
            + '*live:* When used with *live* parameter, this will show the teams in the Kayzr channel. \n'
            + '**!endtournament** *<live (optional)> <showWinningTeam (optional)> <winningTeamNumber (required when using showWinningTeam)> <updateRoles (optional, but only with showWinningTeam)>* \n'
            + 'This ends the current tournament, resets the "Joined Kayzr" roles and unjoins everyone from the playerlist. This also unsets Kayzr Alpha Winner roles. \n'
            + '*live* Sends the message to the #kayzr channel. \n'
            + '*showWinningTeam #* Shows the winning team. \n'
            + '*updateRoles* Updates the Kayzr Alpha Winner role to the winning team.  \n'
            + '**!showwinningteam** <teamnumber> *<live (optional)> <updateRoles (optional)>* \n'
            + 'This shows the winning team, and updates the winners role accordingly if *updateroles* is given. \n'
        );
    }
    
    return;

}
