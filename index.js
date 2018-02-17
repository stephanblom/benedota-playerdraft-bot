var Logger = require('le_node');
var log = new Logger({
    token:process.env.LOGENTRIES_TOKEN
});

const Discord = require('discord.js');
const DiscordClient = new Discord.Client();

const mysql = require('mysql');
const pool = mysql.createPool(process.env.CLEARDB_DATABASE_URL || {
    host: process.env.CLEARDB_DATABASE_HOST,
    user: process.env.CLEARDB_DATABASE_USER,
    password: process.env.CLEARDB_DATABASE_PASS,
    database: process.env.CLEARDB_DATABASE_NAME,
});

DiscordClient.on('ready', function() {
    pool.getConnection(function(error, connection) {
        connection.query(`CREATE TABLE IF NOT EXISTS player (
            playerID BIGINT(255) NOT NULL PRIMARY KEY,
            playername VARCHAR(255) NOT NULL,
            kayzrname VARCHAR(255) NOT NULL DEFAULT '',
            mmr INTEGER NOT NULL,
            preferred_position VARCHAR(3) NOT NULL,
            preferred_captain TINYINT(1) NOT NULL,
            joined datetime DEFAULT NULL
        )`, function (error, results, fields) {
            connection.release();

            if (error) {
                log.err(error.toString());
                console.error(error.toString());
                throw error;
            }

            if (results.length > 0 ) {
                log.info("Database 'player' created.");
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
                log.err(error.toString());
                console.error(error.toString());
                throw error;
            }

            if (result.length > 0 ) {
                log.info("Database 'team' created.");
            }
        });
    });

    pool.getConnection(function(error, connection) {
        connection.query(`CREATE TABLE IF NOT EXISTS team_player (
            teamID INTEGER NOT NULL,
            playerID VARCHAR(255) NOT NULL,
            position INTEGER NOT NULL,
            PRIMARY KEY (teamID, playerID)
        )`, (error, result) => {
            connection.release();

            if (error) {
                log.err(error.toString());
                console.error(error.toString());
                throw error;
            }

            if (result.length > 0 ) {
                log.info("Database 'team_player' created.");
            }
        });
    });

    console.log(
        `Bot has started, with ${DiscordClient.users.size} users, in ${DiscordClient.channels.size} channels of` +
        ` ${DiscordClient.guilds.size} guilds.`
    );
    log.info(
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
    if (!message.content.startsWith(process.env.botprefix)) {
        return;
    }

    if (message.author.bot) {
        return;
    }

    if (message.channel.type !== "text") {
        return;
    }

    const args = message.content.slice(process.env.botprefix.length).trim().match(/(?:[^\s"]+|"[^"]*")+/g);
    const command = args.shift().toLowerCase();

    if (!command) {
        return;
    }

    log.debug(`Received command ${command} message from ${message.author.username} with the arguments ${args.join(', ')}`);

    if (command === "help") {
        var help = require('./bot/help');
        help.sendHelp(message, args);
    }

    if (command === "playerlist") {
        var playerlist = require('./tournament/playerlist');
        playerlist.getPlayerlist(message, args, pool);
    };

    if (command === 'register' || command === 'update') {
        var registerPlayer = require('./player/register');
        registerPlayer.register(message, args, pool);
    }

    if (command === 'join' || command === 'jointournament') {
        var joinTournament = require('./player/joinTournament');
        joinTournament.joinTournament(message, args, pool);
    }

    if (command === 'leave' || command === 'leavetournament') {
        var leaveTournament = require('./player/leaveTournament');
        leaveTournament.leaveTournament(message, args, pool);
    }

    if (command === 'status') {
        if ((message.member.roles.find("name", "Admin")
            || message.author.id === '157938886784319489')
            && message.mentions.users.first()
        ) {
            var otherPlayerstatus = require('./player/otherPlayerstatus');
            otherPlayerstatus.otherPlayerstatus(message, args, pool);
        } else {
            var playerstatus = require('./player/playerstatus');
            playerstatus.playerstatus(message, args, pool);
        }
    }

    if (command === 'kayzrname') {
        var kayzrname = require('./player/kayzrname.js');
        kayzrname.setName(message, args, pool);
    }

    if (
        message.member.roles.find("name", "Admin")
        || message.member.roles.find("name", "Staff")
        || message.author.id === '157938886784319489'
    ) {
        if (command === "ping") {
            const m = await
                message.channel.send("Ping?");
            m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(DiscordClient.ping)}ms`)
                .then(msg => {
                    msg.delete(5000);
                    message.delete(5000);
                });

            return;
        }

        if (command === 'exportjoinedplayers' || command === 'exportplayers') {
            var exportPlayers = require('./tournament/exportPlayers');
            exportPlayers.exportPlayers(message, args, pool);
        }

        if (command === 'showteams') {
            var showTeams = require('./tournament/showTeams');
            showTeams.showTeams(message, args, pool);

            return;
        }

        if (command === 'registerplayer') {
            var registerPlayer = require('./player/registerPlayer');
            registerPlayer.registerPlayer(message, args, pool);
        }

        if (command === 'joinplayer') {
            var joinPlayer = require('./player/joinPlayer');
            joinPlayer.joinPlayer(message, args, pool);
        }

        if (command === 'leaveplayer') {
            var leavePlayer = require('./player/leavePlayer');
            leavePlayer.leavePlayer(message, args, pool);
        }

        if (command === 'endtournament') {
            var endTournament = require('./tournament/endTournament.js');
            endTournament.endTournament(message, args, pool);
        }

        if (command === 'showwinningteam') {
            var showWinningTeam = require('./tournament/showWinningTeam.js');
            showWinningTeam.showWinningTeam(message, args, pool);
        }
    }


    if (
        message.channel.id == process.env.onlyDeleteMessagesInChannel
    ) {
        message.channel.fetchMessages({limit: 100})
            .then(messages => {
                setTimeout(bulkDeleteChat, 60000, message, messages);
            });
    }

});

DiscordClient.login(process.env.DISCORD_TOKEN);

function bulkDeleteChat(message, messages)
{
    message.channel.bulkDelete(messages);
}