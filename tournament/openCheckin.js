exports.openCheckinMessage = function (message, args) {
    let kayzrPlayerRole = message.guild.roles.find(role => role.name === 'Joined Kayzr');
    let messageToSend = `${kayzrPlayerRole} | De checkin is nu open! Head for https://www.kayzr.com, accept your team invite, and check in at the tournament.`;

    if (args[0] === 'live') {
        message.guild.channels.get(process.env.showteamsChannel).send(messageToSend);
    } else {
        message.channel.send(messageToSend);
    }
};

exports.openCheckinSchedule = function (guild, channel) {
    let kayzrPlayerRole = guild.roles.find(role => role.name === 'Joined Kayzr');
    let messageToSend = `${kayzrPlayerRole} | Don't forget to check in! Head for https://www.kayzr.com, accept your team invite, and check in at the tournament.`;

    channel.send(messageToSend);
};

exports.openCheckinReminderSchedule = function (guild, channel) {
    let kayzrPlayerRole = guild.roles.find(role => role.name === 'Kayzr Players');
    let messageToSend = `${kayzrPlayerRole} | Tomorrow will be another Kayzr! Don't forget to sign up.`;

    channel.send(messageToSend);
};