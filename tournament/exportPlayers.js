exports.exportPlayers = function (message, args, pool) {
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

            showPlayers(message, results);

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