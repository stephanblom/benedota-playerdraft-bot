const sqlite3 = require('sqlite3').verbose();

exports.register = function (message, args) {
    mmr = args[0];
    position = args[1];
    captain = args[2].toLowerCase();

    if (!mmr) {
        message.channel.send(
            `Registering ${message.author} failed, no mmr given. 
            Ex. command: *!register <mmr> <position>*`
        );
        return;
    }

    if (!position) {
        message.channel.send(
            `Registering ${message.author} failed, no position given. 
            Ex. command: *!register <mmr> <position>*`
        );
        return;
    }

    if (!captain) {
        message.channel.send(
            `Registering ${message.author} failed, no preferred captain given. 
            Ex. command: *!register <mmr> <position> <preferred captain (1/Ja/Yes/True of 0/Nee/No/False)>*`
        );
        return;
    } else {
        switch (captain) {
            case "1":
            case "ja":
            case "true":
            case "yes":
                captain = 'True';
                break;
            case "0":
            case "nee":
            case "false":
            case "no":
                captain = 'False';
                break;
        }
    }

    var database = new sqlite3.Database('./db/playerdraft.db', (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    database.serialize(function () {
        var sql = `INSERT OR REPLACE INTO player (playerID, playername, mmr, position, captain)
            VALUES ('${message.author.id}', '${message.author.username}', ${mmr}, '${position}', '${captain}')
        `;

        database.run(sql, [], function (err, allRows) {
            if (err) {
                console.error(err.toString());
                message.channel.send(`Registering or updating player failed, an error occurred.`);
                return;
            }

            message.channel.send(`${message.author} registered or updated. `);
            database.close();
            return;
        });
    });
}