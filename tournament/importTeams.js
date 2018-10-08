const addTeam = require('./addTeam');

const readCsv = function(message, args, pool)
{
    const fs = require('fs');
    const csv = require('fast-csv');
    const options = {
        ignoreEmpty: true
    };
    let i = 1;

    const stream = fs.createReadStream("/tmp/outfile.csv");
    csv
        .fromStream(stream, options)
        .on("data", function(data) {
            let team_players;
            let avg_mmr_info;
            let captain_info;
            let team_info;
            let team_ID;

            if (data[0].startsWith('Captain:')) {
                team_ID = i;
                team_info = data[0].split(';');
                captain_info = team_info.shift().split(':');
                avg_mmr_info = team_info.pop().split(':');
                team_players = team_info.join(';');

                if (avg_mmr_info.length > 0
                    && captain_info.length > 0) {
                    args[0] = team_ID;
                    args[1] = team_players;
                    args[2] = avg_mmr_info[1];
                    args[3] = captain_info[1];

                    addTeam.addTeam(this.message, args, this.pool);
                }
                i++;
            } else if (data[0].startsWith('1:')) {
                team_ID = i;
                team_info = data[0].split(';');
                captain_info = team_info.pop().split(':');
                avg_mmr_info = team_info.pop().split(':');
                team_players = team_info.join(';');

                if (avg_mmr_info.length > 0
                    && captain_info.length > 0) {
                    args[0] = team_ID;
                    args[1] = team_players;
                    args[2] = avg_mmr_info[1];
                    args[3] = captain_info[1];

                    addTeam.addTeam(this.message, args, this.pool);
                }
                i++;
            } else if (data[0] !== '' && !data[0].startsWith('Team')) {
                let sql = `INSERT INTO tournament_info (ID, line) VALUES (NULL, ${pool.escape(data[0])})`;
                pool.getConnection(function(error, connection) {
                    connection.query(sql, function(error, results) {
                        connection.release();

                        if (error) {
                            console.error(error.toString());
                            message.channel.send(`Entering info to DB failed.`);
                        }
                    });
                });
            }
        }.bind({
            pool: pool,
            message: message
        }))
        .on("end", function() {
            message.channel.send(`Importing ${i - 1} teams.`);
        });

};
const truncateTeams = function(message, args, pool)
{
    let sql = `TRUNCATE TABLE team;`;
    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                message.channel.send(`Truncating team table failed, an error occurred.`);
            }
        });

        readCsv(message, args, pool);
    });
};

const truncateTournamentInfo = function (message, args, pool) {
    let sql = `TRUNCATE TABLE tournament_info;`;
    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                message.channel.send(`Getting players failed, an error occurred.`);
            }
        });

        truncateTeams(message, args, pool);
    });
};

exports.importTeams = function (message, args, pool) {
    let sql = `TRUNCATE TABLE team_player;`;
    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                message.channel.send(`Getting players failed, an error occurred.`);
            }
        });

        truncateTournamentInfo(message, args, pool);
    });
};