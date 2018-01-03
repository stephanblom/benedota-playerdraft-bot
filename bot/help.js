exports.sendHelp = function (message, args) {
    if (args[0]) {
        switch (args[0].toLowerCase()) {
            case 'help':
                message.channel.send(`!help <command (optional)> | Displays the help command.`);
                return;
            case 'register':
                message.channel.send(`!register <mmr> <position> <position (optional)> <position (optional)> | Registers you to the bot`);
                return;
            case 'playerlist':
                message.channel.send(`!playerlist | Shows the people joining the next tournament`);
                return;
            case 'join':
                message.channel.send(`!join <tournamentID> | Joins the next tournament`);
                return;
        }
    }

    message.channel.send(
        `Available commands:
        - !help <command (optional)> | Displays this command.
        - !register <mmr> <position> <position (optional)> <position (optional)> | Registers you to the bot
        - !playerlist | Shows the people joining the next tournament
        - !join <tournamentID>| Joins the next tournament`
    );

    return;

}