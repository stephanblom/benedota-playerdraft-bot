exports.leaveTournament = function (message, args, pool) {
    var sql = `UPDATE player SET joined = NULL WHERE playerID = ? AND joined IS NOT NULL`;

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
            }

            if (this.changes == 0) {
                message.channel.send(`${message.author}, I couldn't leave you, have you joined before, or are you not *!registered*?`);
                return;
            } else {
                message.channel.send(`${message.author}, you have now left the BeNeDota Playerdraft.`);
                return;
            }
        });
    });

    return;
}