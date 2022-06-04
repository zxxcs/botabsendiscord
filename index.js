require('dotenv').config();
const mysql = require('mysql');
const { Client, Intents, Formatters } = require('discord.js');

const COMMAND = require('./command');



let role = null;
let mulai = false;

// con.connect(function(err) {
//     if (err) throw err;
//     con.query("SELECT * FROM siswa", function (err, result, fields) {
//         if (err) throw err;
//         console.log(result);
//     });
// });

function insertSiswa(siswa){
    const con = mysql.createConnection({
        host: process.env.HOSTDB,
        user: process.env.USER,
        password: process.env.PASS,
        database: process.env.DBNAME

    })
    return new Promise((resolve, reject) => {
        con.connect();
        con.query("insert into siswa (Nama, NIM) values (? , ?)",siswa,(err, res, sol) => {
            if (err) reject(err);
            resolve(res);
        })
        con.end();
    })
}


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
            callerName = msg.guild.members.cache.find(member => member.id === msg.author.id).displayName;
            callerName = callerName.split('-').map(res => res.trim());
            try {
                await insertSiswa(callerName)

            }catch (e) {
                await msg.channel.send('Anda sudah register');
            }
            console.log(callerName);
            await msg.channel.send(`Terima kasih anda sudah absen! ${Formatters.userMention(msg.author.id)}`);
            break;


        case COMMAND.command(COMMAND.start):

            myRole = msg.guild.roles.cache.find(role => role.name === 'owner');
            isAdmin = msg.guild.members.cache.find(member => member.id === msg.author.id)
                .roles.cache.some(value => value.id === myRole.id);
            // console.log(role);

            if (isAdmin) {
                if (!mulai){
                    await msg.channel.send('silahkan melakukan absen');
                    mulai = true;
                    break;
                }
            }

            await msg.channel.send('anda bukan admin');
            break;

        case COMMAND.command(COMMAND.stop):

            myRole = msg.guild.roles.cache.find(role => role.name === 'owner');
            isAdmin = msg.guild.members.cache.find(member => member.id === msg.author.id)
                .roles.cache.some(value => value.id === myRole.id);
            // console.log(role);

            if (isAdmin) {
                if (mulai) {
                    await msg.channel.send('absen telah ditutup');
                    mulai = false;
                    break;
                }
            }
            await msg.channel.send('anda bukan admin');
            break;

    case COMMAND.command(COMMAND.help):
        callerName = msg.guild.members.cache.find(member => member.id === msg.author.id).displayName;
        callerName = callerName.split('-').map(res => res.trim());
        try {
            await insertSiswa(callerName)

        }catch (e) {
            await msg.channel.send('Anda sudah register');
        }
        console.log(callerName);
        break;
    }

});



client.login(process.env.TOKEN);

