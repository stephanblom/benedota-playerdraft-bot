exports.registerPlayer = function (message, args, pool) {
    if (args.length < 3) {
        message.channel.send(
            `Registering failed, not enough parameters given. 
            Ex. command: *!register <mmr> <position> <preferred captain>*`
        );
        return;
    }

    userId = args[0]
    mmr = args[1];
    preferred_position = args[2];
    preferred_captain = args[3];

    if (!mmr) {
        message.channel.send(
            `Registering failed, no mmr given. 
            Ex. command: *!register <mmr> <position> <preferred captain>*`
        );
        return;
    }

    if (!preferred_position) {
        message.channel.send(
            `Registering failed, no position given. 
            Ex. command: *!register <mmr> <position> <preferred captain>*`
        );
        return;
    }

    if ((preferred_position.toLowerCase() !== 'any' && isNaN(preferred_position)) || (preferred_position < 1 || preferred_position > 5)) {
        message.channel.send(
            `Registering failed, wrong position given. 
            Ex. command: *!register <mmr> <position> <preferred captain>*`
        );
        return;
    }

    if (!preferred_captain) {
        message.channel.send(
            `Registering failed, no preferred captain given. 
            Ex. command: *!register <mmr> <position> <preferred captain (1/Ja/Yes/True of 0/Nee/No/False)>*`
        );
        return;
    } else {
        switch (preferred_captain.toLowerCase()) {
            case "1":
            case "ja":
            case "true":
            case "yes":
                preferred_captain = 1;
                break;
            case "0":
            case "nee":
            case "false":
            case "no":
                preferred_captain = 0;
                break;
        }
    }

    var user = message.mentions.members.first().user;

    var sql = `INSERT INTO player (playerID, playername, mmr, preferred_position, preferred_captain)
        VALUES (
            '${user.id}', 
            '${user.username}', 
            ${mmr}, 
            '${preferred_position}', 
            '${preferred_captain}'
        )
        ON DUPLICATE KEY UPDATE
            mmr = ${mmr},
            preferred_position = ${preferred_position},
            preferred_captain = ${preferred_captain}
    `;

    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                throw error;
            }

            message.channel.send(`Player is registered or updated. `);
        });
    });
}