exports.createTeams = function (message, args, pool) {
    var fs = require('fs');
    var csv = require('fast-csv');

    fs.exists('/tmp/players.csv', function() {
        fs.createReadStream('/tmp/players.csv')
            .pipe(csv())
            .on('data', function(data) {
                console.log(data);
            }).on('end', function (data) {

            });

        var options = {
            ignoreEmpty: true
        }

        console.log('/tmp/players.csv exists.');

        var PythonShell = require('python-shell');

        var options = {
            mode: 'text',
            args: ['/tmp/players.csv']
        };
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

        });
    });
}