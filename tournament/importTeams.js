exports.importTeams = function (message, args, pool) {
    var fs = require('fs');
    var csv = require('fast-csv');
    var options = {
        ignoreEmpty: true
    }
    var args = [];
    var i = 1;

    sql = `TRUNCATE TABLE team_player;`
    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                message.channel.send(`Getting players failed, an error occurred.`);
                return;
            }

            return;
        });
    });

    var stream = fs.createReadStream("./tmp/outfile.csv");
    csv
        .fromStream(stream, options)
        .on("data", function(data) {
            if (data[0].startsWith('1:')) {
                var team_ID = i;
                var team_info = data[0].split(';');
                var captain_info = team_info.pop().split(':');
                var avg_mmr_info = team_info.pop().split(':');
                var team_players = team_info.join(';');

                if (avg_mmr_info.length > 0
                    && captain_info.length > 0) {
                    args[0] = team_ID;
                    args[1] = team_players;
                    args[2] = avg_mmr_info[1];
                    args[3] = captain_info[1];

                    var addTeam = require('./addTeam');
                    addTeam.addTeam(this.message, args, this.pool);
                }
                i++;
            }
        }.bind({
            pool: pool,
            message: message
        }))
        .on("end", function() {});

    return;
}