exports.setName = function (message, args, pool) {
    var [...kayzrname] = args;
    kayzrname = kayzrname.join(' ');
    console.log(kayzrname);

    if (!kayzrname) {
        message.channel.send(`${message.author}, no name given!`);
        return;
    }

    if (kayzrname === 'clear') {
        var sql = `UPDATE player SET kayzrname = '' WHERE playerID = '${message.author.id}'`
    } else {
        var sql = `UPDATE player SET kayzrname = ? WHERE playerID = '${message.author.id}'`;
    }

    pool.getConnection(function(error, connection) {
        connection.query(sql, [kayzrname], function(error, results) {
            connection.release();

            if (error) {
                console.error(error.toString());
                throw error;
            }

            if (kayzrname === 'clear') {
                message.channel.send(`${message.author}, your kayzrname has been unset!`);
            } else {
                message.channel.send(`${message.author}, your kayzrname has been updated to ${kayzrname}!`);
            }
            return;
        });
    });

    return;
}