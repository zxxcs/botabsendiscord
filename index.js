require('dotenv').config();
const { Client, Intents } = require('discord.js');

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