exports.createTeams = function (message, args, pool) {
    console.log('Creating teams');
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

        console.log('Dota teammaker has run');
        message.channel.send(`Dota TeamMaker has run.`);

        var importTeams = require('./importTeams');
        importTeams.importTeams(message, args, pool);

        return;
    });

    return;
}