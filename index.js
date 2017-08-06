const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const port = 8080;
const app = express();

app.use('/', express.static('static'));

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

wss.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true);

    ws.on('message', function incoming(message) {
        console.log(`received: ${message}`);
    });

    ws.send('Hello world');
});

server.listen(port, () => console.log(`Web server listening on http://localhost:${port}`));