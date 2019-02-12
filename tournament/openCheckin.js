exports.openCheckin = function (message, args) {
    let kayzrPlayerRole = message.guild.roles.find(role => role.name === 'Joined Kayzr');
    let messageToSend = `${kayzrPlayerRole} | De checkin is nu open! Head for https://www.kayzr.com and accept your team invite, and checkin at the tournament.`;

    if (args[0] === 'live') {
        message.guild.channels.get(process.env.showteamsChannel).send(messageToSend);
    } else {
        message.channel.send(messageToSend);
    }
};