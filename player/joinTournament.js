exports.joinTournament = function (message, args, pool) {
    var sql = `UPDATE player SET joined = NOW() WHERE playerID = '${message.author.id}' AND joined IS NULL`;

    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                throw error;
            }

            if (results.affectedRows === 0) {
                message.channel.send(`${message.author}, I couldn't join you, did you already join or are you not *!registered*?`);
                return;
            } else {
                message.channel.send(`${message.author}, you have now joined the BeNeDota Playerdraft!`);
                message.channel.send(`The tournament check-in is open from 19:30 CET, please be on time!`);
                return;
            }
        });
    });

    return;
}