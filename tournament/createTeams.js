exports.createTeams = function (message, args, pool) {
    var fs = require('fs');
    fs.exists('/tmp/players.csv', function() {
        console.log('/tmp/players.csv exists.');

        var PythonShell = require('python-shell');

        var options = {
            mode: 'text',
            args: [
                "/tmp/players.csv",
                "/tmp/outfile.csv"
            ]
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

            var importTeams = require('./importTeams');
            importTeams.importTeams(message, args, pool);

        });
    });
}