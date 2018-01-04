const config = require("./config.json");

const Discord = require('discord.js');
const DiscordClient = new Discord.Client();

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.CLEARDB_DATABASE_URL || 'localhost',
    user: process.env.CLEARDB_DATABASE_USER || 'playerdraft',
    password: process.env.CLEARDB_DATABASE_PASS || config.password,
    database: process.env.CLEARDB_DATABASE_NAME || 'playerdraft'
});

DiscordClient.on('ready', () => {
    connection.connect(function (error) {
        if (error) {
            console.error('Error connecting: ' + error.stack);
            throw error;
        }
    });

    connection.query(`CREATE TABLE IF NOT EXISTS player (
        playerID VARCHAR(255) NOT NULL PRIMARY KEY, 
        playername VARCHAR(255) NOT NULL,
        mmr INTEGER NOT NULL,
        preferred_position VARCHAR(2) NOT NULL,
        preferred_captain TINYINT(1) NOT NULL,
        joined TINYINT(1) NOT NULL DEFAULT 0
    )`, (error, results) => {
        if (error) {
            console.error(error.toString());
            throw error;
        }
    });

    connection.query(`CREATE TABLE IF NOT EXISTS team (
        ID INTEGER NOT NULL PRIMARY KEY,
        captain VARCHAR(255) NOT NULL,
        avg_mmr VARCHAR(7) NOT NULL
    )`, (error, result) => {
        if (error) {
            console.error(error.toString());
            throw error;
        }
    });

    connection.query(`CREATE TABLE IF NOT EXISTS team_player (
        team_ID INTEGER NOT NULL,
        player_name VARCHAR(255) NOT NULL,
        position INTEGER NOT NULL,
        PRIMARY KEY (team_ID, player_name)
    )`, (error, result) => {
        if (error) {
            console.error(error.toString());
            throw error;
        }
    });

    console.log(
        `Bot has started, with ${DiscordClient.users.size} users, in ${DiscordClient.channels.size} channels of` +
        ` ${DiscordClient.guilds.size} guilds.`
    );

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
    if (!message.content.startsWith(config.prefix)) {
        return;
    }

    if (message.author.bot) {
        return;
    }

    if (message.channel.type !== "text") {
        return;
    }

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        const m = await
        message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(DiscordClient.ping)}ms`);

        return;
    }

    if (command === "help") {
        var help = require('./bot/help');
        help.sendHelp(message, args);
        return;
    }

    if (command === "playerlist") {
        var playerlist = require('./tournament/playerlist');
        playerlist.getPlayerlist(message, args, connection);

        return;
    };

    if (command === 'register' || command === 'update') {
        var registerPlayer = require('./player/register');
        registerPlayer.register(message, args, connection);

        return;
    }

    if (command === 'join' || command === 'jointournament') {
        var joinTournament = require('./player/joinTournament');
        joinTournament.joinTournament(message, args, connection);

        return;
    }

    if (command === 'leave' || command === 'leavetournament') {
        var leaveTournament = require('./player/leaveTournament');
        leaveTournament.leaveTournament(message, args, connection);

        return;
    }

    if (command === 'exportjoinedplayers' || command === 'exportplayers') {
        if (message.member.roles.find("name", "Admin")
            || mesage.author.id === '157938886784319489'
        ) {
            var exportPlayers = require('./tournament/exportPlayers');
            exportTeams.exportTeams(message, args, connection);
        }

        return;
    }

    if (command === 'showteams') {
        if (message.member.roles.find("name", "Admin")
            || mesage.author.id === '157938886784319489'
        ) {
            var showTeams = require('./tournament/showTeams');
            showTeams.showTeams(message, args, connection);
        }

        return;
    }

    if (command === 'addteam') {
        if (message.member.roles.find("name", "Admin")
            || mesage.author.id === '157938886784319489'
        ) {
            var addTeam = require('./tournament/addTeam');
            addTeam.addTeam(message, args, connection);
        }

        return;
    }

});

DiscordClient.login(config.token);