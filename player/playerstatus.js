exports.playerstatus = function (message, args, pool) {
    var sql = `SELECT * FROM player WHERE playerID = ?`;

    pool.getConnection(function(error, connection) {
        connection.query({
            sql: sql,
            values: [
                message.author.id
            ]
        }, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                throw error;
            }

            if (results.length == 0) {
                message.channel.send(`I couldn't find you, are you not *!registered*?`);
                return;
            } else {
                results.forEach(function (player) {
                    message.channel.send(`
                        This is the info, ${message.author}: 
                        - Username: ${player.playername} ${player.kayzrname ? '(on Kayzr: ' + player.kayzrname + ')': ''},
                        - MMR: ${player.mmr},
                        - Preferred positions: ${player.preferred_positions},
                        - Preferred captain: ${player.preferred_captain ? 'Yes' : 'No'},
                        - In next tournament: ${player.joined ? 'Yes' : 'No (maybe you\'d like to `!join` ?)'}
                    `);
                    return;
                });

                return;
            }
        });
    });

    return;
}