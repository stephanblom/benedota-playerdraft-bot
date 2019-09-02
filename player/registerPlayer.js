exports.registerPlayer = function (message, args, pool) {
    const exampleCommand = `Ex. command: *!register <coremmr> <supportmmr> <preferred captain> <position> <position (optional ...)>*`;

    if (args.length < 3) {
        message.channel.send(
            `Registering failed, not enough parameters given. `
            + exampleCommand
        );
        return;
    }

    let [user, coremmr, supportmmr, preferred_captain, ...preferred_positions] = args;
    user = message.mentions.users.first();

    if (!user) {
        message.channel.send(
            `Registering failed, no user given. `
            + exampleCommand
        );

        return;
    }

    if (!coremmr || isNaN(coremmr) || (coremmr < 1 || coremmr >= 10000)) {
        message.channel.send(
            `Registering failed, invalid coremmr given ${coremmr}.`
            + exampleCommand
        );

        return;
    }

    if (!supportmmr || isNaN(supportmmr) || (supportmmr < 1 || supportmmr >= 10000)) {
        message.channel.send(
            `Registering failed, invalid coremmr given ${supportmmr}.`
            + exampleCommand
        );

        return;
    }

    if (!preferred_positions) {
        message.channel.send(
            `Registering failed, no preferred positions given.`
            + exampleCommand
        );
        return;
    }

    if (!preferred_captain) {
        message.channel.send(
            `Registering failed, no preferred captain given. This should be either "Yes" or "No".`
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
                    `Registering failed, invalid preferred captain given. This should be either "Yes" or "No".`
                    + exampleCommand
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
            `Registering failed, invalid preferred position given (${invalid_position}).`
            + exampleCommand
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
                user.id,
                user.username,
                coremmr,
                supportmmr,
                preferred_positions,
                preferred_captain,
                user.username,
                coremmr,
                supportmmr,
                preferred_positions,
                preferred_captain
            ]
        }, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                throw error;
            }

            message.channel.send(`${user} is registered or updated:`
                + `*(CoreMMR: ${coremmr}, `
                + `SupportMMR: ${supportmmr}, `
                + `Prefers position(s): ${preferred_positions}, `
                + `Prefers captain: ${preferred_captain ? 'Yes' : 'No'}).*`);
        });
    });
};