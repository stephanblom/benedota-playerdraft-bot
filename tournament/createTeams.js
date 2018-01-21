const config = require('config');

const Logger = require('le_node');
const logger = new Logger({
    token: process.env.LOGENTRIES_TOKEN
});

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
                logger.err('Error in dotaTeamMaker.py: ' + error.toString());
                console.error(error.toString());
                return;
            }
            logger.info('Results: ' + results);

            if (results && results[0] === 'Please submit a (valid) playerlist file.\r') {
                message.channel.send(`Please submit a (valid) playerlist file`);
            }

            message.channel.send(`Dota TeamMaker has run.`);

            var importTeams = require('./importTeams');
            importTeams.importTeams(message, args, pool);

        });
    });
}