exports.registerPlayer = function (message, args, pool) {
    if (args.length < 3) {
        message.channel.send(
            `Registering failed, not enough parameters given. 
            Ex. command: *!register <mmr> <preferred captain> <position> <position (optional ...)>*`
        );
        return;
    }

    var exampleCommand = `Ex. command: *!register <mmr> <preferred captain> <position> <position (optional ...)>*`;

    var [userID, mmr, preferred_captain, ...preferred_positions] = args;
    var user = message.mentions.users.first();

    if (!user) {
        message.channel.send(
            `Registering failed, no user given. `
            + exampleCommand
        );

        return;
    }

    if (!mmr || isNaN(mmr) || (mmr < 1 || mmr >= 10000)) {
        message.channel.send(
            `Registering failed, invalid mmr given.`
            + exampleCommand
        );

        return;
    }

    if (!preferred_positions) {
        message.channel.send(
            `Registering failed, no position given.`
            + exampleCommand
        );
        return;
    }

    if (!preferred_captain) {
        message.channel.send(
            `Registering failed, no preferred captain given. `
            + exampleCommand
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
            default:
                message.channel.send(
                    `Registering failed, invalid preferred captain given. `
                    + exampleCommand
                );
                return;
        }
    }

    var invalid_position = false;
    preferred_positions.forEach(function (preferred_position) {
        if (preferred_position.toLowerCase() === 'any') {
            preferred_positions = 'Any';
        } else if (isNaN(preferred_position)
            || preferred_position < 1
            || preferred_position > 5) {
            invalid_position = preferred_position;
        }
    });

    if (invalid_position) {
        message.channel.send(
            `Registering failed, invalid preferred position given (${invalid_position}). 
            Ex. command: *!register <mmr> <preferred captain> <position> <position (optional) ...>*`
        );
        return;
    }

    var sql = `INSERT INTO player (playerID, playername, mmr, preferred_positions, preferred_captain)
        VALUES ( 
            '${user.id}',
            '${user.username}', 
            ${mmr}, 
            '${preferred_positions}', 
            '${preferred_captain}'
        )
        ON DUPLICATE KEY UPDATE
            playername = '${user.username}',
            mmr = ${mmr},
            preferred_positions = '${preferred_positions}',
            preferred_captain = '${preferred_captain}'
    `;

    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                throw error;
            }

            message.channel.send(`${user} is registered or updated *(MMR: ${mmr}, `
            + `Prefers position: ${preferred_positions}, `
            + `Prefers captain: ${preferred_captain ? 'Yes' : 'No'}).*`);
        });
    });
}