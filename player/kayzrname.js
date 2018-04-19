exports.setName = function (message, args, pool) {
    var [...kayzrname] = args;
    kayzrname = kayzrname.join(' ');
    console.log(kayzrname);

    if (!kayzrname) {
        message.channel.send(`${message.author}, no name given!`);
        return;
    }

    var sql = '';
    if (kayzrname === 'clear') {
        sql = `UPDATE player SET kayzrname = '' WHERE playerID = ?`
    } else {
        sql = `UPDATE player SET kayzrname = ? WHERE playerID = ?`;
    }

    pool.getConnection(function(error, connection) {
        connection.query({
            sql: sql,
            values: [
                message.author.id
            ]
        }, [kayzrname], function(error, results) {
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