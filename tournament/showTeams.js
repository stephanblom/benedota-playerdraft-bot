const config = require('config');
const Discord = require('discord.js');

exports.showTeams = function (message, args, pool) {
    var sql = `SELECT * 
        FROM team_player 
        LEFT JOIN team ON team.ID = team_player.team_ID 
        LEFT JOIN player ON player.playername = team_player.player_name
        WHERE player.playername IS NOT NULL
        ORDER BY team_player.team_ID, team_player.position ASC`;

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

            return;
        });
    });

    return;
}

exportTeams = function(message, args, pool, players) {
    var sql = `SELECT * FROM team ORDER BY ID`;

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

            showTeamInfo(message, args, pool, players, results);
            return;
        });
    });

    return;
}

showTeamInfo = function(message, args, pool, players, teams)
{
    var fs = require('fs');
    var csv = require('fast-csv');
    var options = {
        ignoreEmpty: true
    }
    var i = 1;

    var embed = new Discord.RichEmbed()
        .setTitle('BeNeDota Player Draft Teams')
        .setFooter(`BeNeDota Kayzr Player Draft Team Info`)
        .setThumbnail('https://benedota.com/thumbs/assets/images/benedota_transp_crop-217x250.png')
        .setTimestamp();

    var description = '';

    var stream = fs.createReadStream("/tmp/outfile.csv");
    csv
        .fromStream(stream, options)
        .on("data", function(data) {
            if (data[0].startsWith('There is')) {
                description += data[0].toString() + '\r\n';
            } else if (data[0].includes('People are playing')) {
                description += data[0].toString();
            } else if (data[0].startsWith('1:') || data[0].startsWith('Captain:')) {
                stream.close();
            }
        })
        .on("end", function() {
            embed.setDescription(description);

            if (args[0] == 'live') {
                message.guild.channels.get(config.get('showteamsChannel')).send({embed});
            } else {
                message.channel.send({embed})
            }

            showPlayers(message, this.args, players, teams);
        }.bind({
            args: args
        }));
}

showPlayers = function (message, args, players, teams) {
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
    var i = 0;

    teams.forEach(function (team) {
        var embed = new Discord.RichEmbed()
            .setColor('#' + colors[i])
            .attachFile(`./images/dota2${colors[i]}.png`)
            .setThumbnail(`attachment://dota2${colors[i]}.png`)
            .setTimestamp();

        embed.setDescription(`The captain is ${team['captain']} and the average MMR is ${team['avg_mmr']}.`)
            .setTitle(`Team ${team['ID']}`)
            .setFooter(`BeNeDota Kayzr Player Draft Team ${team['ID']}`);

        players.forEach(function (player) {
            if (player['team_ID'] == team['ID']) {
                embed.addField(
                    `${player['position']}. ${player['playername']}`,
                    `Preferred role: ${player['preferred_position']}, Preferred captain: ${player['preferred_captain'] == 1 ? 'Yes' : 'No'}`
                );
            }
        });

        if (args[0] == 'live') {
            message.guild.channels.get(config.get('showteamsChannel')).send({embed});
        } else {
            message.channel.send({embed})
        }
        i++;
    });

}