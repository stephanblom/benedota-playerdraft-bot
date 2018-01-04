const sqlite3 = require('sqlite3').verbose();

exports.joinTournament = function (message, args) {
    var database = new sqlite3.Database('./db/playerdraft.db', (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    var sql = `UPDATE player SET joined = 1 WHERE playerID = ${message.author.id} AND joined = 0`;

    database.run(sql, [], function (err, row) {
        if (err) {
            console.error(err.toString());
            message.channel.send(`Couldn't join, an error occurred.`);
            database.close();
            return;
        }

        if (this.changes == 0) {
            message.channel.send(`${message.author}, I couldn't join you, did you already join or are you not *!registered*?`);
            database.close();
            return;
        } else {
            message.channel.send(`${message.author}, you have now joined the BeNeDota Playerdraft!`);
            database.close();
            return;
        }
    });

    return;

}