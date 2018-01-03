const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

exports.showTournament = function (message, args) {
    var database = new sqlite3.Database('./db/playerdraft.db', (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    database.serialize(function () {
        var sql = `SELECT * FROM tournament`;

        database.get(sql, [], function (err, row) {
            if (err) {
                console.error(err.toString());
                message.channel.send(`Creating tournament, an error occurred.`);
                return;
            }

            var moment = require('moment');
            embed = new Discord.RichEmbed()
                .setTitle("Next tournament")
                .setColor([255, 255, 0])
                .setDescription("The next tournament you can `!join` for is:")
                .setFooter("I'm just a bot")
                .setTimestamp()
                .addField(
                    `${row.name}`,
                    moment(row.date).format('LLL')
                )
                .addField(`Join`, `Type \`!join ${row.ID}\` to join this tournament`);
            message.channel.send({embed});

            return;
        });
    });

    return;
}
