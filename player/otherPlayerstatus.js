exports.otherPlayerstatus = function (message, args, pool) {
    var user = message.mentions.users.first();
    var sql = `SELECT * FROM player WHERE playerID = '${user.id}'`;

    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                throw error;
            }

            if (results.length == 0) {
                message.channel.send(`I couldn't find ${user.username}, are is he *!registered*?`);
                return;
            } else {
                results.forEach(function (player) {
                    console.log(player);
                    message.channel.send(`
                        This is the info, ${user}: 
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