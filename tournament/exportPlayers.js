exports.exportPlayers = function (message, args, pool) {
    let exportType = args[0] ? args[0] : 'message';

    let sql = `SELECT * FROM player WHERE joined IS NOT NULL ORDER BY joined ASC`;
    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();
            if (error) {
                console.error(err.toString());
                message.channel.send(`Getting players failed, an error occurred.`);
                return;
            }

            if (!results || !results.length) {
                message.channel.send(`No players joined yet.`);
                return;
            }

            let leftover_players_amount = results.length % 5;
            results = results.splice(0, results.length - leftover_players_amount);

            if (exportType === 'csv') {
                exportToCsv(message, args, pool, results);
            } else {
                showPlayers(message, results);
            }

        });
    });
};

const showPlayers = function(message, allrows) {
    let description = '';
    allrows.forEach(function (player) {
        player.preferred_positions = player.preferred_positions.replace(/,/g, ';');
        description += `${player.playername};${player.coremmr};${player.supportmmr};${player.preferred_captain ? 'True' : 'False'};${player.preferred_positions}\n`;
    });

    message.channel.send('```' + description + '```');
};

const exportToCsv = function(message, args, pool, allrows) {
    let description = '';
    allrows.forEach(function (player) {
        player.preferred_positions = player.preferred_positions.replace(/,/g, ';');
        description += `${player.playerID};${player.coremmr};${player.supportmmr};${player.preferred_captain ? 'True' : 'False'};${player.preferred_positions}\n`;
    });

    let fs = require('fs');
    let filepath = '/tmp/players.csv';

    fs.writeFile(filepath, description, { flag: 'w' }, function(error) {
        if (error) {
            console.error(error);
            return;
        }

        message.channel.send(`Players have been exported to CSV.`);
        const createTeams = require('./createTeams');
        createTeams.createTeams(message, args, pool);
    });
};