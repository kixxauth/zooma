'use strict';

const os = require('os');
const path = require('path');
const net = require('net');

const fpath = path.join(os.tmpdir(), 'ncs.sock');

const server = net.createServer((client) => {
	console.log('client connected');

	client.on('end', () => {
		console.log('client disconnected');
		server.close();
	});

	client.on('data', (buff) => {
		console.log('received message size', buff.length);
	});
});

server.on('error', (err) => {
	console.log('Server error event:');
	console.log(err.stack);
});

server.listen(fpath, () => {
	console.log(`server listening on ${fpath}`);
});
