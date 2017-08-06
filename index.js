const express = require('express');
const WebSocket = require('ws');

const port = 8080;
const app = express();

app.use('/', express.static('static'));




app.listen(port, () => console.log(`Web server listening on http://localhost:${port}`));