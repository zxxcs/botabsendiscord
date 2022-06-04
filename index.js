require('dotenv').config();
const mysql = require('mysql');
const { Client, Intents, Formatters } = require('discord.js');

const COMMAND = require('./command');

let mulai = false;
const day = new Date();

function insertSiswa(siswa) {
	const con = mysql.createConnection({
		host: process.env.HOSTDB,
		user: process.env.USER,
		password: process.env.PASS,
		database: process.env.DBNAME,

	});
	return new Promise((resolve, reject) => {
		con.connect();
		con.query('insert into siswa (Nama, NIM) values (? , ?)', siswa, (err, res) => {
			if (err) reject(err);
			resolve(res);
		});
		con.end();
	});
}

const getLatestIDAbsen = () => {
	const con = mysql.createConnection({
		host: process.env.HOSTDB,
		user: process.env.USER,
		password: process.env.PASS,
		database: process.env.DBNAME,

	});
	return new Promise((resolve, reject) => {
		con.connect();
		con.query('select ifnull(max(ID), 0) + 1 as ID from absen;', (err, res) => {
			if (err) reject(err);
			resolve(res);
		});
		con.end();
	});
};

const insertAbsen = (ID, NIM) => {
	const con = mysql.createConnection({
		host: process.env.HOSTDB,
		user: process.env.USER,
		password: process.env.PASS,
		database: process.env.DBNAME,

	});
	return new Promise((resolve, reject) => {
		con.connect();
		con.query('insert into absen (ID, Tanggal, NIM) values (?,NOW(),?);', [ID, NIM], (err, res) => {
			if (err) reject(err);
			resolve(res);
		});
		con.end();
	});
};

const cekAbsenHariIni = (NIM, Date) => {
	const con = mysql.createConnection({
		host: process.env.HOSTDB,
		user: process.env.USER,
		password: process.env.PASS,
		database: process.env.DBNAME,

	});
	return new Promise((resolve, reject) => {
		con.connect();
		con.query('select count(*) as Jumlah from absen a where a.NIM = ? and date(a.Tanggal) = date(?);', [NIM, Date], (err, res) => {
			if (err) reject(err);
			resolve(res);
		});
		con.end();
	});
};

const cekSiswaNIM = (NIM) => {
	const con = mysql.createConnection({
		host: process.env.HOSTDB,
		user: process.env.USER,
		password: process.env.PASS,
		database: process.env.DBNAME,

	});
	return new Promise((resolve, reject) => {
		con.connect();
		con.query('select ifnull(count(*), 0) as Jumlah from siswa s where s.NIM = ?;', [NIM], (err, res) => {
			if (err) reject(err);
			resolve(res);
		});
		con.end();
	});
};

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!\n==================================`);
});

client.on('messageCreate', async (msg) => {

	const rawinput = msg.content.toLowerCase();

	let callerName = null;
	let myRole = null;
	let isAdmin = null;
	let ID = null;
	let date = null;

	switch (rawinput) {

	case COMMAND.command(COMMAND.absen):
		if (!mulai) {
			await msg.channel.send('Belum waktunya absen');
			break;
		}
		callerName = msg.guild.members.cache.find(member => member.id === msg.author.id).displayName;
		callerName = callerName.split('-').map(res => res.trim());

		if (callerName.length !== 2) {
			await msg.channel.send('Format nama salah!');
			break;
		}

		try {
			const siswa = await cekSiswaNIM(callerName[1]);
			const result = Object.values(JSON.parse(JSON.stringify(siswa)));
			if (result[0]['Jumlah'] === 0) {
				await msg.channel.send(`Silahkan register dahulu! ${Formatters.userMention(msg.author.id)}`);
				break;
			}
		}
		catch (e) {
			console.error(e);
		}

		date = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`;

		try {
			const jumlahAbsen = await cekAbsenHariIni(callerName[1], date);
			const resultArray = Object.values(JSON.parse(JSON.stringify(jumlahAbsen)));

			if (resultArray[0]['Jumlah'] > 0) {
				await msg.channel.send(`Anda sudah absen! ${Formatters.userMention(msg.author.id)}`);
				break;
			}
		}
		catch (e) {
			console.error(e);
		}

		try {
			ID = await getLatestIDAbsen();
			const resultArray = Object.values(JSON.parse(JSON.stringify(ID)));

			await insertAbsen(resultArray[0]['ID'], callerName[1]);
			await msg.channel.send(`Terima kasih anda sudah absen! ${Formatters.userMention(msg.author.id)}`);
		}
		catch (e) {
			console.error(e);
		}

		break;


	case COMMAND.command(COMMAND.start):

		myRole = msg.guild.roles.cache.find(role => role.name === 'owner');
		isAdmin = msg.guild.members.cache.find(member => member.id === msg.author.id)
			.roles.cache.some(value => value.id === myRole.id);

		if (isAdmin) {
			if (!mulai) {
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

		if (isAdmin) {
			if (mulai) {
				await msg.channel.send('absen telah ditutup');
				mulai = false;
				break;
			}
		}
		await msg.channel.send('anda bukan admin');
		break;

	case COMMAND.command(COMMAND.register):
		callerName = msg.guild.members.cache.find(member => member.id === msg.author.id).displayName;
		callerName = callerName.split('-').map(res => res.trim());

		if (callerName.length !== 2) {
			await msg.channel.send('Format nama salah!');
			break;
		}

		try {
			await insertSiswa(callerName);
			await msg.channel.send('Anda berhasil register!');
		}
		catch (e) {
			await msg.channel.send('Anda sudah register!');
		}

		break;
	}

});


client.login(process.env.TOKEN);

