const sqlite3 = require('sqlite3').verbose();

exports.addTeam = function (message, args) {

    if (args.length < 4) {
        message.channel.send(
            `Adding team failed, not enough arguments. 
            Ex. command: *!addteam <number> <players from csv> <captain> <avg mmr>*`
        );
        return;
    }

    var team_ID = args[0];
    var team_players = args[1];
    var avg_mmr = args[2];
    var captain = args[3];

    var database = new sqlite3.Database('./db/playerdraft.db', (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    database.serialize(function () {
        var sql = `INSERT OR REPLACE INTO team (ID, captain, avg_mmr)
            VALUES ('${team_ID}', '${captain}', '${avg_mmr}')
        `;

        database.run(sql, [], function (err, allRows) {
            if (err) {
                console.error(err.toString());
                message.channel.send(`Registering or updating team failed, an error occurred.`);
                return;
            }

            message.channel.send(`Team ${team_ID} registered or updated. `);
            database.close();
            return;
        });
    });

}