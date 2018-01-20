exports.register = function (message, args, pool) {
    if (args.length < 3) {
        message.channel.send(
            `Registering ${message.author} failed, not enough parameters given. 
            Ex. command: *!register <mmr> <position> <preferred captain>*`
        );
        return;
    }

    mmr = parseInt(args[0]);
    preferred_position = args[1];
    preferred_captain = args[2];

    if (!mmr || isNaN(mmr) || !parseInt(mmr) || (mmr < 1 || mmr >= 10000)) {
        message.channel.send(
            `Registering ${message.author} failed, invalid mmr given. 
            Ex. command: *!register <mmr> <position> <preferred captain>*`
        );

        return;
    }

    if (!preferred_position) {
        message.channel.send(
            `Registering ${message.author} failed, no position given. 
            Ex. command: *!register <mmr> <position> <preferred captain>*`
        );
        return;
    }

    if (preferred_position.toLowerCase() === 'any') {
        preferred_position = 'Any';
    } else if (!isNaN(preferred_position)) {
        preferred_position = parseInt(preferred_position);
    }

    if (
        (typeof preferred_position === 'number' && (preferred_position < 1 || preferred_position > 5))
        || (typeof preferred_position === 'string' && preferred_position !== 'Any')
    ) {
        message.channel.send(
            `Registering ${message.author} failed, wrong position given. 
            Ex. command: *!register <mmr> <position> <preferred captain>*`
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

    var sql = `INSERT INTO player (playerID, playername, mmr, preferred_position, preferred_captain)
        VALUES ( 
            ${message.author.id},
            '${message.author.username}', 
            ${mmr}, 
            '${preferred_position}', 
            '${preferred_captain}'
        )
        ON DUPLICATE KEY UPDATE
            mmr = ${mmr},
            preferred_position = '${preferred_position}',
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
                + `*(MMR: ${mmr}, Prefers position: ${preferred_position}, `
                + `Prefers captain: ${preferred_captain ? 'Yes' : 'No'})*.`);
        });
    });
}