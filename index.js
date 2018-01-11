const newrelic = require('newrelic');
const config = require('config');

const Logger = require('le_node');
const logger = new Logger({
    token: process.env.LOGENTRIES_TOKEN || config.get('logentries_token')
});

const Discord = require('discord.js');
const DiscordClient = new Discord.Client();

const mysql = require('mysql');
const pool = mysql.createPool(process.env.CLEARDB_DATABASE_URL || {
    host: process.env.CLEARDB_DATABASE_URL || config.get('database.host'),
    user: process.env.CLEARDB_DATABASE_USER || config.get('database.user'),
    password: process.env.CLEARDB_DATABASE_PASS || config.get('database.password'),
    database: process.env.CLEARDB_DATABASE_NAME || config.get('database.database'),
});


DiscordClient.on('ready', function() {
    pool.getConnection(function(error, connection) {
        connection.query(`CREATE TABLE IF NOT EXISTS player (
            playerID VARCHAR(255) NOT NULL PRIMARY KEY, 
            playername VARCHAR(255) NOT NULL,
            mmr INTEGER NOT NULL,
            preferred_position VARCHAR(3) NOT NULL,
            preferred_captain TINYINT(1) NOT NULL,
            joined datetime DEFAULT NULL
        )`, function (error, results, fields) {
            connection.release();

            if (error) {
                logger.err(error.toString());
                console.error(error.toString());
                throw error;
            }

            if (results.length > 0 ) {
                logger.info("Database 'player' created.");
            }
        });
    });

    pool.getConnection(function(error, connection) {
        connection.query(`CREATE TABLE IF NOT EXISTS team (
            ID INTEGER NOT NULL PRIMARY KEY,
            captain VARCHAR(255) NOT NULL,
            avg_mmr VARCHAR(7) NOT NULL
        )`, function (error, result) {
            connection.release();

            if (error) {
                logger.err(error.toString());
                console.error(error.toString());
                throw error;
            }

            if (result.length > 0 ) {
                logger.info("Database 'team' created.");
            }
        });
    });

    pool.getConnection(function(error, connection) {
        connection.query(`CREATE TABLE IF NOT EXISTS team_player (
            team_ID INTEGER NOT NULL,
            player_name VARCHAR(255) NOT NULL,
            position INTEGER NOT NULL,
            PRIMARY KEY (team_ID, player_name)
        )`, (error, result) => {
            connection.release();

            if (error) {
                logger.err(error.toString());
                console.error(error.toString());
                throw error;
            }

            if (result.length > 0 ) {
                logger.info("Database 'team_player' created.");
            }
        });
    });

    console.log(
        `Bot has started, with ${DiscordClient.users.size} users, in ${DiscordClient.channels.size} channels of` +
        ` ${DiscordClient.guilds.size} guilds.`
    );
    logger.info(
        `Bot has started, with ${DiscordClient.users.size} users, in ${DiscordClient.channels.size} channels of` +
        ` ${DiscordClient.guilds.size} guilds.`
    )

    DiscordClient.user.setGame(`BeNeDota PlayerDraft`);
});

DiscordClient.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

DiscordClient.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

DiscordClient.on('message', async message =>
{
    if (!message.content.startsWith(config.get('prefix'))) {
        return;
    }

    if (message.author.bot) {
        return;
    }

    if (message.channel.type !== "text") {
        return;
    }

    const args = message.content.slice(config.get('prefix').length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    logger.debug('Received message: ' + command + ' with the arguments: ' + args.join(', '));

    if (command === "ping") {
        if (message.member.roles.find("name", "Admin")
            || message.author.id === '157938886784319489'
        ) {
            const m = await
            message.channel.send("Ping?");
            m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(DiscordClient.ping)}ms`)
                .then(msg => {
                    msg.delete(5000);
                    message.delete(5000);
                });

            return;
        }

        return;
    }

    if (command === "help") {
        var help = require('./bot/help');
        help.sendHelp(message, args);
        return;
    }

    if (command === "playerlist") {
        newrelic.startBackgroundTransaction('register', [], function () {
            newrelic.getTransaction();

            var playerlist = require('./tournament/playerlist');
            playerlist.getPlayerlist(message, args, pool);

            newrelic.endTransaction();
            return;
        });

        return;
    };

    if (command === 'register' || command === 'update') {
        newrelic.startBackgroundTransaction('register', [], function () {
            newrelic.getTransaction();

            var registerPlayer = require('./player/register');
            registerPlayer.register(message, args, pool);

            logger.info(`Player ${message.author.username} registered. `);

            newrelic.endTransaction();
            return;
        });

        return;
    }

    if (command === 'join' || command === 'jointournament') {
        newrelic.startBackgroundTransaction('join', [], function () {
            newrelic.getTransaction();
            var joinTournament = require('./player/joinTournament');
            joinTournament.joinTournament(message, args, pool);

            newrelic.endTransaction();
            return;
        });

        return;
    }

    if (command === 'leave' || command === 'leavetournament') {
        newrelic.startBackgroundTransaction('leave', [], function () {
            newrelic.getTransaction();
            var leaveTournament = require('./player/leaveTournament');
            leaveTournament.leaveTournament(message, args, pool);

            newrelic.endTransaction();
            return;
        });

        return;
    }

    if (command === 'exportjoinedplayers' || command === 'exportplayers') {
        if (message.member.roles.find("name", "Admin")
            || message.author.id === '157938886784319489'
        ) {
            newrelic.startBackgroundTransaction('exportjoinedplayers', [], function () {
                newrelic.getTransaction();

                var exportPlayers = require('./tournament/exportPlayers');
                exportPlayers.exportPlayers(message, args, pool);

                newrelic.endTransaction();
                return;
            });
        } else {
            message.channel.send("Not allowed.");
            return;
        }

        return;
    }

    if (command === 'showteams') {
        if (message.member.roles.find("name", "Admin")
            || message.author.id === '157938886784319489'
        ) {
            newrelic.startBackgroundTransaction('showteams', [], function () {
                newrelic.getTransaction();

                var showTeams = require('./tournament/showTeams');
                showTeams.showTeams(message, args, pool);

                newrelic.endTransaction();
                return;
            });
        } else {
            message.channel.send("You! Shall not! Pass!");
        }

        return;
    }

    if (command === 'addteam') {
        if (message.member.roles.find("name", "Admin")
            || message.author.id === '157938886784319489'
        ) {
            newrelic.startBackgroundTransaction('addteam', [], function () {
                newrelic.getTransaction();

                var addTeam = require('./tournament/addTeam');
                addTeam.addTeam(message, args, pool);

                newrelic.endTransaction();
                return;
            });
        } else {
            message.channel.send("No.");
        }

        return;
    }

    if (command === 'registerplayer') {
        if (message.member.roles.find("name", "Admin")
            || message.author.id === '157938886784319489'
        ) {
            newrelic.startBackgroundTransaction('registerplayer', [], function () {
                newrelic.getTransaction();

                var registerPlayer = require('./player/registerPlayer');
                registerPlayer.registerPlayer(message, args, pool);

                newrelic.endTransaction();
                return;
            });
        } else {
            message.channel.send("Nope. ");
        }

        return;
    }

    if (command === 'joinplayer') {
        if (message.member.roles.find("name", "Admin")
            || message.author.id === '157938886784319489'
        ) {
            newrelic.startBackgroundTransaction('joinplayer', [], function () {
                newrelic.getTransaction();

                var joinPlayer = require('./player/joinPlayer');
                joinPlayer.joinPlayer(message, args, pool);

                newrelic.endTransaction();
                return;
            });
        } else {
            message.channel.send("Nope. ");
        }

        return;
    }

    if (command === 'leavePlayer') {
        if (message.member.roles.find("name", "Admin")
            || message.author.id === '157938886784319489'
        ) {
            newrelic.startBackgroundTransaction('joinplayer', [], function () {
                newrelic.getTransaction();

                var leavePlayer = require('./player/leavePlayer');
                leavePlayer.leavePlayer(message, args, pool);

                newrelic.endTransaction();
                return;
            });
        } else {
            message.channel.send("Nope. ");
        }

        return;
    }

    if (command === 'createteams') {
        if (message.member.roles.find("name", "Admin")
            || message.author.id === '157938886784319489'
        ) {
            newrelic.startBackgroundTransaction('createTeams', [], function () {
                newrelic.getTransaction();

                var createTeams = require('./tournament/createTeams');
                createTeams.createTeams(message, args, pool);

                newrelic.endTransaction();
                return;
            });
        } else {
            message.channel.send("Nope. ");
        }

        return;
    }

    if (command === 'importteams') {
        if (message.member.roles.find("name", "Admin")
            || message.author.id === '157938886784319489'
        ) {
            newrelic.startBackgroundTransaction('importTeams', [], function () {
                newrelic.getTransaction();

                var importTeams = require('./tournament/importTeams');
                importTeams.importTeams(message, args, pool);

                newrelic.endTransaction();
                return;
            });
        } else {
            message.channel.send("Nope. ");
        }

        return;
    }
});

DiscordClient.login(config.get('token'));