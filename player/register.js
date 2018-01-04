const sqlite3 = require('sqlite3').verbose();

exports.register = function (message, args) {
    if (args.length < 3) {
        message.channel.send(
            `Registering ${message.author} failed, not enough parameters given. 
            Ex. command: *!register <mmr> <position> <preferred captain>*`
        );
        return;
    }

    mmr = args[0];
    position = args[1];
    captain = args[2];

    if (!mmr) {
        message.channel.send(
            `Registering ${message.author} failed, no mmr given. 
            Ex. command: *!register <mmr> <position> <preferred captain>*`
        );
        return;
    }

    if (!position) {
        message.channel.send(
            `Registering ${message.author} failed, no position given. 
            Ex. command: *!register <mmr> <position> <preferred captain>*`
        );
        return;
    }

    if (position.toLowerCase() !== 'any' && isNaN(position)) {
        message.channel.send(
            `Registering ${message.author} failed, wrong position given. 
            Ex. command: *!register <mmr> <position> <preferred captain>*`
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
        switch (captain.toLowerCase()) {
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

    var sql = `INSERT OR REPLACE INTO player (playerID, playername, mmr, preferred_position, preferred_captain, joined)
        VALUES (
            '${message.author.id}', 
            '${message.author.username}', 
            ${mmr}, 
            '${position}', 
            '${captain}',
            (SELECT joined FROM player WHERE playerID = '${message.author.id}')}
        )
    `;

    database.run(sql, [], function (err, allRows) {
        if (err) {
            console.error(err.toString());
            message.channel.send(`Registering or updating player failed, an error occurred.`);
            return;
        }

        message.channel.send(`${message.author} registered or updated. `);
        database.close();
    });
}