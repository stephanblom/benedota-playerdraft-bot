exports.leaveTournament = function (message, args, connection) {
    var sql = `UPDATE player SET joined = 0 WHERE playerID = ${message.author.id} AND joined = 1`;

    connection.query(sql, (error, results) => {
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

    database.run(sql, [], function (err, row) {
        if (err) {
            console.error(err.toString());
            message.channel.send(`Couldn't leave, an error occurred.`);
            database.close();
            return;
        }

        if (this.changes == 0) {
            message.channel.send(`${message.author}, I couldn't leave you, have you joined before, or are you not *!registered*?`);
            database.close();
            return;
        } else {
            message.channel.send(`${message.author}, you have now left the BeNeDota Playerdraft.`);
            database.close();
            return;
        }
    });

    return;

}