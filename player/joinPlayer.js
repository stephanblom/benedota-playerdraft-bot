exports.joinPlayer = function (message, args, pool) {
    var userId = args[0].replace(/['"]+/g, '');
    var members = message.guild.members.array();
    var guildMember = members.find(function(object) { return object.user.username == `userId`; });
    if (guildMember && guildMember.user) {
        var user = guildMember.user;
    } else {
        message.channel.send(
            `Joining ${userId} failed, user not found.`
        );
        return;
    }

    var sql = `UPDATE player SET joined = NOW() WHERE playerID = '${user.id}' AND joined IS NULL`;

    pool.getConnection(function(error, connection) {
        connection.query(sql, function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                throw error;
            }

            if (results.affectedRows === 0) {
                message.channel.send(`I couldn't join the player, did the player already join or are you not *!registered*?`);
                return;
            } else {
                message.channel.send(`${user} has now joined the BeNeDota Playerdraft!`);
                return;
            }
        });
    });

    return;
}