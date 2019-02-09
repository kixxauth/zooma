'use strict';

const os = require('os');
const path = require('path');
const net = require('net');

// tests:
// 1. max message size 8192

const fpath = path.join(os.tmpdir(), 'ncs.sock');

// String length 100
const STR = 'sdfklasdfasjnw34509iukjnw4rt90uasdflkjw4ert-=90iuasdfoi23450-8asdflihjq234590-iuasdflk-0234-=jw34023';

function genString(length) {
	const lines = Math.ceil(length / STR.length);
	let str = '';
	for (let i = 0; i < lines; i++) {
		str += STR;
	}
	return str.slice(0, length);
}

const client = net.createConnection({ path: fpath }, () => {
	console.log('connected');

	let size = 10;

	setInterval(() => {
		if (size < 10000000) {
			size = size * 10;
		} else {
			size += 1000;
		}
		const str = genString(size);
		console.log('sent message size', Buffer.byteLength(str));
		client.write(str);
		console.log('client buffer size', client.bufferSize);
	}, 1000);
});

client.on('error', (err) => {
	console.log('Client error event:');
	console.log(err.stack);
});

