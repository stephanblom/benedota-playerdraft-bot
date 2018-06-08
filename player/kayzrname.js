exports.setName = function (message, args, pool) {
    var [...kayzrname] = args;
    kayzrname = kayzrname.join(' ');

    if (!kayzrname) {
        message.channel.send(`${message.author}, no name given!`);
        return;
    }

    var sql = '';
    var values = [];
    if (kayzrname === 'clear') {
        sql = `UPDATE player SET kayzrname = '' WHERE playerID = ?`;
        values = [
            message.author.id
        ];
    } else {
        sql = `UPDATE player SET kayzrname = ? WHERE playerID = ?`;
        values = [
            message.author.id,
            kayzrname
        ]
    }

    pool.getConnection(function(error, connection) {
        connection.query({
            sql: sql,
            values: values
        }, function(error, results) {
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