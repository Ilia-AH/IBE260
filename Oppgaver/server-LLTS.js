const http = require('http');
const express = require('express');
const app = express();
const port = 3000;

http.createServer(app).listen(port, () => {
    console.log("Server listening on port " + port);
});

app.get('/', (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
        <head>
        </head>
    <body>
        <button type="button" onclick="alert('Oisann, oppgave 3 er bekreftet')">Clicky?</button>
    </body>
    </html>`);
});

