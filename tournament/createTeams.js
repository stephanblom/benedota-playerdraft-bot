const Logger = require('le_node');
const logger = new Logger({
    token: process.env.LOGENTRIES_TOKEN
});

exports.createTeams = function (message, args, pool) {
    let fs = require('fs');
    fs.exists('players.csv', function() {
        console.log('players.csv exists.');

        let options = {
            mode: 'text',
            args: [
                '/tmp/players.csv',
                '/tmp/outfile.csv'
            ]
        };

        const {PythonShell} = require('python-shell')
        PythonShell.run('dotaTeamMaker.py', options, function (error, results) {
            if (error) {
                logger.err('Error in dotaTeamMaker.py: ' + error);
                console.error(error);
                return;
            }
            logger.info('Results: ' + results);

            if (results && results[0] === 'Please submit a (valid) playerlist file.\r') {
                message.channel.send(`Please submit a (valid) playerlist file`);
            }

            message.channel.send(`Dota TeamMaker has run.`);

            const importTeams = require('./importTeams');
            importTeams.importTeams(message, args, pool);

        });
    });
};