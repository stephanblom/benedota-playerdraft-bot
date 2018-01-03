const sqlite3 = require('sqlite3').verbose();

exports.getPlayerlist = function (message, args) {
    var database = new sqlite3.Database('./db/playerdraft.db', (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    database.serialize(function () {
        var sql = `SELECT * FROM player WHERE playerID IN `;
        database.all(sql, [], function (err, allRows) {
            if (err) {
                console.error(err.toString());
                message.channel.send(`Getting players failed, an error occurred.`);

                return;
            }
            addPlayersToEmbed(message, allRows);

            return allRows;
        })
    });

    return;
}

addPlayersToEmbed = function(message, allrows) {
    var description = '';
    var i = 1;
    allrows.forEach(function (player) {
        description += `- ${player['playername']} \n`;
        i++;
    });

    message.channel.send("Players: \n" + description);
}