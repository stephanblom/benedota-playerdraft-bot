const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

const client = new Discord.Client();
const db = new sqlite3.Database('./db/playerdraft.db', (err) => {
    if (err) {
        console.error(err.message);
    }
});

const config = require("./config.json");

client.on('ready', () => {
    db.run(`CREATE TABLE IF NOT EXISTS player (
        playerID TEXT NOT NULL PRIMARY KEY, 
        playername TEXT NOT NULL,
        mmr INTEGER NOT NULL,
        preferred_position TEXT NOT NULL,
        preferred_captain TEXT NOT NULL,
        joined INTEGER NOT NULL DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS team (
        ID INTEGER NOT NULL PRIMARY KEY,
        captain TEXT NOT NULL,
        avg_mmr TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS team_player (
        team_ID INTEGER NOT NULL,
        player_name TEXT NOT NULL,
        position INTEGER NOT NULL,
        PRIMARY KEY (team_ID, player_name)
    )`);

    console.log(
        `Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of` +
        ` ${client.guilds.size} guilds.`
    );

    client.user.setGame(`BeNeDota PlayerDraft`);4
});

client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on('message', async message =>
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
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);

        return;
    }

    if (command === "help") {
        var help = require('./bot/help');
        help.sendHelp(message, args);
        return;
    }

    if (command === "playerlist") {
        var playerlist = require('./tournament/playerlist');
        playerlist.getPlayerlist(message, args);

        return;
    };

    if (command === 'register' || command === 'update') {
        var registerPlayer = require('./player/register');
        registerPlayer.register(message, args);

        return;
    }

    if (command === 'join' || command === 'jointournament') {
        var joinTournament = require('./player/joinTournament');
        joinTournament.joinTournament(message, args);

        return;
    }

    if (command === 'leave' || command === 'leavetournament') {
        var leaveTournament = require('./player/leaveTournament');
        leaveTournament.leaveTournament(message, args);

        return;
    }

    if (command === 'exportjoinedplayers' || command === 'exportplayers') {
        if (message.member.roles.find("name", "Admin")
            || mesage.author.id === '157938886784319489'
        ) {
            var exportPlayers = require('./tournament/exportPlayers');
            exportPlayers.exportPlayers(message, args);
        }

        return;
    }

    if (command === 'showteams') {
        if (message.member.roles.find("name", "Admin")
            || mesage.author.id === '157938886784319489'
        ) {
            var showTeams = require('./tournament/showTeams');
            showTeams.showTeams(message, args);
        }

        return;
    }

    if (command === 'addteam') {
        if (message.member.roles.find("name", "Admin")
            || mesage.author.id === '157938886784319489'
        ) {
            var addTeam = require('./tournament/addTeam');
            addTeam.addTeam(message, args);
        }

        return;
    }

});

client.login(config.token);