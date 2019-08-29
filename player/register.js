exports.register = function (message, args, pool) {
    const exampleCommand = `Ex. command: *!register <coremmr> <supportmmr> <preferred captain> <position> <position (optional ...)>*`;

    if (args.length < 3) {
        message.channel.send(
            `Registering ${message.author} failed, not enough parameters given. 
            ${exampleCommand}`
        );
        return;
    }

    let [coremmr, supportmmr, preferred_captain, ...preferred_positions] = args;

    if (!coremmr || isNaN(coremmr) || !parseInt(coremmr) || (coremmr < 1 || coremmr >= 10000)) {
        message.channel.send(
            `Registering ${message.author} failed, invalid mmr given (${coremmr}). 
            ${exampleCommand}`
        );

        return;
    }

    if (!supportmmr || isNaN(supportmmr) || !parseInt(supportmmr) || (supportmmr < 1 || supportmmr >= 10000)) {
        message.channel.send(
            `Registering ${message.author} failed, invalid mmr given (${supportmmr}). 
            ${exampleCommand}`
        );

        return;
    }

    if (!preferred_positions) {
        message.channel.send(
            `Registering ${message.author} failed, no position given.
            ${exampleCommand}`
        );
        return;
    }

    if (!preferred_captain) {
        message.channel.send(
            `Registering ${message.author} failed, no preferred captain given. This should be either 'yes' or 'no'. 
            ${exampleCommand}`
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
                    `Registering ${message.author} failed, invalid preferred captain given (${preferred_captain}).
                    ${exampleCommand}`
                );
                return;
        }
    }

    let invalid_position = false;
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
            ${exampleCommand}`
        );
        return;
    }

    if (Array.isArray(preferred_positions)) {
        preferred_positions = preferred_positions.slice(0, 5);
        preferred_positions = preferred_positions.join(',');
    }

    let sql = `INSERT INTO player (playerID, playername, coremmr, supportmmr, preferred_positions, preferred_captain)
        VALUES (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )
        ON DUPLICATE KEY UPDATE
            playername = ?,
            coremmr = ?,
            supportmmr = ?,
            preferred_positions = ?,
            preferred_captain = ?
    `;

    pool.getConnection(function(error, connection) {
        connection.query({
            sql: sql,
            values: [
                message.author.id,
                message.author.username,
                coremmr,
                supportmmr,
                preferred_positions,
                preferred_captain,
                message.author.username,
                coremmr,
                supportmmr,
                preferred_positions,
                preferred_captain
            ]
        },
        function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                throw error;
            }

            message.channel.send(`${message.author} is registered or updated: `
                + `*(Core MMR: ${coremmr}, Support MMR: ${supportmmr}, Prefers position(s): ${preferred_positions}, `
                + `Prefers captain: ${preferred_captain ? 'Yes' : 'No'})*.`);
        });
    });
};