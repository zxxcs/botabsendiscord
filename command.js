const prefix = '.';
const absen = 'absen';
const start = 'start';
const stop = 'stop';
const help = 'help';
const register = 'register';

const command = (cmd) => {
	return `${prefix}${cmd}`;
};

module.exports = { absen, start, stop, help, command, register };