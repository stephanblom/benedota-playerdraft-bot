exports.leaveTournament = function (message, args, pool) {
    var sql = `UPDATE player SET joined = 0 WHERE playerID = ${message.author.id} AND joined = 1`;

    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                throw error;
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