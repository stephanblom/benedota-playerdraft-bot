exports.sendHelp = function (message, args) {
    if (args[0]) {
        switch (args[0].toLowerCase()) {
            case 'help':
                message.channel.send(`!help <command (optional)> | Displays the help command.`);
                return;
            case 'register':
            case 'update':
                message.channel.send(`!register <mmr> <position> <preferred captain (Ja/Nee)> | Registers you to the bot`);
                return;
            case 'playerlist':
                message.channel.send(`!playerlist | Shows the people joining the next tournament`);
                return;
            case 'join':
                message.channel.send(`!join (!jointournament) | Joins the next tournament`);
                return;
            case 'leave':
                message.channel.send(`!leave (!leavetournament) | Leaves the next tournament`);
                return;
        }
    }

    message.channel.send(
        `Available commands:
        - !help <command (optional)> | Displays this command.
        - !register (or !update) <mmr> <position (1,2,3,4,5,Any)> <preferred captain (Yes/No) /> | Registers/Updates you to the bot
        - !playerlist | Shows the people joining the next tournament
        - !join | Joins the next tournament
        - !leave | Leaves the next tournament`
    );

    if (message.member.roles.find("name", "Admin")
        || message.author.id === '157938886784319489'
    ) {
        message.channel.send(
            `Available Admin commands:
            - !registerPlayer <username (exact)> <mmr> <position> <preferred captain> | Registers/Updates the username to the bot
            - !joinPlayer <username (exact)> <mmr> <position> <preferred captain> | Joins the username to the next tournament
            - !leavePlayer <username (exact)> <mmr> <position> <preferred captain> | Leaves the username from the next tournament
            - !exportplayers (or: !exportjoinedplayers) <'csv' (optional)>
                - This shows the joined players if started without 'csv' in csv format in chat.
                - This starts the process of creating the teams if 'csv' parameter has been given. Caution with this!
            - !showteams <'live' (optional)>
                - This shows the teams created during \`!exportplayers csv\` in this chat. 
                - When used with 'live' parameter, this will show the teams in the Kayzr channel.`
        );
    }

    return;

}