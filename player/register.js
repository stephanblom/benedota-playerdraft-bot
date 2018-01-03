const sqlite3 = require('sqlite3').verbose();

exports.register = function (message, args) {
    mmr = args[0];
    positions = args.splice(1).join(', ');

    if (!mmr) {
        message.channel.send(
            `Registering ${message.author} failed, no mmr given. 
            Ex. command: **!register <mmr> <position>** *<position:optional> <position:optional>*`
        );
        return;
    }

    if (!positions) {
        message.channel.send(
            `Registering ${message.author} failed, no position given. 
            Ex. command: **!register <mmr> <position>** *<position:optional> <position:optional>*`
        );
        return;
    }

    var database = new sqlite3.Database('./db/playerdraft.db', (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    database.serialize(function () {
        var sql = `INSERT OR REPLACE INTO player (playerID, playername, mmr, positions)
            VALUES ('${message.author.id}', '${message.author.username}', ${mmr}, '${positions}')
        `;

        database.run(sql, [], function (err, allRows) {
            if (err) {
                console.error(err.toString());
                message.channel.send(`Registering player failed, an error occurred.`);
                return;
            }

            message.channel.send(`${message.author} registered. `);
            database.close();
            return;
        });
    });
}