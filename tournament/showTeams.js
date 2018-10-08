const Discord = require('discord.js');

const sendEmbed = function(message, args, embed)
{
    if (args[0] == 'live') {
        message.guild.channels.get(process.env.showteamsChannel).send({embed});
    } else {
        message.channel.send({embed})
    }
};

const showPlayers = async function (message, args, players, teams) {
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
    let i = 0;

    teams.forEach(function (team) {
        if (i == 9) {
            i = 0;
        }

        let embed = new Discord.RichEmbed()
            .setColor('#' + colors[i])
            .attachFile(`./images/dota2${colors[i]}.png`)
            .setThumbnail(`attachment://dota2${colors[i]}.png`)
            .setTimestamp();

        embed.setDescription(`The captain is ${team['captain']} and the average MMR is ${team['avg_mmr']}.`)
            .setTitle(`Team ${team['ID']}`)
            .setFooter(`BeNeDota Kayzr Player Draft Team ${team['ID']}`);

        players.forEach(function (player) {
            if (player['teamID'] == team['ID']) {
                embed.addField(
                    `${player.position}. ${player.playername} ${player.kayzrname ? '(Kayzr: ' + player.kayzrname + ')' : ''}`,
                    `Preferred role: ${player.preferred_positions}, Preferred captain: ${player.preferred_captain == 1 ? 'Yes' : 'No'}`
                );
            };
        });

        sendEmbed(message, args, embed);
        i++;
    });

};

const exportTeams = function(message, args, pool, players) {
    let sql = `SELECT * FROM team ORDER BY ID`;

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

            showPlayers(message, args, players, results);
        });
    });

};

const showTeams = function (message, args, pool) {
    let sql = `SELECT player.*, team_player.teamID, team_player.position
        FROM team_player 
        LEFT JOIN team ON team.ID = team_player.teamID 
        LEFT JOIN player ON player.playerID = team_player.playerID
        WHERE player.playername IS NOT NULL
        ORDER BY team_player.teamID, team_player.position ASC`;

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

            exportTeams(message, args, pool, results);

        });
    });
};

const showTournamentInfo = function (message, args, pool, results) {
    const embed = new Discord.RichEmbed()
        .setTitle('BeNeDota Player Draft Teams')
        .setFooter(`BeNeDota Kayzr Player Draft Team Info`)
        .setThumbnail('https://benedota.com/thumbs/assets/images/benedota_transp_crop-217x250.png')
        .setTimestamp();

    let description = '';
    results.forEach(function (result) {
        description += result.line + '\r\n';
    });

    embed.setDescription(description);

    if (args[0] === 'live') {
        message.guild.channels.get(process.env.showteamsChannel).send({embed});
    } else {
        message.channel.send({embed})
    }

    showTeams(message, args, pool);
};

exports.getTournamentInfo = function (message, args, pool) {
    let sql = `SELECT line FROM tournament_info ORDER BY line DESC`;

    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                message.channel.send(`Getting info failed, an error occurred.`);
                return;
            }

            if (!results || !results.length) {
                message.channel.send(`No players are in a team yet.`);
                return;
            }

            showTournamentInfo(message, args, pool, results);
        });
    });
};