const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const network = require('./server/netstatus');

const port = 8080;
const app = express();

app.use('/', express.static('client'));

const server = http.createServer(app);
const wss = new WebSocket.Server({server});


wss.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true);

    const observer = {
        isCanceled: false,
        value: (status) => sendObject(status)
    };

    ws.on('message', function incoming(message) {
        console.log(`received: ${message}`);
        if (message == "stop") {
            observer.isCanceled = true;
        }
    });

    function sendObject(obj) {
        let msg = JSON.stringify(obj);
        ws.send(msg);
    }
    sendObject({status: "starting observing network status"});

    network.status(observer)
        .then(() => console.log("network monitor started"))
        .catch(ex => console.error(ex));
});

server.listen(port, () => console.log(`Web server listening on http://localhost:${port}`));