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
        positions TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS tournament (
        ID INTEGER NOT NULL PRIMARY KEY,
        name TEXT NOT NULL,
        date DATETIME NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS tournament_player (
        tournamentID INTEGER NOT NULL,
        playerID TEXT NOT NULL,
        FOREIGN KEY(tournamentID) REFERENCES tournament(ID),
        FOREIGN KEY(playerID) REFERENCES player(ID),
        PRIMARY KEY(tournamentID, playerID)
    )`);

    console.log(
        `Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of` +
        ` ${client.guilds.size} guilds.`
    );
    client.user.setGame(`PlayerDraft on ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setGame(`on ${client.guilds.size} servers`);
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

    if (command === 'register') {
        var registerPlayer = require('./player/register');
        registerPlayer.register(message, args);

        return;
    }

    if (command === 'createtournament') {
        if (message.member.roles.find('name', 'Admin') || message.member.roles.find('name', 'Staff')) {
            var createTournament = require('./tournament/createTournament.js');
            createTournament.createTournament(message, args);
        } else {
            message.channel.send(`${message.author}, you have no access to this command. `);
        }

        return;
    }

    if (command === 'nexttournament') {
        var nextTournament = require('./tournament/nextTournament');
        nextTournament.showTournament(message, args);

        return;
    }

    if (command === 'join' || command === 'jointournament') {
        var joinTournament = require('./player/joinTournament');
        joinTournament.joinTournament(message, args);

        return;
    }

});

client.login(config.token);