const sqlite3 = require('sqlite3').verbose();

exports.exportPlayers = function (message, args) {
    var database = new sqlite3.Database('./db/playerdraft.db', (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    var sql = `SELECT * FROM player WHERE joined = 1`;
    database.all(sql, [], function (err, allRows) {
        if (err) {
            console.error(err.toString());
            message.channel.send(`Getting players failed, an error occurred.`);
            database.close();
            return;
        }

        if (!allRows || !allRows.length) {
            message.channel.send(`No players joined yet.`);
            database.close();
            return;
        }

        exportPlayers(message, allRows);

        database.close();
        return allRows;
    });

    return;
}

exportPlayers = function(message, allrows) {
    var description = '';
    var i = 1;
    allrows.forEach(function (player) {
        description += `${player['playername']};${player['mmr']};${player['preferred_position']};${player['preferred_captain']};true\n`;
        i++;
    });

    message.channel.send("```Player_Name;Solo_MMR;Preffered_Role;Preffered_Captain;Active\n" + description + '```');
}