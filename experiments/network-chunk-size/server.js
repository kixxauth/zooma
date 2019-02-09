/* eslint-disable no-console */
'use strict';

const os = require('os');
const path = require('path');
const net = require('net');

// Calling client.write(chunk) multiple times results in buffer chunks getting
// mixed together. So, we'll need to parse the message.

const fpath = path.join(os.tmpdir(), 'ncs.sock');

const server = net.createServer((client) => {
	console.log('client connected');

	client.on('end', () => {
		console.log('client disconnected');
		server.close();
	});

	client.on('data', (buff) => {
		console.log(`received chunk size: ${buff.length}bytes`);
	});
});

server.on('error', (err) => {
	console.log('Server error event:');
	console.log(err.stack);
});

server.listen(fpath, () => {
	console.log(`server listening on ${fpath}`);
});
