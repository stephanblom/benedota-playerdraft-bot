const Discord = require('discord.js');

exports.showTeams = function (message, args, pool) {
    var sql = `SELECT * 
        FROM team_player 
        LEFT JOIN team ON team.ID = team_player.team_ID 
        LEFT JOIN player ON player.playername = team_player.player_name
        WHERE player.playerID IS NOT NULL`;

    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                message.channel.send(`Getting players failed, an error occurred.`);
                return;
            }

            if (!results || !results.length) {
                message.channel.send(`No players are in a team yet.`);
                return;
            }

            exportTeams(message, pool, results);

            return;
        });
    });

    return;
}

exportTeams = function(message, pool, players) {
    var sql = `SELECT * FROM team`;

    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();
            if (error) {
                console.error(error.toString());
                message.channel.send(`Getting players failed, an error occurred.`);
                return;
            }

            if (!results || !results.length) {
                message.channel.send(`No teams.`);
                return;
            }

            showPlayers(message, players, results);

            return;
        });
    });

    return;
}

showPlayers = function(message, players, teams) {
    teams.forEach(function (team) {
        var embed = new Discord.RichEmbed()
            .setColor('#c50003')
            .setTimestamp();

        embed.setDescription(`The captain is ${team['preferred_captain']} and the average MMR is ${team['avg_mmr']}`)
            .setTitle(`Team ${team['ID']}`)
            .setFooter(`BeNeDota Kayzr Player Draft Team ${team['ID']}`);

        players.forEach(function (player) {
            if (player['team_ID'] == team['ID']) {
                embed.addField(
                    `${player['position']}. ${player['playername']}`,
                    `Preferred role: ${player['preferred_position']}, Preferred captain: ${player['preferred_captain'] === 'True' ? 'Yes' : 'No'}`
                );
            }
        });

        message.channel.send({embed});
    });

}