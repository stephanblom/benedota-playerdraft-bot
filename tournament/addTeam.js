const Logger = require('le_node');
const logger = new Logger({
    token: process.env.LOGENTRIES_TOKEN
});

exports.addTeam = function (message, args, pool) {
    if (Object.keys(args).length < 4) {
        message.channel.send(
            `Adding team failed, not enough arguments. 
            Ex. command: *!addteam <number> <players from csv> <captain> <avg mmr>*`
        );
        return;
    }

    let team_ID = args.ID;
    let team_players = args.players;
    let captain = args.captain;
    let avg_mmr = args.avg_mmr;

    logger.debug(
        'TeamID: ' + team_ID,
        'Team players: ' + team_players,
        'Avg mmr: ' + avg_mmr,
        'Captain: ' + captain
    );

    let sql = `INSERT INTO team (ID, captain, avg_mmr)
        VALUES (?, (SELECT playername FROM player WHERE playerID = ?), ?)
    `;

    pool.getConnection(function(error, connection) {
        if (error) {
            console.error(error.toString());
            return;
        }

        connection.query({
            sql: sql,
            values: [
                team_ID,
                captain,
                avg_mmr
            ]
        }, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                message.channel.send(`Registering or updating team failed, an error occurred.`);
                return;
            }

            addPlayers(message, pool, team_ID, team_players);
        });
    });
};

function addPlayers(message, pool, team_ID, players)
{
    let playerList = players.split(';');
    let sql = `INSERT INTO team_player (teamID, playerID, position) VALUES`;
    playerList.forEach(function (player) {
        let playerInfo = player.split(':');
        sql += `(${pool.escape(team_ID)}, ${pool.escape(playerInfo[1])}, ${pool.escape(playerInfo[0])}),`;
    });

    sql = sql.replace(/,\s*$/, "");
    sql += 'ON DUPLICATE KEY UPDATE playerID = VALUES(playerID), position = VALUES(position)'

    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                message.channel.send(`Registering or updating team failed, an error occurred.`);
                return;
            }

            message.channel.send(`Team ${team_ID} registered or updated. `);
        });
    });
};