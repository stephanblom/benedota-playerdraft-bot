const Discord = require('discord.js');

exports.endTournament = function (message, args, pool) {
    if (args.length < 1 || args.length > 2 || isNaN(args[0])) {
        message.channel.send(`Not enough argumnets. I just need 1 number, of the winning team.`);
    }
    var winningTeam = parseInt(args[0]);
    var sql = `SELECT * 
        FROM team_player
        LEFT JOIN player on player.playername = team_player.player_name
        LEFT JOIN team on team.ID = team_player.team_ID
        WHERE team.ID = ${winningTeam}
        ORDER BY team_player.position`

    pool.getConnection(function(error, connection) {
        connection.query(sql, function (error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                message.channel.send(`Getting info failed, an error occurred.`);
                return;
            }

            if (!results || !results.length) {
                message.channel.send(`No info.`);
                return;
            }

            var embed = new Discord.RichEmbed()
                .setTitle('BeNeDota Player Draft Winning Team')
                .setFooter(`BeNeDota Kayzr Player Draft Team Info`)
                .setThumbnail('https://benedota.com/thumbs/assets/images/benedota_transp_crop-217x250.png')
                .setTimestamp()
                .setDescription(`May I present to you, the winners of this weeks BeNeDota Player Draft!`)

            var colors = [
                '3375ff',
                '66ffbf',
                'bf00bf',
                'f3f00b',
                'ff6b00',

                'fe86c2',
                'a1b447',
                '65d9f7',
                '008321',
                'a46900'
            ];

            results.forEach(function(player) {
                embed.addField(
                    `${player['position']}. ${player['playername']}`,
                    `Preferred role: ${player['preferred_position']}, Preferred captain: ${player['preferred_captain'] == 1 ? 'Yes' : 'No'}`
                );
                embed.setColor(colors[player['team_ID']]);
            });

            if (args[1] === 'live') {
                message.guild.channels.get(process.env.showteamsChannel).send({embed});
            } else {
                message.channel.send({embed});
            }

            resetJoins(message, args, pool);

            return;
        });
    });
    return;
}

resetJoins = function (message, args, pool)
{
    var sql = `UPDATE player SET joined = NULL WHERE joined IS NOT NULL`;

    pool.getConnection(function(error, connection) {
        connection.query(sql, function (error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                message.channel.send(`Resetting joins failed, an error occurred.`);
                return;
            }

            var notice = `@everyone! De spelerslijst is weer geleegd, en vanaf nu kan iedereen zich dus weer inschrijven!`;
            if (args[1] === 'live') {
                message.guild.channels.get(process.env.showteamsChannel).send(notice);
            } else {
                message.channel.send(notice);
            }

            return;
        });
    });
    return;
}