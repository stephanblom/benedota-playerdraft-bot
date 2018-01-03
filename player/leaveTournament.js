const sqlite3 = require('sqlite3').verbose();

exports.leaveTournament = function (message, args) {
    var database = new sqlite3.Database('./db/playerdraft.db', (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    database.serialize(function () {
        var sql = `UPDATE player SET joined = 0 WHERE playerID = ${message.author.id} AND joined = 1`;

        database.run(sql, [], function (err, row) {
            if (err) {
                console.error(err.toString());
                message.channel.send(`Couldn't leave, an error occurred.`);
                database.close();
                return;
            }

            if (this.changes == 0) {
                message.channel.send(`${message.author}, I couldn't join you, have you joined before, or are you not *!registered*?`);
                database.close();
                return;
            } else {
                message.channel.send(`${message.author}, you have now left the BeNeDota Playerdraft.`);
                database.close();
                return;
            }
        });
    });

    return;

}