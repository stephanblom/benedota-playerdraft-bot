exports.exportTeams = function (message, args, connection) {
    var sql = `SELECT * FROM player WHERE joined = 1`;
    connection.query(sql, (error, results) => {
        if (error) {
            console.error(err.toString());
            message.channel.send(`Getting players failed, an error occurred.`);
            return;
        }

        if (!results || !results.length) {
            message.channel.send(`No players joined yet.`);
            return;
        }

        exportTeams(message, results);

    });

    return;
}

exportTeams = function(message, allrows) {
    var description = '';
    var i = 1;
    allrows.forEach(function (player) {
        description += `${player['playername']};${player['mmr']};${player['preferred_position']};${player['preferred_captain'] ? 'True' : 'False'};True\n`;
        i++;
    });

    message.channel.send("```Player_Name;Solo_MMR;Preffered_Role;Preffered_Captain;Active\n" + description + '```');
}