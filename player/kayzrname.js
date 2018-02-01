exports.setName = function (message, args, pool) {
    if (args.length != 1) {
        message.channel.send(`${message.author}, wrong amount of parameters given, only 1 (the name) is needed!`);
        return;
    }

    var kayzrname = args[0];

    if (!kayzrname) {
        message.channel.send(`${message.author}, no name given!`);
        return;
    }

    var sql = `UPDATE player SET kayzrname = ? WHERE playerID = '${message.author.id}'`;
    pool.getConnection(function(error, connection) {
        connection.query(sql, [kayzrname], function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                throw error;
            }

            message.channel.send(`${message.author}, your name has been updated to ${kayzrname}!`);
            return;
        });
    });

    return;
}