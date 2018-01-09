exports.exportPlayers = function (message, args, pool) {

    exportType = args[0] ? args[0] : 'message';

    var sql = `SELECT * FROM player WHERE joined = 1`;
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

            if (exportType == 'csv') {
                exportToCsv(message, results);
            } else {
                showPlayers(message, results);
            }

            return;
        });
    });

    return;
}

showPlayers = function(message, allrows) {
    var description = '';
    var i = 1;
    allrows.forEach(function (player) {
        description += `${player['playername']};${player['mmr']};${player['preferred_position']};${player['preferred_captain'] ? 'True' : 'False'};True\n`;
        i++;
    });

    message.channel.send("```Player_Name;Solo_MMR;Preffered_Role;Preffered_Captain;Active\n" + description + '```');
}

exportToCsv = function(message, allrows) {
    var description = 'Player_Name;Solo_MMR;Preffered_Role;Preffered_Captain;Active\n';
    var i = 1;
    allrows.forEach(function (player) {
        description += `${player['playername']};${player['mmr']};${player['preferred_position']};${player['preferred_captain'] ? 'True' : 'False'};True\n`;
        i++;
    });

    var fs = require('fs');
    var filepath = './export/players.csv';

    fs.writeFileSync(filepath, description, { flag: 'w' }, function(error) {
        if (error) {
            return console.log(error);
        }
    });

    return;
}