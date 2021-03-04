const express = require('express');
const app = express();

const data = JSON.parse(require('fs').readFileSync('data.json', 'utf-8'));

app.get('/ping', function (req, res) {
    return res.send(`OK ${Date.now()}`);
});

app.get('/search', function (req, res) {
    return res.json(data);
});

app.listen(process.env.PORT || 8080);