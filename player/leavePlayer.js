const Logger = require('le_node');
const logger = new Logger({
    token: process.env.LOGENTRIES_TOKEN
});

exports.leavePlayer = function (message, args, pool) {
    let user = message.mentions.users.first();

    if (!user) {
        message.channel.send(
            `No user given to leave.`
        );

        return;
    }
    let sql = `UPDATE player SET joined = NULL WHERE playerID = ? AND joined IS NOT NULL`;

    pool.getConnection(function(error, connection) {
        connection.query({
            sql: sql,
            values: [
                user.id
            ]
        }, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                throw error;
            }

            if (results.affectedRows === 0) {
                message.channel.send(`I couldn't join ${user.username}, did the player already join or are you not *!registered*?`);
                return;
            } else {
                message.channel.send(`${user} has now left the BeNeDota Playerdraft.`);

                let kayzrPlayerRole = message.guild.roles.find(role => role.name === 'Joined Kayzr');
                message.member.removeRole(kayzrPlayerRole).catch(error => {
                    logger.err(error)
                });

            }
        });
    });

};