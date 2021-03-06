exports.otherPlayerstatus = function (message, args, pool) {
    var user = message.mentions.users.first();
    var sql = `SELECT * FROM player WHERE playerID = ?`;

    pool.getConnection(function(error, connection) {
        connection.query({
            sql: sql,
            values: [
                user.id
            ]
        }, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                throw error;
            }

            if (results.length == 0) {
                message.channel.send(`I couldn't find ${user.username}, is he *!registered*?`);
                return;
            } else {
                results.forEach(function (player) {
                    message.channel.send(`
                        This is the info, ${user}: 
                        - Username: ${player.playername}
                        - Core MMR: ${player.coremmr}
                        - Support MMR: ${player.supportmmr}
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