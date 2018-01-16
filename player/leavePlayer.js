exports.leavePlayer = function (message, args, pool) {
    var userId = args[0].replace(/['"]+/g, '');
    var sql = `UPDATE player SET joined = NULL WHERE playername = '${userId}' AND joined IS NOT NULL`;

    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                throw error;
            }

            if (results.affectedRows === 0) {
                message.channel.send(`I couldn't join ${userId}, did the player already join or are you not *!registered*?`);
                return;
            } else {
                message.channel.send(`${userId} has now left the BeNeDota Playerdraft.`);
                return;
            }
        });
    });

    return;
}