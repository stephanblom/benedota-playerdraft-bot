exports.register = function (message, args, pool) {
    if (args.length < 3) {
        message.channel.send(
            `Registering ${message.author} failed, not enough parameters given. 
            Ex. command: *!register <mmr> <preferred captain> <position> <position (optional) ...>*`
        );
        return;
    }

    var [mmr, preferred_captain, ...preferred_positions] = args;

    if (!mmr || isNaN(mmr) || !parseInt(mmr) || (mmr < 1 || mmr >= 10000)) {
        message.channel.send(
            `Registering ${message.author} failed, invalid mmr given. 
            Ex. command: *!register <mmr> <preferred captain> <position> <position (optional ...)>*`
        );

        return;
    }

    if (!preferred_positions) {
        message.channel.send(
            `Registering ${message.author} failed, no position given. 
            Ex. command: *!register <mmr> <preferred captain> <position> <position (optional) ...>*`
        );
        return;
    }

    if (!preferred_captain) {
        message.channel.send(
            `Registering ${message.author} failed, no preferred captain given. 
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
            default:
                message.channel.send(
                    `Registering ${message.author} failed, invalid preferred captain given. 
                    Ex. command: *!register <mmr> <position> <preferred captain (1/Ja/Yes/True of 0/Nee/No/False)>*`
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
            `Registering ${message.author} failed, invalid preferred position given (${invalid_position}). 
            Ex. command: *!register <mmr> <preferred captain> <position> <position (optional) ...>*`
        );
        return;
    }

    if (Array.isArray(preferred_positions)) {
        preferred_positions = preferred_positions.join(',');
    }

    var sql = `INSERT INTO player (playerID, playername, mmr, preferred_positions, preferred_captain)
        VALUES ( 
            ${message.author.id},
            '${message.author.username}', 
            ${mmr}, 
            '${preferred_positions}', 
            '${preferred_captain}'
        )
        ON DUPLICATE KEY UPDATE
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

            message.channel.send(`${message.author} is registered or updated `
                + `*(MMR: ${mmr}, Prefers position: ${preferred_positions}, `
                + `Prefers captain: ${preferred_captain ? 'Yes' : 'No'})*.`);
        });
    });
}