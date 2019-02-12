const Logger = require('le_node');
const logger = new Logger({
    token: process.env.LOGENTRIES_TOKEN
});

exports.leaveTournament = function (message, args, pool) {
    let sql = `UPDATE player SET joined = NULL WHERE playerID = ? AND joined IS NOT NULL`;

    pool.getConnection(function(error, connection) {
        connection.query({
            sql: sql,
            values: [
                message.author.id
            ]
        }, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
            }

            if (this.changes === 0) {
                message.channel.send(`${message.author}, I couldn't leave you, have you joined before, or are you not *!registered*?`);
            } else {
                message.channel.send(`${message.author}, you have now left the BeNeDota Playerdraft.`);

                let kayzrPlayerRole = message.guild.roles.find(role => role.name === 'Joined Kayzr');
                message.member.removeRole(kayzrPlayerRole).catch(error => {
                    logger.err(error)
                });
            }
        });
    });
};