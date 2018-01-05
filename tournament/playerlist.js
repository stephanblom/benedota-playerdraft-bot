exports.getPlayerlist = function (message, args, pool) {
    var sql = `SELECT * FROM player WHERE joined = 1`;
    pool.getConnection(function(error, connection) {
        connection.query(sql, function (error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                message.channel.send(`Getting players failed, an error occurred.`);
                database.close();
                return;
            }

            if (!results || !results.length) {
                message.channel.send(`No players joined yet.`);
                database.close();
                return;
            }

            addPlayersToList(message, results);
            return;
        });
    });

    return;
}

addPlayersToList = function(message, allrows) {
    var description = '';
    var i = 1;
    allrows.forEach(function (player) {
        description += `- ${player['playername']} \n`;
        i++;
    });

    message.channel.send("Players: \n" + description);
}