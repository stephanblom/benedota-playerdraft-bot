const Discord = require('discord.js');

exports.getPlayerlist = function (message, args, pool) {
    var sql = `SELECT * 
        FROM player 
        WHERE joined IS NOT NULL
        AND joined != '0000-00-00 00:00:00'
        ORDER BY joined ASC`;
    pool.getConnection(function(error, connection) {
        connection.query(sql, function (error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                message.channel.send(`Getting players failed, an error occurred.`);
                return;
            }

            if (!results || !results.length) {
                message.channel.send(`No players joined yet.`);
                return;
            }

            addPlayersToList(message, results);
        });
    });

};

const addPlayersToList = function(message, allrows) {
    let description = '';
    let players = '';
    let i = 1;

    const embed = new Discord.RichEmbed()
        .setTitle('BeNeDota Player Draft Teams')
        .setFooter(`BeNeDota Kayzr Player Draft Team Info`)
        .setThumbnail('https://benedota.com/thumbs/assets/images/benedota_transp_crop-217x250.png')
        .setTimestamp();

    allrows.forEach(function (player) {
        players += `- ${player['playername']} \n`;
        i++;
    });

    if (allrows.length < 10) {
        embed.setColor('#ff0000');
    } else {
        embed.setColor('#00ff00');
    }

    if (allrows.length === 1) {
        description = `1 player has joined so far. There are not enough players for a tournament yet!`;
    } else if (allrows.length > 1 && allrows.length < 10) {
        description = `${allrows.length} players have joined so far. There are not enough players for a tournament yet!`;
    } else {
        description = `${allrows.length} players have joined so far.`;
    }

    embed.setDescription(description);
    embed.addField('Players', players);
    message.channel.send({embed});
};