exports.addTeam = function (message, args, pool) {
    if (args.length < 4) {
        message.channel.send(
            `Adding team failed, not enough arguments. 
            Ex. command: *!addteam <number> <players from csv> <captain> <avg mmr>*`
        );
        return;
    }

    var team_ID = args[0];
    var team_players = args[1];
    var avg_mmr = args[2];
    var captain = args[3];

    var sql = `INSERT INTO team (ID, captain, avg_mmr)
        VALUES ('${team_ID}', '${captain}', '${avg_mmr}')
        ON DUPLICATE KEY UPDATE
            captain = '${captain}',
            avg_mmr = '${avg_mmr}'
    `;
    console.log(sql);

    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                message.channel.send(`Registering or updating team failed, an error occurred.`);
                return;
            }

            addPlayers(message, pool, team_ID, team_players);
            return;
        });
    });

    return;
}

function addPlayers(message, pool, team_ID, players)
{
    var playerList = players.split(';');
    var sql = `INSERT INTO team_player (team_ID, player_name, position) VALUES`;
    playerList.forEach(function (player) {
        playerInfo = player.split(':');
        sql += `('${team_ID}', '${playerInfo[1]}', '${playerInfo[0]}'),`;
    });

    sql = sql.replace(/,\s*$/, "");
    sql += 'ON DUPLICATE KEY UPDATE player_name = VALUES(player_name), position = VALUES(position)'
    console.log(sql);

    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                message.channel.send(`Registering or updating team failed, an error occurred.`);
                return;
            }

            console.log(`Team ${team_ID} registered or updated. `)
            message.channel.send(`Team ${team_ID} registered or updated. `);
            return;
        });
    });

    return;
}