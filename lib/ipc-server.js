const os = require('os');
const path = require('path');
const net = require('net');

// Check to make sure the directory exists and we have access.
const fpath = path.join(os.tmpdir(), 'foo.sock');

const server = net.createServer((client) => {
	console.log('client connected');

	client.on('end', () => {
		console.log('client disconnected');
	});

	client.on('data', (buff) => {
		console.log('client message:', buff.toString());
	});

	client.write('hi!');

	setTimeout(() => {
		client.write('ping!');
	}, 7000);
});

server.on('error', (err) => {
	// catch EADDRINUSE
	console.log('Server error:');
	console.log(err.stack);
});

server.listen(fpath, () => {
	console.log(`server listening on ${fpath}`);
});
