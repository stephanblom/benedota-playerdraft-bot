exports.joinPlayer = function (message, args, pool) {
    var user = message.mentions.users.first();

    if (!user) {
        message.channel.send(
            `No user given to join. `
        );
    }

    var sql = `UPDATE player SET joined = NOW() WHERE playerID = ? AND joined IS NULL`;

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

            if (results.affectedRows === 0) {
                message.channel.send(`I couldn't join ${user.username}, did the player already join or are you not *!registered*?`);
                return;
            } else {
                message.channel.send(`${user} has now joined the BeNeDota Playerdraft!`);
                return;
            }
        });
    });

    return;
}