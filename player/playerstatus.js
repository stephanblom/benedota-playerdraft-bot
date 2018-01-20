exports.playerstatus = function (message, args, pool) {
    var sql = `SELECT * FROM player WHERE playerID = '${message.author.id}'`;

    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                throw error;
            }

            if (results.affectedRows === 0) {
                message.channel.send(`I couldn't find you, are you not *!registered*?`);
                return;
            } else {
                results.forEach(function (player) {
                    message.channel.send(`
                        This is the info, ${message.author}: 
                        - Username: ${player.playername}
                        - MMR: ${player.mmr}
                        - Preferred position: ${player.preferred_position},
                        - Preferred captain: ${player.preferred_captain ? 'Yes' : 'No'},
                        - In next tournament: ${player.joined ? 'Yes' : 'No (maybe you\'d like to _!join_?'}
                    `);
                    return;
                });

                return;
            }
        });
    });

    return;
}