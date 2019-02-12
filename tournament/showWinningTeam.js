const Discord = require('discord.js');

exports.showWinningTeam = function(message, args, pool)
{
    if (args.length < 1 || args.length > 4) {
        message.channel.send(`Incorrect number of arguments. I just need 1 number, of the winning team.`);
        return;
    }

    let winningTeam = parseInt(args[0]);
    if (!isNaN(args[0])) {
        winningTeam = parseInt(args[0]);
    } else if (!isNaN(args[1])) {
        winningTeam = parseInt(args[1]);
    } else if (!isNaN(args[2])) {
        winningTeam = parseInt(args[2]);
    }

    let sql = `SELECT teamID, 
            team_player.playerID as playerID, 
            playername, 
            position, 
            kayzrname, 
            mmr, 
            preferred_positions, 
            preferred_captain 
        FROM team_player
        LEFT JOIN player on player.playerID = team_player.playerID
        LEFT JOIN team on team.ID = team_player.teamID
        WHERE team.ID = ?
        ORDER BY team_player.position`;

    pool.getConnection(function(error, connection) {
        connection.query({
            sql: sql,
            values: [
                winningTeam
            ]
        }, function (error, results) {
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

            let embed = new Discord.RichEmbed()
                .setTitle('BeNeDota Player Draft Winning Team')
                .setFooter(`BeNeDota Kayzr Player Draft Team Info`)
                .setThumbnail('https://benedota.com/thumbs/assets/images/benedota_transp_crop-217x250.png')
                .setTimestamp()
                .setDescription(`May I present to you, the winners of this weeks BeNeDota Player Draft!`)

            let colors = [
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

            embed.setColor(colors[winningTeam]);

            let kayzrAlphaWinnersRole = message.guild.roles.find(role => role.name === 'Kayzr Alpha Winners');

            results.forEach(function(player) {
                embed.addField(
                    `${player['position']}. ${player['playername']} ${player.kayzrname ? '(Kayzr: ' + player.kayzrname + ')' : ''}`,
                    `Preferred role: ${player['preferred_positions']}, Preferred captain: ${player['preferred_captain'] == 1 ? 'Yes' : 'No'}`
                );

                if (args.includes('updateRoles')) {
                    let guildMember = message.guild.members.find('id', player['playerID']);
                    if (guildMember) {
                        guildMember.addRole(kayzrAlphaWinnersRole)
                            .catch(error => {
                                logger.err(error)
                            });
                    }
                }
            });

            if (args.includes('live')) {
                message.guild.channels.get(process.env.showteamsChannel).send({embed});
            } else {
                message.channel.send({embed});
            }
        });
    });
};