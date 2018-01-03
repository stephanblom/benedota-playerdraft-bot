const sqlite3 = require('sqlite3').verbose();

exports.joinTournament = function (message, args) {
    tournamentID = args[0];
    if (!tournamentID) {
        message.channel.send(
            `Joining tournament failed, no tournament (ID) given.`
        );
        return;
    }

    var database = new sqlite3.Database('./db/playerdraft.db', (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    database.serialize(function () {
        var sql = `INSERT INTO tournament_player (tournamentID, playerID)
            VALUES(${tournamentID}, '${message.author.id}')`;

        database.run(sql, [], function (err, row) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    message.channel.send(`${message.author}, you are already in this tournament!`);
                    return;
                } else {
                    console.error(err.toString());
                    message.channel.send(`Couldn't join tournament, an error occurred.`);
                    return;
                }
            }

            message.channel.send(`${message.author}, you are now signed up for tournament ${tournamentID}`);
            return;
        });
    });

    return;

}