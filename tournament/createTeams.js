exports.createTeams = function (message, args, pool) {
    var PythonShell = require('python-shell');

    var options = {
        mode: 'text',
        args: ['./export/players.csv']
    };

    PythonShell.run('dotaTeamMaker.py', options, function (error, results) {
        if (error) {
            console.error(error.toString());
            return;
        }

        if (results && results[0] === 'Please submit a (valid) playerlist file.\r') {
            message.channel.send(`Please submit a (valid) playerlist file`);
        }

        message.channel.send(`Dota TeamMaker has run.`);

        return;
    });

    return;
}