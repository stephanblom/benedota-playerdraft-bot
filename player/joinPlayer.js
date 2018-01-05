exports.joinPlayer = function (message, args, pool) {
    var user = message.mentions.members.first().user;
    var sql = `UPDATE player SET joined = 1 WHERE playerID = ${user.id} AND joined = 0`;

    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                throw error;
            }

            if (results.affectedRows === 0) {
                message.channel.send(`I couldn't join the player, did the player already join or are you not *!registered*?`);
                return;
            } else {
                message.channel.send(`The player has now joined the BeNeDota Playerdraft!`);
                return;
            }
        });
    });

    return;
}