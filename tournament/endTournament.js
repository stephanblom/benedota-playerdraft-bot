exports.endTournament = function (message, args, pool) {
    var sql = `UPDATE player SET joined = NULL WHERE joined IS NOT NULL`;

    pool.getConnection(function(error, connection) {
        connection.query(sql, function (error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                message.channel.send(`Resetting joins failed, an error occurred.`);
                return;
            }

            var notice = `@everyone! De spelerslijst is weer geleegd, en vanaf nu kan iedereen zich dus weer inschrijven!`;
            if (args[1] === 'live') {
                message.guild.channels.get(process.env.showteamsChannel).send(notice);
            } else {
                message.channel.send(notice);
            }

            return;
        });
    });
    return;
}