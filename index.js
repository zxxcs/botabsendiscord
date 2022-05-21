require('dotenv').config();
const mysql = require('mysql');
const { Client, Intents } = require('discord.js');

const con = mysql.createConnection({
    host: process.env.HOSTDB,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DBNAME

})


con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM siswa", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
});


const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!\n==================================`);
});

client.on('messageCreate', async (msg) => {
    const rawinput = msg.content.toLowerCase();
    switch (rawinput) {

        case 'tes':
            await msg.channel.send(`Tis`);
            break;
    }

});

client.login(process.env.TOKEN);

