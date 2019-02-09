/* eslint-disable no-console */
'use strict';

const os = require('os');
const path = require('path');
const net = require('net');

// tests:
// 1. max message size 8192
// 2. max message size 8192
// 3. max message size 8192
//
// Note that 8192 is exactly 1/2 of the 16kb highWaterMark.
//

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

function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

function sendMessage(client, message) {
	return new Promise((resolve, reject) => {
		const chunks = [ 'HEADER', message, 'TRAILER' ];
		let canWrite = true;

		function resolveOrReject(err, res) {
			client.removeListener('error', onError);
			client.removeListener('drain', onDrain);
			if (err) return reject(err);
			return resolve(true);
		}

		function onError(err) {
			resolveOrReject(err);
		}

		function onDrain() {
			canWrite = true;
			sendNextChunk();
		}

		client.on('error', onError);
		client.on('drain', onDrain);

		function sendNextChunk() {
			if (!canWrite) return;
			if (chunks.length === 0) return resolveOrReject(null, true);

			const chunk = chunks.shift();
			canWrite = client.write(chunk);

			console.log(`sent chunk size    : ${Buffer.byteLength(chunk)}bytes`);
			console.log(`client buffer size : ${Math.ceil(client.bufferSize / 1024)}kb`);

			sendNextChunk();
		}

		sendNextChunk();
	});
}

const client = net.createConnection({ path: fpath }, () => {
	console.log(`connected to ${fpath}`);

	let size = 0;

	function sendNextMessage() {
		return delay(1500).then(() => {
			size += 1000;
			const message = genString(size);
			return sendMessage(client, message).then(sendNextMessage);
		}).catch((err) => {
			console.log('Fatal client error:');
			console.log(err.stack);
		});
	}

	sendNextMessage();
});

client.on('error', (err) => {
	console.log('Client error event:');
	console.log(err.stack);
});

