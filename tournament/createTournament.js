const sqlite3 = require('sqlite3').verbose();

exports.createTournament = function (message, args) {
    tournamentname = args[0];
    tournamentdate = args[1];
    tournamenttime = args[2];

    if (!tournamentname || !tournamentdate || !tournamenttime) {
        message.channel.send(
            `Creating tournament failed, too few arguments.`
        );

        return;
    }

    var database = new sqlite3.Database('./db/playerdraft.db', (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    var date = new Date(tournamentdate + "T" + tournamenttime + ":00");
    var moment = require('moment');

    database.serialize(function () {
        var sql =
            `INSERT INTO tournament (name, date)
            VALUES ('${tournamentname}', '${moment(date).format('YYYY-MM-DD HH:mm:ss')}')`;

        database.run(sql, [], function (err, allRows) {
            if (err) {
                console.error(err.toString());
                message.channel.send(`Creating tournament, an error occurred.`);
                return;
            }

            message.channel.send(`Tournament created`);
            database.close();
            return;
        });
    });

    return;
}