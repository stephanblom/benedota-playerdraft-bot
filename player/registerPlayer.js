const Discord = require('discord.js');
const DiscordClient = new Discord.Client();

exports.registerPlayer = function (message, args, pool) {
    if (args.length < 3) {
        message.channel.send(
            `Registering failed, not enough parameters given. 
            Ex. command: *!register <mmr> <position> <preferred captain>*`
        );
        return;
    }

    var userId = args[0].replace(/['"]+/g, '');
    var mmr = parseInt(args[1]);
    var preferred_position = args[2];
    var preferred_captain = args[3];

    if (!mmr || isNaN(mmr) || (mmr < 1 || mmr >= 10000)) {
        message.channel.send(
            `Registering ${message.author} failed, invalid mmr given. 
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
            default:
                message.channel.send(
                    `Registering ${message.author} failed, invalid preferred captain given. 
                    Ex. command: *!register <mmr> <position> <preferred captain (1/Ja/Yes/True of 0/Nee/No/False)>*`
                );
                return;
        }
    }

    var members = message.guild.members.array();
    var guildMember = members.find(function(object) { return object.user.username == userId; });
    if (guildMember && guildMember.user) {
        var user = guildMember.user;
    } else {
        message.channel.send(
            `Registering ${userId} failed, user not found.`
        );
        return;
    }

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

            message.channel.send(`${user} is registered or updated *(MMR: ${mmr}, `
            + `Prefers position: ${preferred_position}, `
            + `Prefers captain: ${preferred_captain ? 'Yes' : 'No'}).*`);
        });
    });
}