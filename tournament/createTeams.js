exports.createTeams = function (message, args, pool) {
    console.log('Creating teams');
    var PythonShell = require('python-shell');

    var options = {
        mode: 'text',
        args: ['/tmp/players.csv']
    };

    fs.exists('/tmp/players.csv', function() {
        console.log('file exists');
    });

    PythonShell.run('dotaTeamMaker.py', options, function (error, results) {
        if (error) {
            console.error(error.toString());
            return;
        }

        console.log(results);

        if (results && results[0] === 'Please submit a (valid) playerlist file.\r') {
            message.channel.send(`Please submit a (valid) playerlist file`);
        }

        message.channel.send(`Dota TeamMaker has run.`);

        var importTeams = require('./importTeams');
        importTeams.importTeams(message, args, pool, results);

        return;
    });

    return;
}