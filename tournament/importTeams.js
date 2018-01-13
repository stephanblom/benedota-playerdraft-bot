exports.importTeams = function (message, args, pool, results) {
    console.log('Importing teams');
    sql = `TRUNCATE TABLE team_player;`
    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                message.channel.send(`Getting players failed, an error occurred.`);
                return;
            }
        });

        console.log('Importing done');
        readCsv(message, args, pool, results);
    });

    return;
}

readCsv = function (message, args, pool, results)
{
    var fs = require('fs');
    var csv = require('fast-csv');
    var options = {
        ignoreEmpty: true
    }
    var i = 1;

    results.forEach(function(row) {
        data = row.replace(/\'/g, "")
            .replace('[', '')
            .replace(']', '')
            .replace('\r', '');

        if (data.startsWith('1:')) {
            team_info = data.split(', ');

            var team_ID = i;
            var captain_info = team_info.pop().split(':');
            var avg_mmr_info = team_info.pop().split(':');
            var team_players = team_info.join(';');

            if (avg_mmr_info.length > 0
                && captain_info.length > 0) {
                args[0] = team_ID;
                args[1] = team_players;
                args[2] = avg_mmr_info[1];
                args[3] = captain_info[1];

                var addTeam = require('./addTeam');
                addTeam.addTeam(message, args, pool);
            }
            i++;
        }
    });

    return;
}