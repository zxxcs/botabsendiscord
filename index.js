require('dotenv').config();
const mysql = require('mysql');
const { Client, Intents } = require('discord.js');

const COMMAND = require('./command');

const con = mysql.createConnection({
    host: process.env.HOSTDB,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DBNAME

})

let role = null;
let mulai = false;
// con.connect(function(err) {
//     if (err) throw err;
//     con.query("SELECT * FROM siswa", function (err, result, fields) {
//         if (err) throw err;
//         console.log(result);
//     });
// });


const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!\n==================================`);
});

client.on('messageCreate', async (msg) => {

    const rawinput = msg.content.toLowerCase();
    switch (rawinput) {

        case COMMAND.command(COMMAND.absen):
            if (!mulai){
                await msg.channel.send(`Belum waktunya absen`);
                break;

            }
            await msg.channel.send('nyoh');
            break;


        case COMMAND.command(COMMAND.start):

            myRole = msg.guild.roles.cache.find(roles=>roles.name==='owner').id;

            role = msg.guild.members.cache.find(members=>members.id === msg.author.id)._roles;
            // console.log(role);

            if (role.includes(myRole)) {
                if (!mulai){
                    await msg.channel.send('silahkan melakukan absen');
                    mulai = true;
                    break;
                }
            }

            await msg.channel.send('anda bukan admin');
            break;

        case COMMAND.command(COMMAND.stop):

            myRole = msg.guild.roles.cache.find(roles=>roles.name==='owner').id;

            role = msg.guild.members.cache.find(members=>members.id === msg.author.id)._roles;
            // console.log(role);

            if (role.includes(myRole)) {
                if (mulai) {
                    await msg.channel.send('absen telah ditutup');
                    mulai = false;
                    break;
                }
            }
            await msg.channel.send('anda bukan admin');
            break;
    }

});



client.login(process.env.TOKEN);

