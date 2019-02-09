const os = require('os');
const path = require('path');
const net = require('net');

// Check to make sure the directory exists and we have access.
const fpath = path.join(os.tmpdir(), 'foo.sock');

const client = net.createConnection({ path: fpath }, () => {
	console.log('connected');

	setTimeout(() => {
		client.write(`a message`);
	}, 3000);

	client.on('data', (buff) => {
		console.log('message from server:', buff.toString());
	});
});

client.on('error', (err) => {
	// Catch ECONNREFUSED
	console.log('ERROR event');
	console.log(err.stack);
});

