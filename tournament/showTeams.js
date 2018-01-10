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

            showTeamInfo(message, pool, players, results);

            return;
        });
    });

    return;
}

showTeamInfo = function(message, pool, players, teams)
{
    var fs = require('fs');
    var csv = require('fast-csv');
    var options = {
        ignoreEmpty: true
    }
    var args = [];
    var i = 1;

    var embed = new Discord.RichEmbed()
        .setTitle('BeNeDota Player Draft Teams')
        .setFooter(`BeNeDota Kayzr Player Draft Team Info`)
        .setThumbnail('https://benedota.com/thumbs/assets/images/kerst_benedota_crop-225x250.png')
        .setTimestamp();

    var description = '';

    var stream = fs.createReadStream("./tmp/outfile.csv");
    csv
        .fromStream(stream, options)
        .on("data", function(data) {
            if (data[0].startsWith('There is')) {
                description += data[0].toString() + '\r\n';
            } else if (data[0].includes('People are playing')) {
                description += data[0].toString();
            } else if (data[0].startsWith('1:')) {
                stream.close();
            }
        })
        .on("end", function() {
            embed.setDescription(description);
            message.channel.send({embed});
            showPlayers(message, players, teams);
        });
}

showPlayers = function(message, players, teams) {
    var colors = [
        'ff0000',
        '00ff00',
        '0000ff',
        'ffff00',
        '00ffff',
        'ff00ff',
        'ffffff',
        '000000'
    ];
    var i = 0;

    teams.forEach(function (team) {
        var embed = new Discord.RichEmbed()
            .setColor('#' + colors[i])
            .attachFile(`./images/dota2${colors[i]}.png`)
            .setThumbnail(`attachment://dota2${colors[i]}.png`)
            .setTimestamp();

        embed.setDescription(`The captain is ${team['captain']} and the average MMR is ${team['avg_mmr']}`)
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

        message.channel.send({embed});
        i++;
    });

}