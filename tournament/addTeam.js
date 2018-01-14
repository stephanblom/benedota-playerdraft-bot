const config = require('config');

const Logger = require('le_node');
const logger = new Logger({
    token: process.env.LOGENTRIES_TOKEN || config.get('logentries_token')
});

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
    var captain = args[2];
    var avg_mmr = args[3];

    logger.debug(
        'TeamID: ' + team_ID,
        'Team players: ' + team_players,
        'Avg mmr: ' + avg_mmr,
        'Captain: ' + captain
    );

    var sql = `INSERT INTO team (ID, captain, avg_mmr)
        VALUES ('${team_ID}', '${captain}', '${avg_mmr}')
        ON DUPLICATE KEY UPDATE
            captain = '${captain}',
            avg_mmr = '${avg_mmr}'
    `;

    pool.getConnection(function(error, connection) {
        if (error) {
            console.error(error.toString());
            return;
        }
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

    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                message.channel.send(`Registering or updating team failed, an error occurred.`);
                return;
            }

            message.channel.send(`Team ${team_ID} registered or updated. `);
            return;
        });
    });

    return;
}