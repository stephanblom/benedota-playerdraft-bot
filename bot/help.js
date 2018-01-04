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
        - !register (or !update) <mmr> <position> <preferred captain (Yes/No) /> | Registers/Updates you to the bot
        - !playerlist | Shows the people joining the next tournament
        - !join | Joins the next tournament
        - !leave | Leaves the next tournament`
    );

    return;

}