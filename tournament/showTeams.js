const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

exports.showTeams = function (message, args) {
    var sql = `SELECT * 
        FROM team_player 
        LEFT JOIN team ON team.ID = team_player.team_ID 
        LEFT JOIN player ON player.playername = team_player.player_name
        WHERE player.playerID IS NOT NULL`;

    const database = new sqlite3.Database('./db/playerdraft.db', (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    database.all(sql, [], function (err, allRows) {
        if (err) {
            console.error(err.toString());
            message.channel.send(`Getting players failed, an error occurred.`);
            database.close();
            return;
        }

        if (!allRows || !allRows.length) {
            message.channel.send(`No players joined yet.`);
            database.close();
            return;
        }

        exportPlayers(message, allRows);

        database.close();
        return allRows;
    })

    return;
}

exportPlayers = function(message, players) {
    var sql = `SELECT * FROM team`;

    const database = new sqlite3.Database('./db/playerdraft.db', (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    database.all(sql, [], function (err, allRows) {
        if (err) {
            console.error(err.toString());
            message.channel.send(`Getting players failed, an error occurred.`);
            database.close();
            return;
        }

        if (!allRows || !allRows.length) {
            message.channel.send(`No teams.`);
            database.close();
            return;
        }

        showPlayers(message, players, allRows);

        database.close();
        return allRows;
    });
}

showPlayers = function(message, players, teams) {
    teams.forEach(function (team) {
        var embed = new Discord.RichEmbed()
            .setColor('#c50003')
            .setTimestamp();

        embed.setDescription(`The captain is ${team['captain']} and the average MMR is ${team['avg_mmr']}`)
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